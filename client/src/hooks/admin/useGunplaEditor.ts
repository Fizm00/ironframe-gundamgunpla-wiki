
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mobileSuitService } from '@/services/mobileSuits';
import type { MobileSuit } from '@/services/mobileSuits';
import { useForm } from 'react-hook-form';

export function useGunplaEditor() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: suit, isLoading: isFetching } = useQuery({
        queryKey: ['mobileSuit', id],
        queryFn: () => mobileSuitService.getById(id!),
        enabled: isEditMode
    });

    const form = useForm<Partial<MobileSuit>>({
        defaultValues: {
            name: '',
            modelNumber: '',
            grade: '',
            manufacturer: 'Bandai',
            description: '',
            armaments: [],
            price: 0,
            scale: '',
            releaseDate: ''
        }
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (suit) {
            form.reset(suit);
            if (suit.imageUrl) {
                setPreviewUrl(suit.imageUrl);
            }
        }
    }, [suit, form.reset]);

    const mutation = useMutation({
        mutationFn: (data: Partial<MobileSuit>) => {
            return isEditMode
                ? mobileSuitService.update(id!, data)
                : mobileSuitService.create(data as any);
        },
        onSuccess: async (data: MobileSuit) => {
            if (selectedFile) {
                try {
                    await mobileSuitService.uploadImage(data._id, selectedFile);
                } catch (uploadError) {
                    console.error("Image upload failed", uploadError);
                    alert("Product saved but image upload failed.");
                }
            }

            queryClient.invalidateQueries({ queryKey: ['mobileSuits'] });
            alert('Gunpla Product Saved Successfully!');
            navigate('/admin/gunpla');
        },
        onError: (error: Error) => {
            alert(`Error: ${error.message}`);
        }
    });

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit = (data: Partial<MobileSuit>) => {
        mutation.mutate(data);
    };

    return {
        form,
        isEditMode,
        isFetching,
        isSaving: mutation.isPending,
        previewUrl,
        setPreviewUrl,
        setSelectedFile,
        handleFileSelect,
        onSubmit: form.handleSubmit(onSubmit),
        suitName: suit?.name
    };
}
