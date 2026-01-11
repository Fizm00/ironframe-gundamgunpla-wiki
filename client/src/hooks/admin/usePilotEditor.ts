import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { pilotService } from '@/services/pilots';
import type { LoreCharacter } from '@/types/LoreCharacter';

export function usePilotEditor() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [isFetching, setIsFetching] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm<Partial<LoreCharacter>>({
        defaultValues: {
            name: '',
            series: '',
            description: '',
            history: '',
            personality: '',
            skills: '',
            notes: '',
            mecha: [],
            vehicles: [],
            profile: {
                Rank: '',
                Affiliation: ''
            }
        }
    });

    const { reset, watch, setValue } = form;
    const pilotName = watch('name');

    useEffect(() => {
        if (isEditMode && id) {
            const fetchPilot = async () => {
                try {
                    const data = await pilotService.getById(id);
                    reset(data);
                    if (data.imageUrl) {
                        setPreviewUrl(data.imageUrl);
                    }
                } catch (error) {
                    console.error('Failed to fetch pilot:', error);
                    alert('Failed to load pilot details');
                    navigate('/admin/pilots');
                } finally {
                    setIsFetching(false);
                }
            };
            fetchPilot();
        }
    }, [isEditMode, id, reset, navigate]);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setValue('imageUrl', objectUrl, { shouldDirty: true }); // optimistic preview
    };

    const onSubmit = form.handleSubmit(async (data) => {
        setIsSaving(true);
        try {
            let savedPilot;

            if (isEditMode && id) {
                savedPilot = await pilotService.update(id, data);
                alert('Pilot updated successfully');
            } else {
                savedPilot = await pilotService.create(data);
                alert('Pilot created successfully');
            }

            if (selectedFile && savedPilot._id) {
                await pilotService.uploadImage(savedPilot._id, selectedFile);
            }

            navigate('/admin/pilots');
        } catch (error) {
            console.error('Failed to save pilot:', error);
            alert('Failed to save pilot: ' + (error as any).message);
        } finally {
            setIsSaving(false);
        }
    });

    return {
        form,
        isEditMode,
        isFetching,
        isSaving,
        previewUrl,
        handleFileSelect,
        onSubmit,
        pilotName
    };
}
