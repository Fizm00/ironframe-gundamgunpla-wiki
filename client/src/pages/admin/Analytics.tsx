import { useAnalytics } from '@/hooks/admin/useAnalytics';
import { AdminStatCard } from '@/components/admin/analytics/AdminStatCard';
import { FactionChart } from '@/components/admin/analytics/FactionChart';
import { TimelineChart } from '@/components/admin/analytics/TimelineChart';
import { MobileSuitChart } from '@/components/admin/analytics/MobileSuitChart';
import { GrowthChart } from '@/components/admin/analytics/GrowthChart';
import { Loader2, Users, Sword, Crosshair, Map, History, Activity } from 'lucide-react';

export function Analytics() {
    const { stats, factionDistribution, timelineDistribution, msDistribution, growthStats, isLoading } = useAnalytics();

    if (isLoading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-neon-cyan" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-1">System Analytics</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive database metrics and trends.</p>
                </div>
                <div className="text-xs px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full font-mono flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live Data
                </div>
            </div>

            {stats && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-6">
                    <AdminStatCard
                        title="Total Users"
                        value={stats.users.value}
                        change={stats.users.trend.value}
                        trend={stats.users.trend.direction}
                        icon={Users}
                        iconColor="text-blue-500"
                        iconBg="bg-blue-500/10"
                    />
                    <AdminStatCard
                        title="Factions"
                        value={stats.factions.value}
                        change={stats.factions.trend.value}
                        trend={stats.factions.trend.direction}
                        icon={Map}
                        iconColor="text-emerald-500"
                        iconBg="bg-emerald-500/10"
                    />
                    <AdminStatCard
                        title="Mobile Suits"
                        value={stats.mobileSuits.value}
                        change={stats.mobileSuits.trend.value}
                        trend={stats.mobileSuits.trend.direction}
                        icon={Sword}
                        iconColor="text-red-500"
                        iconBg="bg-red-500/10"
                    />
                    <AdminStatCard
                        title="Pilots"
                        value={stats.pilots.value}
                        change={stats.pilots.trend.value}
                        trend={stats.pilots.trend.direction}
                        icon={Crosshair}
                        iconColor="text-orange-500"
                        iconBg="bg-orange-500/10"
                    />
                    <AdminStatCard
                        title="Eras"
                        value={stats.timelines.value}
                        change={stats.timelines.trend.value}
                        trend={stats.timelines.trend.direction}
                        icon={History}
                        iconColor="text-purple-500"
                        iconBg="bg-purple-500/10"
                    />
                    <AdminStatCard
                        title="Events"
                        value={stats.events.value}
                        change={stats.events.trend.value}
                        trend={stats.events.trend.direction}
                        icon={Activity}
                        iconColor="text-cyan-500"
                        iconBg="bg-cyan-500/10"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <GrowthChart data={growthStats} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <MobileSuitChart data={msDistribution} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                <TimelineChart data={timelineDistribution} />
                <FactionChart data={factionDistribution} />
            </div>
        </div>
    );
}
