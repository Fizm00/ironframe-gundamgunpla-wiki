import { Users, Crosshair } from 'lucide-react';
import type { Faction } from '@/services/factions';

interface FactionSidebarProps {
    faction: Faction;
}

export function FactionSidebar({ faction }: FactionSidebarProps) {
    return (
        <div className="bg-surface/50 border border-t-2 border-t-neon-cyan border-border p-6 rounded-b-lg shadow-lg sticky top-32">
            <h4 className="font-orbitron font-bold text-foreground mb-4 border-b border-border pb-2">DATA SHEET</h4>

            <div className="space-y-4 text-sm">
                <div>
                    <span className="block text-[10px] font-mono text-neon-cyan uppercase tracking-wider mb-1">FOUNDED/ACTIVE ERA</span>
                    <p className="text-foreground">{faction.activeEra}</p>
                </div>

                {faction.purpose && (
                    <div>
                        <span className="block text-[10px] font-mono text-neon-gold uppercase tracking-wider mb-1">PRIMARY PURPOSE</span>
                        <p className="text-foreground">{faction.purpose}</p>
                    </div>
                )}

                {faction.sphereOfInfluence && (
                    <div>
                        <span className="block text-[10px] font-mono text-neon-blue uppercase tracking-wider mb-1">SPHERE OF INFLUENCE</span>
                        <p className="text-foreground">{faction.sphereOfInfluence}</p>
                    </div>
                )}

                {faction.firstSeen && (
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="block text-[10px] font-mono text-neon-cyan/80 uppercase tracking-wider mb-1">FIRST SEEN</span>
                            <p className="text-foreground text-xs">{faction.firstSeen}</p>
                        </div>
                        {faction.lastSeen && (
                            <div>
                                <span className="block text-[10px] font-mono text-neon-red/80 uppercase tracking-wider mb-1">LAST SEEN</span>
                                <p className="text-foreground text-xs">{faction.lastSeen}</p>
                            </div>
                        )}
                    </div>
                )}

                {faction.allies && faction.allies.length > 0 && (
                    <div>
                        <span className="block text-[10px] font-mono text-neon-cyan uppercase tracking-wider mb-1">ALLIANCES</span>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {faction.allies.map(a => (
                                <span key={a} className="text-foreground-muted flex items-center gap-1">
                                    <Users className="w-3 h-3 text-neon-blue" /> {a}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {faction.enemies && faction.enemies.length > 0 && (
                    <div>
                        <span className="block text-[10px] font-mono text-neon-red uppercase tracking-wider mb-1">KNOWN ENEMIES</span>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {faction.enemies.map(e => (
                                <span key={e} className="text-foreground-muted flex items-center gap-1">
                                    <Crosshair className="w-3 h-3 text-neon-red" /> {e}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <span className="block text-[10px] font-mono text-neon-cyan uppercase tracking-wider mb-1">MILITARY STRENGTH</span>
                    <p className="text-foreground">{faction.forces?.length || 0} Registered Units</p>
                </div>

                <div>
                    <span className="block text-[10px] font-mono text-neon-cyan uppercase tracking-wider mb-1">DATABASE VALIDATION</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {faction.history && <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-[10px] rounded">HISTORY</span>}
                        {faction.government && <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-[10px] rounded">GOVT</span>}
                        {faction.military && <span className="px-2 py-1 bg-neon-red/20 text-neon-red text-[10px] rounded">MILITARY</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
