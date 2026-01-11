import type { DashboardStats } from "@/services/dashboard";

interface SystemStatusProps {
    status?: DashboardStats['systemStatus'];
}

export function SystemStatus({ status }: SystemStatusProps) {
    const memoryUsage = status?.memoryUsage || 0;
    const cacheEfficiency = status?.cacheEfficiency || "100";
    const dbSizeMB = status?.dbSizeMB || '0';

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6 h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">System Status</h3>
            <div className="flex items-center gap-2 mb-2">
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Operational</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">The system is running smoothly with no reported incidents.</p>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${memoryUsage > 80 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            Memory Usage
                        </span>
                        <span className="text-xs font-bold text-gray-800 dark:text-white">{memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${memoryUsage > 80 ? 'bg-red-500' : 'bg-brand-500'}`}
                            style={{ width: `${memoryUsage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2 bg-pink-500 animate-pulse"></div>
                            Psycommu Sync Rate
                        </span>
                        <span className="text-xs font-bold text-gray-800 dark:text-white">{cacheEfficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div
                            className="h-1.5 rounded-full transition-all duration-500 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                            style={{ width: `${cacheEfficiency}%` }}
                        ></div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-500 flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2 bg-purple-500"></div>
                            Database Size (Mongo)
                        </span>
                        <span className="text-xs font-bold text-gray-800 dark:text-white">{dbSizeMB} MB</span>
                    </div>
                    <p className="text-[10px] text-gray-400 pl-4">Real-time data storage volume</p>
                </div>
            </div>
        </div>
    );
}
