
import { Link } from 'react-router-dom';
import { useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { useMobileSuitEditor } from '@/hooks/admin/useMobileSuitEditor';
import { AdminSection, AdminInput, AdminTextArea, AdminListInput, AdminImageUpload } from '@/components/admin/ui/AdminForm';

const SECTION_KEYS = {
    production: [
        'Model number', 'Code name', 'Type', 'Completed',
        'First deployment', 'Manufacturer', 'Operator'
    ],
    development: [
        'Developed from', 'Developed into'
    ],
    specifications: [
        'Crew', 'Cockpit location', 'Standard weight', 'Full weight',
        'Sensors', 'Cockpit', 'Height', 'Armor materials'
    ],
    performance: [
        'Power plant', 'Power output', 'Propulsion', 'Flight system',
        'Max speed', '180° turn time', 'Thrust to weight'
    ]
};

export function MobileSuitEditor() {
    const { form, isEditMode, isFetching, isSaving, onSubmit, selectedImage, setSelectedImage, currentSuit } = useMobileSuitEditor();
    const { register, control } = form;

    const { fields: armamentFields, append: appendArmament, remove: removeArmament } = useFieldArray({
        control,
        name: "armaments"
    });

    if (isEditMode && isFetching) {
        return <div className="min-h-screen flex items-center justify-center text-brand-500 font-orbitron">Loading Data...</div>;
    }

    return (
        <div className="font-exo">
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/mobile-suits" className="text-gray-500 dark:text-gray-400 hover:text-brand-500 flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                </Link>
                <button
                    onClick={onSubmit}
                    disabled={isSaving}
                    className="bg-brand-500 text-white font-bold font-orbitron px-6 py-2 rounded hover:bg-brand-600 transition flex items-center"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    SAVE
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-orbitron text-gray-900 dark:text-white font-bold">
                        {isEditMode ? `Edit: ${currentSuit?.name}` : 'New Mobile Suit Entry'}
                    </h1>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    {/* 1. Core Info */}
                    <AdminSection title="Core Identification">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput label="Name *" name="name" register={register} rules={{ required: true }} />
                            <AdminInput label="Series" name="series" register={register} />
                            <div className="md:col-span-2">
                                <AdminInput label="Legacy Source URL (Unique ID) *" name="url" register={register} rules={{ required: true }} className="text-xs text-brand-500 font-mono" />
                            </div>

                            <AdminImageUpload
                                currentImageUrl={currentSuit?.imageUrl}
                                selectedImage={selectedImage}
                                onImageSelect={setSelectedImage}
                            />

                            <div className="md:col-span-2">
                                <AdminTextArea label="Description" name="description" register={register} />
                            </div>
                        </div>
                    </AdminSection>

                    {/* 2. Technical Data Groups */}
                    <div>
                        <h2 className="text-xl font-orbitron text-gray-900 dark:text-white mb-4">Technical Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(Object.keys(SECTION_KEYS) as Array<keyof typeof SECTION_KEYS>).map((section) => (
                                <div key={section} className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                                    <h3 className="text-sm font-bold text-brand-500 mb-4 uppercase tracking-wider">{section}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {SECTION_KEYS[section].map((key) => (
                                            <AdminInput
                                                key={key}
                                                label={key}
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                name={`${section}.${key}` as any}
                                                register={register}
                                                placeholder={key}
                                                fullWidth
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Armaments */}
                    <AdminSection title="Armaments">
                        <div className="flex justify-end space-x-2 mb-4">
                            <button type="button" onClick={() => appendArmament({ category: 'Fixed', items: [''] })} className="text-xs bg-brand-500/10 text-brand-500 px-3 py-1 rounded hover:bg-brand-500/20">+ Fixed</button>
                            <button type="button" onClick={() => appendArmament({ category: 'Handheld', items: [''] })} className="text-xs bg-purple-500/10 text-purple-500 px-3 py-1 rounded hover:bg-purple-500/20">+ Handheld</button>
                        </div>
                        <div className="space-y-4">
                            {armamentFields.map((field, index) => (
                                <div key={field.id} className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 flex gap-4 items-start">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <input
                                                {...register(`armaments.${index}.category`)}
                                                className="bg-transparent border-b border-gray-200 dark:border-gray-700 text-brand-500 font-bold w-1/3 focus:border-brand-500 outline-none"
                                                placeholder="Category"
                                            />
                                            <button type="button" onClick={() => removeArmament(index)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <AdminListInput
                                            label="Items"
                                            name={`armaments.${index}.items`}
                                            control={control}
                                        />
                                    </div>
                                </div>
                            ))}
                            {armamentFields.length === 0 && <p className="text-center text-gray-400 text-sm py-4 italic">No armaments recorded.</p>}
                        </div>
                    </AdminSection>

                    {/* 4. Rich Text / Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminSection title="Historical Data">
                            <AdminTextArea label="History & Background" name="history" register={register} heightClass="h-64" placeholder="Comprehensive history..." />
                        </AdminSection>

                        <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                            <h2 className="text-xl font-orbitron text-gray-900 dark:text-white mb-4">Database Links</h2>
                            <AdminListInput label="Variants" name="variants" control={control} description="Separate with new lines" />
                            <AdminListInput label="Known Pilots" name="knownPilots" control={control} description="Separate with new lines" />
                            <AdminListInput label="Appearances" name="appearances" control={control} description="Separate with new lines" />
                        </div>
                    </div>

                    {/* 5. Extra */}
                    <AdminSection title="Behind The Scenes">
                        <AdminTextArea label="Additional Notes" name="behindTheScenes" register={register} heightClass="h-32" />
                    </AdminSection>
                </form>
            </div>
        </div>
    );
}
