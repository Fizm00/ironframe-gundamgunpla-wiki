import { Activity } from "lucide-react";
import type { DashboardStats } from "@/services/dashboard";

interface RecentActivityProps {
    activities?: DashboardStats['recentActivities'];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const getActionColor = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('create') || lowerAction.includes('add')) return 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400';
        if (lowerAction.includes('update') || lowerAction.includes('edit')) return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) return 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400';
        return 'bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-400';
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6 h-[400px] flex flex-col overflow-hidden">
            <div className="flex justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Activity</h3>
            </div>
            <div
                className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 overscroll-y-contain isolate"
                onWheel={(e) => e.stopPropagation()}
            >
                {activities && activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity._id} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getActionColor(activity.action)}`}>
                                <Activity className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.action} {activity.entity}
                                </h4>
                                <p className="text-xs text-gray-500">{activity.details} (by {activity.user})</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">
                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
                )}
            </div>
        </div>
    );
}
