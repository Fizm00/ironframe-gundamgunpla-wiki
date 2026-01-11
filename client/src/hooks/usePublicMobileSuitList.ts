
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { loreService } from '@/services/lore';
import { useDebounce } from '@/hooks/useDebounce';

export function usePublicMobileSuitList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['loreMobileSuits', page, debouncedSearch],
        queryFn: () => loreService.getAll({
            page,
            limit: 24,
            search: debouncedSearch
        }),
        placeholderData: keepPreviousData
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return {
        suits: data?.mobileSuits || [],
        totalPages: data?.pages || 1,
        isLoading,
        isError,
        page,
        setPage,
        search,
        handleSearch
    };
}
