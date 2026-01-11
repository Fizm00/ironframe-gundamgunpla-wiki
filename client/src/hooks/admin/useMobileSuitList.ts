
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { loreService } from '@/services/lore';
import { useDebounce } from '@/hooks/useDebounce';

export function useMobileSuitList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['loreMobileSuits', page, debouncedSearch],
        queryFn: () => loreService.getAll({ page, limit: 10, search: debouncedSearch }),
        placeholderData: keepPreviousData
    });

    const deleteMutation = useMutation({
        mutationFn: loreService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loreMobileSuits'] });
        },
        onError: (error: Error) => {
            alert(`Error deleting: ${error.message}`);
        }
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
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
