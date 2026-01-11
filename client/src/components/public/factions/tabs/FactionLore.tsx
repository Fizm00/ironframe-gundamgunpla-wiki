import { BookOpen, Globe } from 'lucide-react';
import type { Faction } from '@/services/factions';

interface FactionLoreProps {
    faction: Faction;
}

export function FactionLore({ faction }: FactionLoreProps) {
    return (
        <div className="space-y-8">
            {faction.history && (
                <div className="bg-surface/30 border border-border rounded-lg p-6 md:p-8">
                    <h3 className="text-xl font-orbitron text-neon-purple mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> HISTORICAL ARCHIVE
                    </h3>
                    <div className="prose prose-invert max-w-none text-foreground-muted whitespace-pre-line">
                        {faction.history}
                    </div>
                </div>
            )}
            {faction.government && (
                <div className="bg-surface/30 border border-border rounded-lg p-6 md:p-8">
                    <h3 className="text-xl font-orbitron text-neon-blue mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" /> GOVERNMENT & POLITICS
                    </h3>
                    <div className="prose prose-invert max-w-none text-foreground-muted whitespace-pre-line">
                        {faction.government}
                    </div>
                </div>
            )}
            {faction.behindTheScenes && (
                <div className="bg-surface/30 border border-border rounded-lg p-6 md:p-8">
                    <h3 className="text-xl font-orbitron text-foreground-muted mb-4 flex items-center gap-2">
                        BEHIND THE SCENES
                    </h3>
                    <div className="prose prose-invert max-w-none text-foreground-muted whitespace-pre-line text-sm">
                        {faction.behindTheScenes}
                    </div>
                </div>
            )}
        </div>
    );
}
