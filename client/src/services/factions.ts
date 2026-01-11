import api from '@/lib/api';

export interface Faction {
    _id: string;
    name: string;
    names?: {
        en?: string;
        ja?: string;
    };
    activeEra: string;
    description: string;
    imageUrl?: string;
    leaders: string[];
    organizationType?: string;

    // Deep Structured Data (Infobox)
    purpose?: string;
    sphereOfInfluence?: string;
    allies: string[];
    enemies: string[];
    firstSeen?: string;
    lastSeen?: string;
    appearances: string[]; // Anime/Manga titles
    information?: string; // General info block

    // Rich Text / Lore Fields
    history?: string;
    government?: string;
    military?: string; // General Military Description
    behindTheScenes?: string;
    technologies?: string;

    // Lists
    vehicles: string[];
    mobileWeapons: string[];
    miscellaneous: string[];

    // Structured Forces
    forces: {
        name: string;
        description?: string;
        imageUrl?: string;

        // Force Specific Deep Data
        purpose?: string;
        ledBy: string[];
        parent?: string;
        subdivisions: string[];
        allies: string[];
        enemies: string[];
        firstSeen?: string;
        lastSeen?: string;

        headquarters?: string;

        // Force Rich Text
        history?: string;

        // Force Lists
        branches: string[];
        majorMilitaryBases: string[];
        members: string[]; // Notable members
        militaryRanks: string[];

        mobileWeapons: string[];
        vehicles: string[];
        teams: string[];
    }[];

    createdAt: string;
    updatedAt: string;
}

export const factionService = {
    getAll: async (params?: { search?: string }) => {
        const response = await api.get<Faction[]>('/factions', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Faction>(`/factions/${id}`);
        return response.data;
    },

    create: async (data: Partial<Faction>) => {
        const response = await api.post<Faction>('/factions', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Faction>) => {
        const response = await api.put<Faction>(`/factions/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/factions/${id}`);
        return response.data;
    },

    uploadImage: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post<{ message: string; imageUrl: string }>(`/factions/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }
};
