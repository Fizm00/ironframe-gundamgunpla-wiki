
import { Cpu, FileText, Zap, Shield } from 'lucide-react';
import type { LoreMobileSuit } from '@/services/lore';

interface SuitSystemOverviewProps {
    suit: LoreMobileSuit;
}

export function SuitSystemOverview({ suit }: SuitSystemOverviewProps) {
    return (
        <div className="bg-surface/50 border border-border p-6 rounded-lg backdrop-blur-sm">
            <h3 className="flex items-center text-neon-blue font-orbitron text-lg mb-6 pb-4 border-b border-border">
                <Cpu className="w-5 h-5 mr-2" />
                SYSTEM OVERVIEW
            </h3>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {suit.development && (
                    <div>
                        <h4 className="text-xs font-mono text-foreground-muted mb-2 uppercase">Development</h4>
                        <ul className="text-sm space-y-1 text-foreground/90">
                            {Array.isArray(suit.development) ? (
                                suit.development.map((item, i) => (
                                    <li key={i} className="truncate">• {String(item)}</li>
                                ))
                            ) : (typeof suit.development === 'object' && Object.keys(suit.development).length > 0) ? (
                                Object.entries(suit.development).map(([key, value]) => (
                                    <li key={key} className="truncate">
                                        <span className="text-foreground-muted mr-2">{key}:</span>{String(value)}
                                    </li>
                                ))
                            ) : null}
                        </ul>
                    </div>
                )}
                {suit.production && (
                    <div>
                        <h4 className="text-xs font-mono text-foreground-muted mb-2 uppercase">Production</h4>
                        <ul className="text-sm space-y-1 text-foreground/90">
                            {Array.isArray(suit.production) ? (
                                suit.production.map((item, i) => (
                                    <li key={i} className="truncate">• {String(item)}</li>
                                ))
                            ) : (typeof suit.production === 'object' && Object.keys(suit.production).length > 0) ? (
                                Object.entries(suit.production).map(([key, value]) => (
                                    <li key={key} className="truncate">
                                        <span className="text-foreground-muted mr-2">{key}:</span>{String(value)}
                                    </li>
                                ))
                            ) : null}
                        </ul>
                    </div>
                )}
            </div>

            {suit.specifications && Object.keys(suit.specifications).length > 0 && (
                <div className="mb-8">
                    <h4 className="text-xs font-mono text-neon-blue/70 mb-3 uppercase flex items-center">
                        <FileText className="w-3 h-3 mr-2" /> Specifications
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 bg-surface p-4 rounded border border-border">
                        {Object.entries(suit.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-baseline border-b border-border pb-1">
                                <span className="text-foreground-muted text-xs uppercase mr-2">{key}</span>
                                <span className="text-foreground/90 text-xs font-mono text-right">{String(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {suit.performance && (
                <div className="mb-8">
                    <h4 className="text-xs font-mono text-neon-blue/70 mb-3 uppercase flex items-center">
                        <Zap className="w-3 h-3 mr-2" /> Performance
                    </h4>
                    {typeof suit.performance === 'string' ? (
                        <div className="bg-surface p-4 rounded border border-border text-xs font-mono text-foreground/80 whitespace-pre-wrap leading-relaxed">
                            {suit.performance}
                        </div>
                    ) : (
                        <div className="bg-surface p-4 rounded border border-border grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(suit.performance).map(([key, value]) => (
                                <div key={key} className="border-b border-border pb-1">
                                    <div className="text-[10px] text-foreground-muted uppercase tracking-wider">{key}</div>
                                    <div className="text-sm font-mono text-neon-cyan">{String(value)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {suit.armaments && suit.armaments.length > 0 && (
                <div>
                    <h4 className="text-xs font-mono text-neon-blue/70 mb-3 uppercase flex items-center">
                        <Shield className="w-3 h-3 mr-2" /> Armaments
                    </h4>
                    <div className="space-y-4">
                        {suit.armaments.map((group, i) => (
                            <div key={i} className="bg-surface rounded border border-border overflow-hidden">
                                <div className="bg-surface-hover px-3 py-2 text-xs font-bold text-foreground uppercase tracking-wider">
                                    {group.category}
                                </div>
                                <ul className="px-3 py-2 space-y-1">
                                    {group.items.map((item, j) => (
                                        <li key={j} className="text-xs text-foreground/80 flex items-start">
                                            <span className="w-1 h-1 bg-neon-yellow rounded-full mt-1.5 mr-2 opacity-50" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
