
import { motion } from 'framer-motion';
import type { LoreMobileSuit } from '@/services/lore';

interface SuitHeaderProps {
    suit: LoreMobileSuit;
    isUploading: boolean;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SuitHeader({ suit, isUploading, handleImageUpload }: SuitHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 rounded-lg overflow-hidden border border-border bg-black/40 group h-fit"
        >
            <div className="absolute inset-0 bg-cyber-grid opacity-30" />
            {suit.imageUrl ? (
                <img src={suit.imageUrl} alt={suit.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full aspect-square flex items-center justify-center text-foreground/20">NO VISUAL</div>
            )}

            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-10">
                {isUploading ? (
                    <div className="text-neon-blue font-orbitron animate-pulse">UPLOADING...</div>
                ) : (
                    <>
                        <div className="bg-neon-blue p-3 rounded-full mb-2">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </div>
                        <span className="text-neon-blue font-orbitron text-sm">CHANGE IMAGE</span>
                    </>
                )}
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                />
            </label>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black to-transparent pointer-events-none">
                <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-2">{suit.name}</h1>
                <span className="inline-block px-3 py-1 bg-neon-blue/20 border border-neon-blue/50 text-neon-blue font-mono text-xs">
                    {suit.series}
                </span>
            </div>
        </motion.div>
    );
}
