import api from '@/lib/api';

export interface Trend {
    value: string;
    direction: 'up' | 'down' | 'neutral';
}

export interface StatItem {
    value: number;
    trend: Trend;
}

export interface DashboardStats {
    users: StatItem;
    factions: StatItem;
    mobileSuits: StatItem;
    pilots: StatItem;
    timelines: StatItem;
    events: StatItem;
}

export interface FactionDistribution {
    name: string;
    count: number;
}

export interface TimelineDistribution {
    name: string;
    count: number;
}

export interface MobileSuitDistribution {
    name: string;
    count: number;
}

export interface GrowthData {
    categories: string[];
    series: { name: string; data: number[] }[];
}

export const analyticsService = {
    getStats: async () => {
        const response = await api.get<DashboardStats>('/analytics/stats');
        return response.data;
    },

    getFactionDistribution: async () => {
        const response = await api.get<FactionDistribution[]>('/analytics/factions');
        return response.data;
    },

    getTimelineDistribution: async () => {
        const response = await api.get<TimelineDistribution[]>('/analytics/timeline');
        return response.data;
    },

    getMobileSuitDistribution: async () => {
        const response = await api.get<MobileSuitDistribution[]>('/analytics/mobile-suits');
        return response.data;
    },

    getGrowthStats: async () => {
        const response = await api.get<GrowthData>('/analytics/growth');
        return response.data;
    }
};
