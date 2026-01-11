import { Wrench, Target, ChevronRight } from 'lucide-react';
import type { Faction } from '@/services/factions';

interface FactionTechProps {
    faction: Faction;
    weaponImages: Record<string, string>;
}

export function FactionTech({ faction, weaponImages }: FactionTechProps) {
    return (
        <div className="space-y-8">
            {faction.technologies && (
                <div className="bg-surface/30 border border-border rounded-lg p-6 md:p-8">
                    <h3 className="text-xl font-orbitron text-neon-gold mb-4 flex items-center gap-2">
                        <Wrench className="w-5 h-5" /> TECHNOLOGY & R&D
                    </h3>
                    <div className="prose prose-invert max-w-none text-foreground-muted whitespace-pre-line">
                        {faction.technologies}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface/30 border border-border rounded-lg p-6 md:col-span-2">
                    <h4 className="font-orbitron text-lg text-neon-red mb-4">MOBILE WEAPONS</h4>
                    {faction.mobileWeapons && faction.mobileWeapons.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {faction.mobileWeapons.map((mw, i) => (
                                <div key={i} className="group relative bg-black/40 border border-white/10 rounded overflow-hidden hover:border-neon-red/50 transition-all">
                                    <div className="aspect-square bg-surface/50 overflow-hidden relative">
                                        {weaponImages[mw] ? (
                                            <img src={weaponImages[mw]} alt={mw} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                                <Target className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-2">
                                        <span className="text-xs font-bold text-white group-hover:text-neon-red line-clamp-2 leading-tight">
                                            {mw}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-foreground-muted italic">No mobile weapon data locally archived.</p>}
                </div>

                <div className="bg-surface/30 border border-border rounded-lg p-6">
                    <h4 className="font-orbitron text-lg text-neon-cyan mb-4">VEHICLES</h4>
                    {faction.vehicles && faction.vehicles.length > 0 ? (
                        <ul className="space-y-2">
                            {faction.vehicles.map((v, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-foreground-muted">
                                    <ChevronRight className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                                    {v}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-foreground-muted italic">No vehicle data recorded.</p>}
                </div>

                <div className="bg-surface/30 border border-border rounded-lg p-6">
                    <h4 className="font-orbitron text-lg text-neon-purple mb-4">MISCELLANEOUS ARCHIVES</h4>
                    {faction.miscellaneous && faction.miscellaneous.length > 0 ? (
                        <ul className="space-y-2">
                            {faction.miscellaneous.map((m, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-foreground-muted">
                                    <ChevronRight className="w-4 h-4 text-neon-purple shrink-0 mt-0.5" />
                                    {m}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-foreground-muted italic">No miscellaneous data.</p>}
                </div>
            </div>
        </div>
    );
}
