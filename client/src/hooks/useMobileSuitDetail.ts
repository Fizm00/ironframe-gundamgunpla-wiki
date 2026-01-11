
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loreService } from '@/services/lore';

export type TabType = 'history' | 'variants' | 'extra';

export function useMobileSuitDetail() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('history');
    const [isUploading, setIsUploading] = useState(false);
    const queryClient = useQueryClient();

    const { data: suit, isLoading, isError } = useQuery({
        queryKey: ['loreMobileSuit', id],
        queryFn: () => loreService.getById(id || ''),
        enabled: !!id
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !id) return;

        try {
            setIsUploading(true);
            await loreService.uploadImage(id, file);
            queryClient.invalidateQueries({ queryKey: ['loreMobileSuit', id] });
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return {
        suit,
        isLoading,
        isError,
        activeTab,
        setActiveTab,
        isUploading,
        handleImageUpload
    };
}
