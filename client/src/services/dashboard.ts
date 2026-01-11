
import api from '@/lib/api';

export interface DashboardStats {
    totalUnits: number;
    totalGunpla: number;
    totalPilots: number;
    totalFactions: number;
    systemStatus: {
        memoryUsage: number;
        dbSizeMB: string;
        cacheEfficiency: string;
    };
    recentActivities: Array<{
        _id: string;
        action: string;
        entity: string;
        details: string;
        user: string;
        timestamp: string;
    }>;
    chartData: {
        unitsPerFaction: Array<{ name: string; value: number }>;
        growthTrends: Array<{ name: string; units: number; pilots: number }>;
    };
    trends: {
        units: number;
        gunpla: number;
        pilots: number;
        load: number;
    };
}

export const dashboardService = {
    getStats: async () => {
        const response = await api.get<DashboardStats>('/dashboard/stats');
        return response.data;
    }
};
