import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";
import { useAnalytics } from "@/hooks/admin/useAnalytics";
import { MobileSuitChart } from "@/components/admin/analytics/MobileSuitChart";
import { GrowthChart } from "@/components/admin/analytics/GrowthChart";
import { FactionChart } from "@/components/admin/analytics/FactionChart";
import { TimelineChart } from "@/components/admin/analytics/TimelineChart";

// New Components
import { StatsGrid } from "@/components/admin/dashboard/StatsGrid";
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity";
import { SystemStatus } from "@/components/admin/dashboard/SystemStatus";

export function AdminOverview() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: dashboardService.getStats,
        refetchInterval: 30000
    });

    const {
        factionDistribution,
        timelineDistribution,
        msDistribution,
        growthStats
    } = useAnalytics();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            <StatsGrid stats={stats} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                <div className="col-span-12 xl:col-span-8">
                    <GrowthChart data={growthStats} />
                </div>
                <div className="col-span-12 xl:col-span-4">
                    <RecentActivity activities={stats?.recentActivities} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                <div className="col-span-12 xl:col-span-8">
                    <TimelineChart data={timelineDistribution} />
                </div>

                <div className="col-span-12 xl:col-span-4">
                    <SystemStatus status={stats?.systemStatus} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                <FactionChart data={factionDistribution} />
                <MobileSuitChart data={msDistribution} />
            </div>

            <div className="col-span-12">
                <BarChartOne data={stats?.chartData?.unitsPerFaction} />
            </div>
        </div>
    );
}
