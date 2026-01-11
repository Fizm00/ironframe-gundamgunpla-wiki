
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { loreService } from '@/services/lore';
import type { LoreMobileSuit } from '@/services/lore';

export function useMobileSuitEditor() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { data: suit, isLoading: isFetching } = useQuery({
        queryKey: ['loreMobileSuit', id],
        queryFn: () => loreService.getById(id!),
        enabled: isEditMode
    });

    const form = useForm<Partial<LoreMobileSuit>>({
        defaultValues: {
            name: '',
            series: '',
            url: '',
            description: '',
            history: '',
            behindTheScenes: '',
            development: {},
            production: {},
            specifications: {},
            performance: {},
            armaments: [],
            variants: [],
            knownPilots: [],
            appearances: []
        }
    });

    const { reset } = form;

    useEffect(() => {
        if (suit) {
            reset(suit);
        }
    }, [suit, reset]);

    const mutation = useMutation({
        mutationFn: async (data: Partial<LoreMobileSuit>) => {
            let result;
            if (isEditMode) {
                result = await loreService.update(id!, data);
            } else {
                result = await loreService.create(data);
            }

            if (selectedImage && result._id) {
                await loreService.uploadImage(result._id, selectedImage);
            }

            return result;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['loreMobileSuits'] });
            queryClient.invalidateQueries({ queryKey: ['loreMobileSuit', isEditMode ? id : data._id] });
            alert('Mobile Suit Saved Successfully!');
            navigate('/admin/mobile-suits');
        },
        onError: (error: any) => {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    });

    const onSubmit = (data: Partial<LoreMobileSuit>) => {
        mutation.mutate(data);
    };

    return {
        form,
        isEditMode,
        isFetching,
        isSaving: mutation.isPending,
        onSubmit: form.handleSubmit(onSubmit),
        selectedImage,
        setSelectedImage,
        currentSuit: suit
    };
}
