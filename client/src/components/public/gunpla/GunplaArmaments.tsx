
import { Crosshair } from 'lucide-react';

interface GunplaArmamentsProps {
    armaments: string[];
}

export function GunplaArmaments({ armaments }: GunplaArmamentsProps) {
    return (
        <div>
            <h3 className="flex items-center text-neon-cyan font-mono tracking-widest text-sm mb-4">
                <Crosshair className="w-4 h-4 mr-2" />
                STANDARD_ARMAMENTS
            </h3>

            {armaments && armaments.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {armaments.map((weapon, index) => (
                        <li key={index} className="flex items-center text-sm font-exo text-foreground p-3 bg-surface border border-border rounded-sm">
                            <span className="w-1.5 h-1.5 bg-neon-blue mr-3" />
                            {weapon}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-foreground-muted font-mono text-xs italic">NO ARMAMENT DATA</p>
            )}
        </div>
    );
}
