import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { MobileSuitDistribution } from '@/services/analytics';

interface MobileSuitChartProps {
    data?: MobileSuitDistribution[];
}

export function MobileSuitChart({ data }: MobileSuitChartProps) {
    if (!data) return null;

    const chartData = {
        series: data.map(d => d.count),
        options: {
            chart: {
                type: 'donut',
                fontFamily: 'Outfit, sans-serif'
            },
            labels: data.map(d => d.name),
            colors: ['#465fff', '#7084ff', '#99a7ff', '#c2caff'],
            plotOptions: {
                pie: {
                    donut: {
                        size: '70%',
                        labels: {
                            show: true,
                            name: { show: true, fontFamily: 'Outfit, sans-serif', color: '#6B7280' },
                            value: { show: true, fontSize: '24px', fontWeight: 600, color: '#374151', fontFamily: 'Outfit, sans-serif' },
                            total: {
                                show: true,
                                label: 'Total Units',
                                color: '#6B7280',
                                fontFamily: 'Outfit, sans-serif',
                                formatter: function (w: any) {
                                    return w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                                }
                            }
                        }
                    }
                }
            },
            dataLabels: { enabled: false },
            legend: {
                position: 'bottom',
                fontFamily: 'Outfit, sans-serif',
                labels: { colors: '#6B7280' }
            },
            stroke: { show: false },
            tooltip: { style: { fontFamily: 'Outfit, sans-serif' } }
        } as ApexOptions
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 font-orbitron">Unit Classification</h3>
            <Chart options={chartData.options} series={chartData.series} type="donut" height={350} />
        </div>
    );
}
