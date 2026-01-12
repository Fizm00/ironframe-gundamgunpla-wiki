import type { UseFormReturn } from 'react-hook-form';
import type { LoreMobileSuit } from '@/services/lore';

interface LoreCoreInfoProps {
    form: UseFormReturn<Partial<LoreMobileSuit>>;
    currentImageUrl?: string;
    selectedImage: File | null;
    onImageSelect: (file: File) => void;
}

export function LoreCoreInfo({ form, currentImageUrl, selectedImage, onImageSelect }: LoreCoreInfoProps) {
    const { register } = form;

    return (
        <div className="bg-black/20 p-6 rounded border border-white/10">
            <h2 className="text-xl font-orbitron text-white mb-4">Core Identification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono text-white/60 mb-1">Name *</label>
                    <input {...register('name', { required: true })} className="w-full bg-black/40 border border-white/20 rounded p-2 focus:border-neon-blue outline-none text-lg font-bold" />
                </div>
                <div>
                    <label className="block text-xs font-mono text-white/60 mb-1">Series</label>
                    <input {...register('series')} className="w-full bg-black/40 border border-white/20 rounded p-2 focus:border-neon-blue outline-none" />
                </div>
            </div>

            <div className="md:col-span-2 mt-4">
                <label className="block text-xs font-mono text-white/60 mb-1">Legacy Source URL (Unique ID) *</label>
                <input {...register('url', { required: true })} className="w-full bg-black/40 border border-white/20 rounded p-2 focus:border-neon-blue outline-none font-mono text-xs text-neon-cyan" />
            </div>

            <div className="md:col-span-2 mt-4">
                <label className="block text-xs font-mono text-white/60 mb-2">Display Image</label>
                <div className="flex items-center space-x-4 bg-black/40 p-4 rounded border border-white/10">
                    {currentImageUrl && !selectedImage && (
                        <div className="relative group">
                            <img src={currentImageUrl} alt="Current" className="w-20 h-20 object-cover rounded border border-white/20" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white">Current</div>
                        </div>
                    )}
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    onImageSelect(e.target.files[0]);
                                }
                            }}
                            className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-neon-blue/10 file:text-neon-blue
                                    hover:file:bg-neon-blue/20 cursour-pointer"
                        />
                        <p className="text-[10px] text-white/40 mt-2">
                            Selected: {selectedImage ? selectedImage.name : 'No file selected'}
                        </p>
                    </div>
                </div>
                <div className="md:col-span-2 mt-4">
                    <label className="block text-xs font-mono text-white/60 mb-1">Description</label>
                    <textarea {...register('description')} className="w-full bg-black/40 border border-white/20 rounded p-2 h-24 focus:border-neon-blue outline-none" />
                </div>
            </div>
        </div>
    );
}
