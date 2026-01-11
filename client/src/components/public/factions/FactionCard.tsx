import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import type { Faction } from '@/services/factions';

interface FactionCardProps {
    faction: Faction;
}

export function FactionCard({ faction }: FactionCardProps) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={item}>
            <Link to={`/factions/${faction._id}`} className="block group h-full">
                <div className="bg-surface/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden h-full hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,188,212,0.15)] transition-all duration-300 flex flex-col relative">
                    {/* Image Container */}
                    <div className="h-48 overflow-hidden relative border-b border-white/5">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                        {faction.imageUrl ? (
                            <img
                                src={faction.imageUrl}
                                alt={faction.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <Shield className="w-12 h-12 text-gray-600" />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 to-transparent z-20 flex justify-between items-end">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 backdrop-blur-md">
                                {faction.activeEra}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col grow">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-2 group-hover:text-neon-cyan transition-colors line-clamp-1" title={faction.name}>
                            {faction.name}
                        </h3>

                        <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed grow">
                            {faction.description || "No description available."}
                        </p>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                            <div className="text-xs text-gray-500 font-mono">
                                {faction.forces?.length || 0} MILITARY UNITS
                            </div>
                            <span className="text-neon-cyan text-xs font-bold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                ACCESS DATA <ChevronRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-white/5 to-transparent pointer-events-none" />
                </div>
            </Link>
        </motion.div>
    );
}
