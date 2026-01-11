import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import { useFactionEditor } from '@/hooks/admin/useFactionEditor';
import { AdminSection, AdminInput, AdminTextArea, AdminImageUpload } from '@/components/admin/ui/AdminForm';
import { ForceEditor } from '@/components/admin/factions/ForceEditor';
import type { Faction } from '@/services/factions';

export function FactionEditor() {
    const {
        form: { register, control },
        isEditMode,
        isFetching,
        isSaving,
        forceFields,
        appendForce,
        removeForce,
        onSubmit,
        factionName,
        previewUrl,
        handleFileSelect
    } = useFactionEditor();

    if (isEditMode && isFetching) {
        return <div className="min-h-screen flex items-center justify-center text-brand-500 font-orbitron">Loading Data...</div>;
    }

    const handleAddForce = () => {
        appendForce({
            name: '',
            teams: [],
            ledBy: [],
            subdivisions: [],
            allies: [],
            enemies: [],
            branches: [],
            majorMilitaryBases: [],
            members: [],
            militaryRanks: [],
            mobileWeapons: [],
            vehicles: []
        });
    };

    return (
        <div className="font-exo">
            <Link to="/admin/factions" className="text-gray-500 dark:text-gray-400 flex items-center mb-6 hover:text-brand-500 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Link>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-4xl mx-auto shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-orbitron text-gray-900 dark:text-white font-bold">
                        {isEditMode ? `Edit Faction: ${factionName}` : 'New Geopolitical Entity'}
                    </h1>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    <AdminSection title="Core Identity">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <AdminImageUpload
                                currentImageUrl={previewUrl || undefined}
                                selectedImage={null}
                                onImageSelect={handleFileSelect}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput<Partial<Faction>> label="Faction Name *" name="name" register={register} rules={{ required: true }} />
                            <AdminInput<Partial<Faction>> label="Active Timeline / Era *" name="activeEra" register={register} rules={{ required: true }} placeholder="e.g., Universal Century" />

                            <div className="md:col-span-2">
                                <AdminTextArea<Partial<Faction>> label="Description" name="description" register={register} />
                            </div>
                        </div>
                    </AdminSection>

                    <AdminSection title="Military Organization (Forces & Teams)">
                        <div className="bg-background/50 rounded-lg p-4">
                            {forceFields.map((field, index) => (
                                <ForceEditor
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    remove={removeForce}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={handleAddForce}
                                className="w-full py-3 border-2 border-dashed border-border rounded-lg text-foreground-muted hover:text-brand-500 hover:border-brand-500/50 hover:bg-brand-500/5 transition flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> ADD NEW MILITARY BRANCH
                            </button>
                        </div>
                    </AdminSection>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-brand-500 text-white font-bold font-orbitron px-8 py-3 rounded hover:bg-brand-600 transition flex items-center shadow-lg hover:shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            SAVE FACTION
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
