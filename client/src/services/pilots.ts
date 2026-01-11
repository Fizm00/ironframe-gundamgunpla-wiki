import api from '@/lib/api';
import type { LoreCharacter } from '@/types/LoreCharacter';

export const pilotService = {
    getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
        const response = await api.get<{ characters: LoreCharacter[], total: number, pages: number }>('/lore-characters', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<LoreCharacter>(`/lore-characters/${id}`);
        return response.data;
    },

    create: async (data: Partial<LoreCharacter>) => {
        const response = await api.post<LoreCharacter>('/lore-characters', data);
        return response.data;
    },

    update: async (id: string, data: Partial<LoreCharacter>) => {
        const response = await api.put<LoreCharacter>(`/lore-characters/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/lore-characters/${id}`);
        return response.data;
    },

    uploadImage: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post<{ message: string; imageUrl: string }>(`/lore-characters/${id}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};
