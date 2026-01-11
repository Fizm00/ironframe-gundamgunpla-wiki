import { Database, User, Activity, Box } from "lucide-react";
import { AdminStatCard } from "@/components/admin/analytics/AdminStatCard";
import type { DashboardStats } from "@/services/dashboard";

interface StatsGridProps {
    stats?: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
            <AdminStatCard
                title="Total Units"
                value={stats?.totalUnits || 0}
                change={`${stats?.trends.units}%` || "0%"}
                trend={stats?.trends?.units! >= 0 ? "up" : "down"}
                icon={Database}
                iconColor="text-gray-700 dark:text-gray-400"
                iconBg="bg-gray-100 dark:bg-gray-800"
            />
            <AdminStatCard
                title="Active Pilots"
                value={stats?.totalPilots || 0}
                change={`${stats?.trends.pilots}%` || "0%"}
                trend={stats?.trends?.pilots! >= 0 ? "up" : "down"}
                icon={User}
                iconColor="text-gray-700 dark:text-gray-400"
                iconBg="bg-gray-100 dark:bg-gray-800"
            />
            <AdminStatCard
                title="Gunpla Kits"
                value={stats?.totalGunpla || 0}
                change={`${stats?.trends.gunpla}%` || "0%"}
                trend={stats?.trends?.gunpla! >= 0 ? "up" : "down"}
                icon={Box}
                iconColor="text-gray-700 dark:text-gray-400"
                iconBg="bg-gray-100 dark:bg-gray-800"
            />
            <AdminStatCard
                title="Psycommu Sync Rate (Cache Efficiency)"
                value={`${stats?.systemStatus?.cacheEfficiency}%` || "0%"}
                change="Optimal"
                trend="up"
                icon={Activity}
                iconColor="text-gray-700 dark:text-gray-400"
                iconBg="bg-gray-100 dark:bg-gray-800"
            />
        </div>
    );
}
