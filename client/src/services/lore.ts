import axios from 'axios';

const API_URL = 'http://localhost:5000/api/lore';

export interface LoreMobileSuit {
    _id: string;
    name: string;
    series: string;
    faction?: string;
    url: string;
    imageUrl?: string;
    description?: string;
    history?: string;
    design?: string;
    production?: Record<string, string>;
    development?: Record<string, string>;
    specifications?: Record<string, string>;
    performance?: Record<string, string>;
    armaments?: { category: string; items: string[] }[];
    variants?: string[];
    knownPilots?: string[];
    appearances?: string[];
    behindTheScenes?: string;
}

export interface LoreResponse {
    mobileSuits: LoreMobileSuit[];
    page: number;
    pages: number;
    total: number;
}

export const loreService = {
    getAll: async (params?: { page?: number; limit?: number; search?: string; series?: string }) => {
        const { data } = await axios.get<LoreResponse>(API_URL, { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await axios.get<LoreMobileSuit>(`${API_URL}/${id}`);
        return data;
    },

    getSeriesList: async () => {
        const { data } = await axios.get<string[]>(`${API_URL}/series`);
        return data;
    },

    uploadImage: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post<{ message: string; imageUrl: string }>(`${API_URL}/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return data;
    },

    create: async (mobileSuitData: Partial<LoreMobileSuit>) => {
        const { data } = await axios.post<LoreMobileSuit>(API_URL, mobileSuitData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return data;
    },

    update: async (id: string, mobileSuitData: Partial<LoreMobileSuit>) => {
        const { data } = await axios.put<LoreMobileSuit>(`${API_URL}/${id}`, mobileSuitData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return data;
    },

    delete: async (id: string) => {
        const { data } = await axios.delete<{ message: string }>(`${API_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return data;
    },

    getBatchImages: async (names: string[]) => {
        const { data } = await axios.post<Record<string, string>>(`${API_URL}/batch`, { names });
        return data;
    }
};
