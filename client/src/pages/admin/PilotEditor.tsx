import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { usePilotEditor } from '@/hooks/admin/usePilotEditor';
import { AdminSection, AdminInput, AdminTextArea, AdminImageUpload, AdminListInput } from '@/components/admin/ui/AdminForm';
import type { LoreCharacter } from '@/types/LoreCharacter';

export function PilotEditor() {
    const {
        form: { register, control },
        isEditMode,
        isFetching,
        isSaving,
        previewUrl,
        handleFileSelect,
        onSubmit,
        pilotName
    } = usePilotEditor();

    if (isEditMode && isFetching) {
        return <div className="min-h-screen flex items-center justify-center text-brand-500 font-orbitron">Loading Data...</div>;
    }

    return (
        <div className="font-exo">
            <Link to="/admin/pilots" className="text-gray-500 dark:text-gray-400 flex items-center mb-6 hover:text-brand-500 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Link>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-4xl mx-auto shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-orbitron text-gray-900 dark:text-white font-bold">
                        {isEditMode ? `Edit Pilot: ${pilotName}` : 'New Pilot Record'}
                    </h1>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    <AdminSection title="Personnel Identity">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <AdminImageUpload
                                currentImageUrl={previewUrl || undefined}
                                selectedImage={null}
                                onImageSelect={handleFileSelect}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput<Partial<LoreCharacter>> label="Pilot Name *" name="name" register={register} rules={{ required: true }} />
                            <AdminInput<Partial<LoreCharacter>> label="Series / Timeline" name="series" register={register} />

                            {/* Profile Fields */}
                            <AdminInput<Partial<LoreCharacter>> label="Rank" name="profile.Rank" register={register} />
                            <AdminInput<Partial<LoreCharacter>> label="Affiliation" name="profile.Affiliation" register={register} />

                            <div className="md:col-span-2">
                                <AdminTextArea<Partial<LoreCharacter>> label="Short Description (Card Summary)" name="description" register={register} />
                            </div>
                        </div>
                    </AdminSection>

                    <AdminSection title="Personnel Attributes">
                        <AdminTextArea<Partial<LoreCharacter>> label="Biography / History" name="history" register={register} />
                        <AdminTextArea<Partial<LoreCharacter>> label="Personality Profile" name="personality" register={register} />
                        <AdminTextArea<Partial<LoreCharacter>> label="Combat Skills & Abilities" name="skills" register={register} />
                        <AdminTextArea<Partial<LoreCharacter>> label="Additional Notes" name="notes" register={register} />
                    </AdminSection>

                    <AdminSection title="Service Record">
                        {/* Assuming mecha is string[] but treating as comma separated string for UI simplicity if ListInput doesn't support direct array binding well without control, 
                            Actually AdminListInput is designed for this. */}
                        <AdminListInput<Partial<LoreCharacter>> label="Assigned Units (Mecha)" name="mecha" control={control} description="List mobile suits piloted, one per line." />
                        <AdminListInput<Partial<LoreCharacter>> label="Vehicles / Other" name="vehicles" control={control} description="List other vehicles, one per line." />
                    </AdminSection>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-brand-500 text-white font-bold font-orbitron px-8 py-3 rounded hover:bg-brand-600 transition flex items-center shadow-lg hover:shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            SAVE RECORD
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
