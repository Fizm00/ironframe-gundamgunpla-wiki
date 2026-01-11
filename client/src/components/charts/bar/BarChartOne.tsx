import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface BarChartOneProps {
  data?: {
    name: string;
    value: number;
  }[];
}

export default function BarChartOne({ data = [] }: BarChartOneProps) {
  const categories = data.length > 0 ? data.map(item => item.name) : ["No Data"];
  const values = data.length > 0 ? data.map(item => item.value) : [0];

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val} units`,
      },
    },
  };
  const series = [
    {
      name: "Units",
      data: values,
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 shadow-theme-md dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Units per Series</h3>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1500px] xl:min-w-[1200px]">
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
}
