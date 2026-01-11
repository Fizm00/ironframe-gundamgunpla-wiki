import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useGunplaEditor } from '@/hooks/admin/useGunplaEditor';
import { AdminSection, AdminInput, AdminTextArea, AdminImageUpload, AdminListInput } from '@/components/admin/ui/AdminForm';
import type { MobileSuit } from '@/services/mobileSuits';

export function GunplaEditor() {
    const {
        form: { register, control },
        isEditMode,
        isFetching,
        isSaving,
        previewUrl,
        handleFileSelect,
        onSubmit,
        suitName
    } = useGunplaEditor();

    if (isEditMode && isFetching) {
        return <div className="min-h-screen flex items-center justify-center text-brand-500 font-orbitron">Loading Data...</div>;
    }

    return (
        <div className="font-exo">
            <Link to="/admin/gunpla" className="text-gray-500 dark:text-gray-400 flex items-center mb-6 hover:text-brand-500 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Link>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-4xl mx-auto shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className="text-3xl font-orbitron text-gray-900 dark:text-white font-bold">
                        {isEditMode ? `Edit Product: ${suitName}` : 'New Gunpla Product'}
                    </h1>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    <AdminSection title="Product Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <AdminImageUpload
                                currentImageUrl={previewUrl || undefined}
                                selectedImage={null} // We handle preview in hook/state, simpler to verify functionality
                                onImageSelect={handleFileSelect}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminInput<Partial<MobileSuit>> label="Product Name *" name="name" register={register} rules={{ required: true }} />
                            <AdminInput<Partial<MobileSuit>> label="Model Number" name="modelNumber" register={register} />

                            <div>
                                <label className="block text-xs font-mono text-gray-500 dark:text-gray-400 mb-1 uppercase">Grade</label>
                                <select {...register('grade')} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 focus:border-brand-500 outline-none text-gray-900 dark:text-white">
                                    <option value="">Select Grade...</option>
                                    <option value="HG">High Grade (HG)</option>
                                    <option value="RG">Real Grade (RG)</option>
                                    <option value="MG">Master Grade (MG)</option>
                                    <option value="PG">Perfect Grade (PG)</option>
                                    <option value="SD">Super Deformed (SD)</option>
                                </select>
                            </div>

                            <AdminInput<Partial<MobileSuit>> label="Scale" name="scale" register={register} />
                            <AdminInput<Partial<MobileSuit>> label="Price (¥)" name="price" register={register} />
                            <AdminInput<Partial<MobileSuit>> label="Release Date" name="releaseDate" register={register} placeholder="YYYY-MM-DD" />

                            <div className="md:col-span-2">
                                <AdminTextArea<Partial<MobileSuit>> label="Description" name="description" register={register} />
                            </div>
                        </div>
                    </AdminSection>

                    <AdminSection title="Specifications">
                        <AdminListInput<Partial<MobileSuit>> label="Armaments" name="armaments" control={control} description="List weapons and equipment, one per line." />
                    </AdminSection>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-brand-500 text-white font-bold font-orbitron px-8 py-3 rounded hover:bg-brand-600 transition flex items-center shadow-lg hover:shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            SAVE PRODUCT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
