import { Target } from 'lucide-react';
import type { Faction } from '@/services/factions';

interface FactionMilitaryProps {
    faction: Faction;
}

export function FactionMilitary({ faction }: FactionMilitaryProps) {
    return (
        <div className="space-y-8">
            {faction.military && (
                <div className="bg-surface/30 border border-border rounded-lg p-6 md:p-8 mb-8">
                    <h3 className="text-2xl font-orbitron text-neon-red mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6" /> MILITARY DOCTRINE
                    </h3>
                    <div className="prose prose-invert max-w-none text-foreground-muted whitespace-pre-line">
                        {faction.military}
                    </div>
                </div>
            )}

            <h3 className="text-xl font-orbitron text-neon-cyan mb-6 pl-2 border-l-4 border-neon-cyan">
                ACTIVE FORCES ({faction.forces?.length || 0})
            </h3>

            <div className="grid grid-cols-1 gap-6">
                {faction.forces?.map((force, idx) => (
                    <div key={idx} className="bg-surface/50 border border-border rounded-lg overflow-hidden hover:border-neon-cyan/50 transition-all group flex flex-col md:flex-row">
                        {force.imageUrl && (
                            <div className="md:w-64 h-48 md:h-auto overflow-hidden bg-black/40 relative shrink-0">
                                <img
                                    src={force.imageUrl}
                                    alt={force.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-white font-mono border border-white/20">
                                    {force.branches && force.branches.length > 0 ? "BRANCH" : "UNIT"}
                                </div>
                            </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-orbitron font-bold text-xl text-white group-hover:text-neon-cyan transition-colors">
                                    {force.name}
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                {force.purpose && (
                                    <div className="col-span-full">
                                        <span className="text-neon-gold text-xs font-mono uppercase">PURPOSE</span>
                                        <p className="text-foreground-muted">{force.purpose}</p>
                                    </div>
                                )}
                                {force.ledBy && force.ledBy.length > 0 && (
                                    <div>
                                        <span className="text-neon-purple text-xs font-mono uppercase">COMMANDER</span>
                                        <p className="text-foreground">{force.ledBy.join(', ')}</p>
                                    </div>
                                )}
                                {force.headquarters && (
                                    <div>
                                        <span className="text-neon-blue text-xs font-mono uppercase">HQ</span>
                                        <p className="text-foreground">{force.headquarters}</p>
                                    </div>
                                )}
                            </div>

                            {force.description && (
                                <p className="text-sm text-foreground-muted mb-4 border-l-2 border-white/10 pl-3">
                                    {force.description}
                                </p>
                            )}

                            {force.subdivisions && force.subdivisions.length > 0 && (
                                <div className="mb-4">
                                    <span className="text-neon-cyan text-xs font-mono uppercase block mb-1">SUBDIVISIONS</span>
                                    <div className="flex flex-wrap gap-2">
                                        {force.subdivisions.map(sub => (
                                            <span key={sub} className="px-2 py-1 bg-surface border border-border rounded text-xs text-foreground-muted">{sub}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto space-y-4 pt-4 border-t border-border/50">
                                {(force.teams?.length > 0 || (force.members && force.members.length > 0)) && (
                                    <div className="flex flex-wrap gap-6">
                                        {force.teams?.length > 0 && (
                                            <div className="text-xs">
                                                <span className="text-neon-blue font-bold mb-1 block">SUB-TEAMS</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {force.teams.slice(0, 5).map(t => (
                                                        <span key={t} className="px-1.5 py-0.5 bg-neon-blue/10 border border-neon-blue/30 rounded text-neon-blue/80">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    {force.teams.length > 5 && (
                                                        <span className="px-1.5 py-0.5 text-foreground-muted text-[10px]">+{force.teams.length - 5} more</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {force.members && force.members.length > 0 && (
                                            <div className="text-xs">
                                                <span className="text-neon-purple font-bold mb-1 block">NOTABLE MEMBERS</span>
                                                <p className="text-foreground-muted max-w-md line-clamp-2">{force.members.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {(!faction.forces || faction.forces.length === 0) && (
                    <div className="col-span-full py-12 text-center text-foreground-muted border border-border border-dashed rounded bg-surface/20">
                        NO MILITARY FORCE DATA CLASSIFIED
                    </div>
                )}
            </div>
        </div>
    );
}
