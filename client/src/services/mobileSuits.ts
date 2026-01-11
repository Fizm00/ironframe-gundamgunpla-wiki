import api from '@/lib/api';

export interface MobileSuit {
    _id: string;
    name: string;
    modelNumber: string;
    manufacturer: string;
    operator?: string;
    description?: string;
    imageUrl?: string;
    height?: number;
    weight?: number;
    armor?: string;
    powerOutput?: number;
    armaments?: string[];
    scale?: string;
    price?: number;
    grade?: string;
    releaseDate?: string;
}

export const mobileSuitService = {
    getAll: async (params?: { page?: number; limit?: number; keyword?: string; grade?: string }) => {
        const { data } = await api.get('/mobile-suits', { params });
        return data;
    },

    getById: async (id: string) => {
        const response = await api.get<MobileSuit>(`/mobile-suits/${id}`);
        return response.data;
    },

    create: async (data: Omit<MobileSuit, '_id'>) => {
        const response = await api.post<MobileSuit>('/mobile-suits', data);
        return response.data;
    },

    update: async (id: string, data: Partial<MobileSuit>) => {
        const response = await api.put<MobileSuit>(`/mobile-suits/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/mobile-suits/${id}`);
        return response.data;
    },

    uploadImage: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post<{ message: string; imageUrl: string }>(`/mobile-suits/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
