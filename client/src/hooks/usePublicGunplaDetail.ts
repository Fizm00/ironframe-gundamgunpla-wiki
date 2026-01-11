
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mobileSuitService } from '@/services/mobileSuits';

export function usePublicGunplaDetail() {
    const { id } = useParams<{ id: string }>();

    const { data: mobileSuit, isLoading, error } = useQuery({
        queryKey: ['mobileSuit', id],
        queryFn: () => mobileSuitService.getById(id || ''),
        enabled: !!id
    });

    return {
        mobileSuit,
        isLoading,
        error
    };
}
