import { Database, Info } from 'lucide-react';
import type { Faction } from '@/services/factions';

interface FactionOverviewProps {
    faction: Faction;
}

export function FactionOverview({ faction }: FactionOverviewProps) {
    return (
        <div className="space-y-8">
            <div className="bg-surface/30 border border-border rounded-lg p-6 md:p-8">
                <h3 className="text-xl font-orbitron text-neon-cyan mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5" /> DESCRIPTION
                </h3>
                <div className="prose prose-invert max-w-none text-foreground-muted leading-relaxed whitespace-pre-line">
                    {faction.description || "No description available."}
                </div>

                {faction.information && (
                    <div className="mt-8 pt-8 border-t border-border/50">
                        <h4 className="text-lg font-orbitron text-neon-blue mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4" /> ADDITIONAL INTEL
                        </h4>
                        <div className="prose prose-invert max-w-none text-foreground-muted leading-relaxed whitespace-pre-line text-sm">
                            {faction.information}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
