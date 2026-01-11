import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { FactionDistribution } from '@/services/analytics';

interface FactionChartProps {
    data?: FactionDistribution[];
}

export function FactionChart({ data }: FactionChartProps) {
    if (!data) return null;

    const chartData = {
        series: [{
            name: "Pilots",
            data: data.map(d => d.count)
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                fontFamily: 'Outfit, sans-serif'
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                    barHeight: '60%',
                    distributed: true
                }
            },
            dataLabels: {
                enabled: true,
                style: { colors: ['#fff'] }
            },
            xaxis: {
                categories: data.map(d => d.name),
                labels: {
                    style: { colors: '#6B7280', fontFamily: 'Outfit, sans-serif' }
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
                borderColor: '#E5E7EB', // Gray-200 for better visibility in light mode
                strokeDashArray: 4,
                yaxis: { lines: { show: true } }
            },
            colors: ['#465fff'],
            tooltip: {
                style: { fontFamily: 'Outfit, sans-serif' }
            }
        } as ApexOptions
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Top Factions by Pilot Count</h3>
            <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
        </div>
    );
}
