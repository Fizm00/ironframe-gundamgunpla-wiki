import api from '@/lib/api';

export interface Timeline {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    series: string[];
    order: number;
}

export interface TimelineEvent {
    _id: string;
    year: string;
    date: string;
    title: string;
    description: string;
    timeline: string; // ID of the Era
}

export interface TimelineDetail extends Timeline {
    events: TimelineEvent[];
}

export const timelineService = {
    // Get all Eras (Timelines)
    getAll: async () => {
        const response = await api.get<Timeline[]>('/timeline');
        return response.data;
    },

    // Get Era Detail with Events
    getById: async (id: string) => {
        const response = await api.get<TimelineDetail>(`/timeline/${id}`);
        return response.data;
    }
};
