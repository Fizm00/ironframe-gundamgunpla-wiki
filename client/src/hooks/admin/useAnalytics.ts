import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';

export function useAnalytics() {
    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: analyticsService.getStats
    });

    const { data: factionDistribution, isLoading: isLoadingFactions } = useQuery({
        queryKey: ['admin-stats-factions'],
        queryFn: analyticsService.getFactionDistribution
    });

    const { data: timelineDistribution, isLoading: isLoadingTimeline } = useQuery({
        queryKey: ['admin-stats-timeline'],
        queryFn: analyticsService.getTimelineDistribution
    });

    const { data: msDistribution, isLoading: isLoadingMS } = useQuery({
        queryKey: ['admin-stats-ms'],
        queryFn: analyticsService.getMobileSuitDistribution
    });

    const { data: growthStats, isLoading: isLoadingGrowth } = useQuery({
        queryKey: ['admin-stats-growth'],
        queryFn: analyticsService.getGrowthStats
    });

    return {
        stats,
        factionDistribution,
        timelineDistribution,
        msDistribution,
        growthStats,
        isLoading: isLoadingStats || isLoadingFactions || isLoadingTimeline || isLoadingMS || isLoadingGrowth
    };
}
