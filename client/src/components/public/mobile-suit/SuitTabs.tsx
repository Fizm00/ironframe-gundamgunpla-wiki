
import { motion } from 'framer-motion';
import { BookOpen, Settings, Share2, Users, MonitorPlay } from 'lucide-react';
import type { LoreMobileSuit } from '@/services/lore';
import type { TabType } from '@/hooks/useMobileSuitDetail';

interface SuitTabsProps {
    suit: LoreMobileSuit;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export function SuitTabs({ suit, activeTab, setActiveTab }: SuitTabsProps) {
    return (
        <>
            <div className="mb-8 border-b border-border">
                <div className="flex gap-8">
                    {[
                        { id: 'history', label: 'HISTORICAL RECORDS', icon: BookOpen },
                        { id: 'variants', label: 'VARIANTS & APPEARANCES', icon: Share2 },
                        { id: 'extra', label: 'ADDITIONAL DATA', icon: Settings },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center pb-4 text-sm font-orbitron tracking-wider transition-all border-b-2 ${activeTab === tab.id
                                ? 'text-neon-blue border-neon-blue'
                                : 'text-foreground-muted border-transparent hover:text-foreground hover:border-border'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'history' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="mb-6 prose prose-invert max-w-none text-foreground/80 font-exo whitespace-pre-wrap leading-relaxed">
                            {suit.description}
                        </div>
                        {suit.design && (
                            <div>
                                <h3 className="text-xl font-orbitron text-foreground mb-4 flex items-center opacity-80">
                                    Design History
                                </h3>
                                <div className="prose prose-invert max-w-none text-foreground/80 font-exo whitespace-pre-wrap">
                                    {suit.design}
                                </div>
                            </div>
                        )}
                        <hr className="border-border" />
                        <div className="prose prose-invert max-w-none text-foreground/80 font-exo whitespace-pre-wrap leading-relaxed">
                            {suit.history || "No historical records found."}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'variants' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {suit.variants && suit.variants.length > 0 && (
                            <div className="bg-surface/50 border border-border rounded-lg overflow-hidden">
                                <h3 className="text-lg font-orbitron text-foreground p-4 border-b border-border flex items-center bg-surface-hover/20">
                                    <Share2 className="w-4 h-4 mr-2 text-neon-green" />
                                    VARIANTS
                                </h3>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {suit.variants.map((v, i) => (
                                        <div key={i} className="text-sm text-foreground/70 font-mono truncate hover:text-foreground transition-colors">
                                            • {v}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {suit.knownPilots && suit.knownPilots.length > 0 && (
                            <div className="bg-surface/50 border border-border rounded-lg overflow-hidden">
                                <h3 className="text-lg font-orbitron text-foreground p-4 border-b border-border flex items-center bg-surface-hover/20">
                                    <Users className="w-4 h-4 mr-2 text-neon-yellow" />
                                    KNOWN PILOTS
                                </h3>
                                <div className="p-4 flex flex-wrap gap-2">
                                    {suit.knownPilots.map((pilot, i) => (
                                        <span key={i} className="px-3 py-1 bg-surface border border-border rounded text-xs font-mono text-neon-yellow">
                                            {pilot}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {suit.appearances && suit.appearances.length > 0 && (
                            <div className="bg-surface/50 border border-border rounded-lg overflow-hidden">
                                <h3 className="text-lg font-orbitron text-foreground p-4 border-b border-border flex items-center bg-surface-hover/20">
                                    <MonitorPlay className="w-4 h-4 mr-2 text-neon-purple" />
                                    APPEARANCES
                                </h3>
                                <ul className="p-4 space-y-1">
                                    {suit.appearances.map((app, i) => (
                                        <li key={i} className="text-sm text-foreground/70 italic">
                                            {app}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'extra' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {suit.behindTheScenes && (
                            <div>
                                <h3 className="text-lg font-orbitron text-foreground/60 mb-2">BEHIND THE SCENES</h3>
                                <div className="text-sm text-foreground/60 whitespace-pre-wrap">
                                    {suit.behindTheScenes}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </>
    );
}
