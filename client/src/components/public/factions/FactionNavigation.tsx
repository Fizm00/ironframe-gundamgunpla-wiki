import { Database, BookOpen, Shield, Wrench } from 'lucide-react';
import clsx from 'clsx';

export type TabId = 'overview' | 'lore' | 'military' | 'tech';

interface FactionNavigationProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
}

export function FactionNavigation({ activeTab, setActiveTab }: FactionNavigationProps) {
    const tabs = [
        { id: 'overview', label: 'OVERVIEW', icon: Database },
        { id: 'lore', label: 'HISTORY & GOVT', icon: BookOpen },
        { id: 'military', label: 'MILITARY FORCES', icon: Shield },
        { id: 'tech', label: 'TECH & ASSETS', icon: Wrench },
    ];

    return (
        <div className="bg-surface/80 backdrop-blur-md border-y border-border/50 sticky top-20 z-50">
            <div className="flex overflow-x-auto no-scrollbar gap-1 md:justify-center p-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabId)}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-3 rounded text-sm font-bold font-orbitron transition-all whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,188,212,0.2)]"
                                : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
