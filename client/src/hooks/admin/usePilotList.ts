
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { pilotService } from '@/services/pilots';
import { useDebounce } from '@/hooks/useDebounce';

export function usePilotList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['pilots', page, debouncedSearch],
        queryFn: () => pilotService.getAll({ page, limit: 10, search: debouncedSearch }),
        placeholderData: keepPreviousData
    });

    const deleteMutation = useMutation({
        mutationFn: pilotService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pilots'] });
        },
        onError: (error: Error) => {
            alert(`Error deleting: ${error.message}`);
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Pilot?')) {
            deleteMutation.mutate(id);
        }
    };

    return {
        data,
        isLoading,
        isPlaceholderData,
        page,
        setPage,
        search,
        setSearch,
        handleDelete,
        isDeleting: deleteMutation.isPending
    };
}
