import { useQuery } from '@tanstack/react-query';
import { timelineService } from '@/services/timeline';

export function useTimelineDetail(startTimeLineId: string | undefined) {
    const { data: timeline, isLoading, error } = useQuery({
        queryKey: ['timeline-detail', startTimeLineId],
        queryFn: () => startTimeLineId ? timelineService.getById(startTimeLineId) : Promise.reject('No ID'),
        enabled: !!startTimeLineId
    });

    return {
        timeline,
        isLoading,
        error
    };
}
