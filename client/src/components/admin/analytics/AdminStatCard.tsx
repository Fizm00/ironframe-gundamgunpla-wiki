import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface AdminStatCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
}

export function AdminStatCard({
    title,
    value,
    change,
    trend = 'neutral',
    icon: Icon,
    iconColor = "text-brand-500",
    iconBg = "bg-brand-500/10"
}: AdminStatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:p-6 transition-all hover:shadow-lg">
            <div className="flex items-end justify-between">
                <div>
                    <span className="mb-1.5 block text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
                    <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2 font-orbitron">{value}</h4>

                    {change && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{change}</span>
                            <span className="text-gray-400 font-normal ml-1">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
