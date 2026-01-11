import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/users';
import { useDebounce } from '@/hooks/useDebounce';

export function useUserList() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['users', debouncedSearch],
        queryFn: () => userService.getAll({ search: debouncedSearch })
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string, role: 'user' | 'admin' }) => userService.updateRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: Error) => {
            alert(`Error updating role: ${error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: userService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: Error) => {
            alert(`Error deleting user: ${error.message}`);
        }
    });

    const handleRoleChange = (id: string, newRole: 'user' | 'admin') => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            updateRoleMutation.mutate({ id, role: newRole });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            deleteMutation.mutate(id);
        }
    };

    return {
        search,
        setSearch,
        users: users || [],
        isLoading,
        handleRoleChange,
        handleDelete
    };
}
