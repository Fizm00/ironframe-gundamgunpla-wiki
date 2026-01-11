import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flag, ChevronLeft } from 'lucide-react';
import type { Faction } from '@/services/factions';

interface FactionHeroProps {
    faction: Faction;
}

export function FactionHero({ faction }: FactionHeroProps) {
    return (
        <div className="relative h-[60vh] overflow-hidden">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-20" />

            {faction.imageUrl ? (
                <img
                    src={faction.imageUrl}
                    alt={faction.name}
                    className="w-full h-full object-cover object-center"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-cyber-grid-pattern opacity-10">
                    <Flag className="w-32 h-32" />
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-30 container mx-auto px-4 pb-12">
                <Link to="/factions" className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-blue transition-colors mb-6 font-mono text-sm">
                    <ChevronLeft className="w-4 h-4" /> BACK TO DATABASE
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-end gap-6"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-neon-cyan/20 border border-neon-cyan/50 rounded text-neon-cyan text-xs font-mono font-bold tracking-wider">
                                {faction.activeEra}
                            </span>
                            {faction.organizationType && (
                                <span className="px-2 py-1 bg-white/10 border border-white/20 rounded text-foreground-muted text-xs font-mono font-bold tracking-wider">
                                    {faction.organizationType}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4 tracking-tight drop-shadow-neon-cyan">
                            {faction.name}
                        </h1>
                        {faction.leaders && faction.leaders.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neon-purple font-mono">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
                                    <span>LEADER: {faction.leaders.join(', ')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
