import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface LineChartOneProps {
  data?: {
    name: string;
    units: number;
    pilots: number;
  }[];
}

export default function LineChartOne({ data = [] }: LineChartOneProps) {
  const categories = data.length > 0 ? data.map(item => item.name) : [];
  const unitSeries = data.length > 0 ? data.map(item => item.units) : [];
  const pilotSeries = data.length > 0 ? data.map(item => item.pilots) : [];

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Lore Units",
      data: unitSeries,
    },
    {
      name: "Pilots",
      data: pilotSeries,
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Database Growth</h3>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
