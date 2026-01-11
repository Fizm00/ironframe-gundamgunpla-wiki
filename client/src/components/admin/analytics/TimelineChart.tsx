import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TimelineDistribution } from '@/services/analytics';

interface TimelineChartProps {
    data?: TimelineDistribution[];
}

export function TimelineChart({ data }: TimelineChartProps) {
    if (!data) return null;

    const chartData = {
        series: [{
            name: "Events",
            data: data.map(d => d.count)
        }],
        options: {
            chart: {
                type: 'area',
                height: 350,
                toolbar: { show: false },
                fontFamily: 'Outfit, sans-serif'
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.2,
                    stops: [0, 90, 100]
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: data.map(d => d.name),
                labels: {
                    style: { colors: '#6B7280', fontFamily: 'Outfit, sans-serif' },
                    rotate: -45
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: {
                    style: { colors: '#6B7280', fontFamily: 'Outfit, sans-serif' }
                }
            },
            grid: {
                borderColor: '#E5E7EB',
                strokeDashArray: 4
            },
            colors: ['#465fff'],
            tooltip: { style: { fontFamily: 'Outfit, sans-serif' } }
        } as ApexOptions
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Events Distribution per Era</h3>
            <Chart options={chartData.options} series={chartData.series} type="area" height={350} />
        </div>
    );
}
