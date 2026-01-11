
import { Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MobileSuit } from '@/services/mobileSuits';

interface GunplaVisualsProps {
    mobileSuit: MobileSuit;
}

export function GunplaVisuals({ mobileSuit }: GunplaVisualsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
        >
            <div className="aspect-4/3 bg-surface border border-border relative overflow-hidden group">
                {mobileSuit.imageUrl ? (
                    <img src={mobileSuit.imageUrl} alt={mobileSuit.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-foreground-muted/20">
                        <Crosshair className="w-32 h-32 mb-4 animate-spin-slow" />
                        <span className="font-orbitron text-2xl tracking-[0.5em]">NO VISUAL</span>
                    </div>
                )}

                <div className="absolute top-4 left-4 w-20 h-1 bg-neon-cyan/50" />
                <div className="absolute top-4 left-4 h-20 w-1 bg-neon-cyan/50" />
                <div className="absolute bottom-4 right-4 w-20 h-1 bg-neon-cyan/50" />
                <div className="absolute bottom-4 right-4 h-20 w-1 bg-neon-cyan/50" />

                <div className="absolute bottom-8 left-8">
                    <h1 className="text-5xl md:text-7xl font-orbitron font-black text-foreground/5 uppercase tracking-tighter leading-none select-none">
                        {mobileSuit.modelNumber}
                    </h1>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-end border-b border-border pb-4">
                <div>
                    <h2 className="text-sm font-mono text-neon-cyan tracking-widest mb-1">UNIT DESIGNATION</h2>
                    <p className="text-3xl font-orbitron font-bold text-foreground uppercase">{mobileSuit.name}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xs font-mono text-foreground-muted tracking-widest mb-1">MANUFACTURER</h2>
                    <p className="text-xl font-exo text-foreground uppercase">{mobileSuit.manufacturer}</p>
                </div>
            </div>
        </motion.div>
    );
}
