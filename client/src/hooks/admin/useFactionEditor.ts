import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { factionService } from '@/services/factions';
import type { Faction } from '@/services/factions';

export function useFactionEditor() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [isFetching, setIsFetching] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm<Partial<Faction>>({
        defaultValues: {
            name: '',
            activeEra: '',
            description: '',
            imageUrl: '',
            leaders: [],
            forces: []
        }
    });

    const { control, reset, watch, setValue } = form;
    const factionName = watch('name');

    const { fields: forceFields, append: appendForce, remove: removeForce } = useFieldArray({
        control,
        name: "forces"
    });

    useEffect(() => {
        if (isEditMode && id) {
            const fetchFaction = async () => {
                try {
                    const data = await factionService.getById(id);
                    reset(data);
                    if (data.imageUrl) {
                        setPreviewUrl(data.imageUrl);
                    }
                } catch (error) {
                    console.error('Failed to fetch faction:', error);
                    alert('Failed to load faction details');
                    navigate('/admin/factions');
                } finally {
                    setIsFetching(false);
                }
            };
            fetchFaction();
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
            let savedFaction;
            if (isEditMode && id) {
                savedFaction = await factionService.update(id, data);
            } else {
                savedFaction = await factionService.create(data);
            }

            if (selectedFile && savedFaction._id) {
                await factionService.uploadImage(savedFaction._id, selectedFile);
            }

            alert(isEditMode ? 'Faction updated successfully' : 'Faction created successfully');
            navigate('/admin/factions');
        } catch (error) {
            console.error('Failed to save faction:', error);
            alert('Failed to save faction: ' + (error as any).message);
        } finally {
            setIsSaving(false);
        }
    });

    return {
        form,
        control,
        isEditMode,
        isFetching,
        isSaving,
        forceFields,
        appendForce,
        removeForce,
        onSubmit,
        factionName,
        previewUrl,
        handleFileSelect
    };
}
