import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { timelineService } from '@/services/timeline';
import type { Timeline } from '@/services/timeline';
import { useDebounce } from '@/hooks/useDebounce';

export function useAdminTimelineList() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data: timelines, isLoading } = useQuery({
        queryKey: ['admin-timelines'],
        queryFn: timelineService.getAll
    });

    const filteredTimelines = timelines?.filter((t: Timeline) =>
        t.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) || [];

    return {
        search,
        setSearch,
        isLoading,
        timelines: filteredTimelines
    };
}
