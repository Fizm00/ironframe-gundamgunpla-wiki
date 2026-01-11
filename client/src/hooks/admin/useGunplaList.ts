
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { mobileSuitService } from '@/services/mobileSuits';
import { useDebounce } from '@/hooks/useDebounce';

export function useGunplaList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['mobileSuits', page, debouncedSearch],
        queryFn: () => mobileSuitService.getAll({ page, limit: 10, keyword: debouncedSearch }),
        placeholderData: keepPreviousData
    });

    const deleteMutation = useMutation({
        mutationFn: mobileSuitService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mobileSuits'] });
        },
        onError: (error: Error) => {
            alert(`Error deleting: ${error.message}`);
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Gunpla entry?')) {
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
