import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { factionService } from '@/services/factions';
import { useDebounce } from '@/hooks/useDebounce';

const ITEMS_PER_PAGE = 10;

export function useFactionList() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();

    const { data: allFactions, isLoading } = useQuery({
        queryKey: ['factions', debouncedSearch],
        queryFn: () => factionService.getAll({ search: debouncedSearch })
    });

    const deleteMutation = useMutation({
        mutationFn: factionService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['factions'] });
        },
        onError: (error: Error) => {
            alert(`Error deleting: ${error.message}`);
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Faction?')) {
            deleteMutation.mutate(id);
        }
    };

    // Client-side pagination logic
    const totalItems = allFactions?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    const paginatedFactions = allFactions?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) || [];

    return {
        // State
        search,
        setSearch,
        page,
        setPage,
        isLoading,

        // Data
        factions: paginatedFactions,
        totalItems,
        totalPages,

        // Actions
        handleDelete
    };
}
