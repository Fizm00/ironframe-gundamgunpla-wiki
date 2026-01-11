import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHART_CONFIG: Record<string, number[]> = {
    '7d': [20, 35, 45, 30, 50, 45, 60, 55, 70, 65, 80, 75],
    '30d': [10, 25, 15, 35, 20, 45, 30, 60, 40, 70, 50, 80],
    '3m': [40, 30, 45, 35, 55, 40, 65, 50, 75, 60, 85, 70]
};

export function EntityGrowthChart() {
    const [timeRange, setTimeRange] = useState('30d');
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const currentData = CHART_CONFIG[timeRange] || Array(12).fill(0);
    const maxData = 100;
    const chartHeight = 300;
    const chartWidth = 1000;

    const generatePath = (data: number[]) => {
        if (!data || data.length === 0) return { area: "", line: "" };

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * chartWidth;
            const y = chartHeight - (val / maxData) * chartHeight;
            return `${x},${y}`;
        }).join(' ');

        const firstVal = data[0] || 0;
        const startY = chartHeight - (firstVal / maxData) * chartHeight;

        const area = `M0,${chartHeight} L0,${startY} ${points.replace(/ /g, ' L')} L${chartWidth},${chartHeight} Z`;
        const line = `M0,${startY} ${points.replace(/ /g, ' L')}`;
        return { area, line };
    };

    const { area: areaPath, line: linePath } = generatePath(currentData);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!currentData || currentData.length === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const index = Math.round((x / rect.width) * (currentData.length - 1));
        if (index >= 0 && index < currentData.length) {
            setHoverIndex(index);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-surface border border-border rounded-xl overflow-hidden mb-8 mx-1"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-4 gap-4">
                <div>
                    <h2 className="text-base font-semibold mb-0.5 text-foreground">Entity Growth Analytics</h2>
                    <p className="text-xs text-foreground-muted/70">Database entries tracked over selected period</p>
                </div>
                <div className="inline-flex bg-muted/50 rounded-md p-0.5 border border-border/50">
                    {['7d', '30d', '3m'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`relative px-4 py-1.5 rounded text-xs font-medium transition-all duration-200 ${timeRange === range
                                ? 'text-foreground'
                                : 'text-foreground-muted hover:text-foreground'
                                }`}
                        >
                            {timeRange === range && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-background border border-border/50 rounded shadow-sm"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">
                                {range === '7d' ? '7D' : range === '30d' ? '30D' : '3M'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="relative h-[300px] w-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIndex(null)}
            >
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-foreground-muted/40 font-mono py-2 select-none pointer-events-none">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                </div>

                <div className="absolute left-12 right-0 top-0 bottom-0">
                    <div className="w-full h-full flex flex-col justify-between pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-full h-px bg-border" />
                        ))}
                    </div>

                    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d={areaPath}
                            fill="url(#chartGradient)"
                            initial={{ opacity: 0, d: areaPath }}
                            animate={{ opacity: 1, d: areaPath }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                        <motion.path
                            d={linePath}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            initial={{ opacity: 0, pathLength: 0, d: linePath }}
                            animate={{ opacity: 1, pathLength: 1, d: linePath }}
                            transition={{
                                pathLength: { duration: 1.5, ease: "easeInOut" },
                                d: { type: "spring", stiffness: 100, damping: 20 }
                            }}
                        />

                        <AnimatePresence>
                            {hoverIndex !== null && (
                                <motion.circle
                                    cx={(hoverIndex / (currentData.length - 1)) * chartWidth}
                                    cy={chartHeight - (currentData[hoverIndex] / maxData) * chartHeight}
                                    r="6"
                                    fill="#3b82f6"
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                />
                            )}
                        </AnimatePresence>
                    </svg>

                    <AnimatePresence>
                        {hoverIndex !== null && (
                            <motion.div
                                className="absolute pointer-events-none z-20"
                                style={{
                                    left: `${(hoverIndex / (currentData.length - 1)) * 100}%`,
                                    top: `${100 - (currentData[hoverIndex] / maxData) * 100}%`,
                                }}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: -50 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                <div className="bg-surface border border-border px-4 py-2.5 rounded-lg shadow-lg -translate-x-1/2">
                                    <div className="text-[10px] text-foreground-muted mb-1 font-mono uppercase tracking-wider flex justify-between items-center gap-3">
                                        <span>Point</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">#{hoverIndex + 1}</span>
                                    </div>
                                    <div className="text-xl font-bold text-foreground flex items-center gap-3">
                                        {currentData[hoverIndex]}
                                        <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                            +2.4%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-border absolute left-1/2 top-full -translate-x-1/2" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
