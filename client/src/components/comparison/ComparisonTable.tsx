import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { useComparisonData } from './hooks/useComparisonData';
import { getNormalizedSpec } from './utils/specUtils';

const SPEC_KEYS = [
    'Model Number',
    'Height',
    'Weight',
    'Max Weight',
    'Power Output',
    'Total Thrust',
    'Armor Materials',
    'Sensor Radius'
];

export function ComparisonTable() {
    const { suits, loading, removeMobileSuit } = useComparisonData();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (suits.length === 0) {
        return (
            <div className="text-center py-20 text-slate-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
                <p>No Mobile Suits selected for comparison.</p>
                <Link to="/mobile-suits" className="text-indigo-500 hover:underline mt-2 inline-block">
                    Browse Mobile Suits
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-surface/50 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="p-4 w-48 bg-black/40 border-b border-r border-border/50 sticky left-0 z-10 backdrop-blur-md">
                            <span className="text-xs font-bold font-orbitron uppercase tracking-widest text-neon-blue/80">Attributes</span>
                        </th>
                        {suits.map(suit => (
                            <th key={suit._id} className="p-4 border-b border-border/50 min-w-[250px] relative bg-black/20">
                                <button
                                    onClick={() => removeMobileSuit(suit._id)}
                                    className="absolute top-2 right-2 p-1 text-foreground-muted hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
                                    title="Remove"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-24 h-24 rounded-lg bg-black/50 overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-border/30 flex items-center justify-center group">
                                        {suit.imageUrl ? (
                                            <img src={suit.imageUrl} alt={suit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <span className="text-xs text-foreground-muted/50 font-mono">NO DATA</span>
                                        )}
                                    </div>
                                    <div>
                                        <Link to={`/mobile-suits/${suit._id}`} className="font-bold font-orbitron text-foreground hover:text-neon-blue transition-colors text-lg leading-tight block mb-1">
                                            {suit.name}
                                        </Link>
                                        <span className="text-[10px] font-mono text-neon-blue/80 px-2 py-0.5 border border-neon-blue/20 bg-neon-blue/5 rounded-full">
                                            {suit.faction ? String(suit.faction) : 'UNKNOWN'}
                                        </span>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    <tr>
                        <td className="p-4 font-semibold font-orbitron text-xs text-foreground-muted uppercase bg-black/20 border-r border-border/30 sticky left-0 z-10 backdrop-blur-sm">Series</td>
                        {suits.map(suit => (
                            <td key={suit._id} className="p-4 text-sm font-mono text-foreground/80">
                                {suit.series}
                            </td>
                        ))}
                    </tr>

                    {SPEC_KEYS.map(key => (
                        <tr key={key} className="hover:bg-neon-blue/5 transition-colors group">
                            <td className="p-4 font-medium font-orbitron text-xs text-foreground-muted uppercase bg-black/20 group-hover:bg-neon-blue/10 border-r border-border/30 sticky left-0 z-10 backdrop-blur-sm transition-colors">
                                {key}
                            </td>
                            {suits.map(suit => (
                                <td key={suit._id} className="p-4 text-sm font-mono text-foreground tracking-wide">
                                    {getNormalizedSpec(suit, key)}
                                </td>
                            ))}
                        </tr>
                    ))}

                    <tr>
                        <td className="p-4 font-semibold font-orbitron text-xs text-foreground-muted uppercase bg-black/20 border-r border-border/30 sticky left-0 z-10 backdrop-blur-sm">Armaments</td>
                        {suits.map(suit => (
                            <td key={suit._id} className="p-4 text-sm text-foreground/80 align-top font-mono">
                                {suit.armaments && suit.armaments.length > 0 ? (
                                    <ul className="space-y-2 text-xs">
                                        {suit.armaments.map((cat, idx) => (
                                            <li key={idx} className="flex flex-col">
                                                <span className="text-neon-blue/70 text-[10px] uppercase font-bold mb-0.5">{cat.category}</span>
                                                <span className="leading-tight">{cat.items.join(', ')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-foreground-muted/50 italic text-xs">-- NO DATA --</span>
                                )}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
