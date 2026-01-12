import { Users, Sword, Crosshair, Map, History, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DashboardStats } from '@/services/analytics';

interface StatsGridProps {
    stats?: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    if (!stats) return null;

    const items = [
        { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Factions", value: stats.factions, icon: Map, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Mobile Suits", value: stats.mobileSuits, icon: Sword, color: "text-red-500", bg: "bg-red-500/10" },
        { label: "Pilots", value: stats.pilots, icon: Crosshair, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Era Timelines", value: stats.timelines, icon: History, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Recorded Events", value: stats.events, icon: Activity, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {items.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
                >
                    <div className={`p-3 rounded-full mb-3 ${item.bg}`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-1">
                        {String(item.value)}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
                        {item.label}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
