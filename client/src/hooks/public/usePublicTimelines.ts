import { useQuery } from '@tanstack/react-query';
import { timelineService } from '@/services/timeline';

export function usePublicTimelines() {
    const { data: timelines, isLoading, error } = useQuery({
        queryKey: ['public-timelines'],
        queryFn: timelineService.getAll
    });

    return {
        timelines,
        isLoading,
        error
    };
}
