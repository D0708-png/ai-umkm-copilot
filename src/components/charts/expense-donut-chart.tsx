"use client";

import { useEffect, useRef } from "react";
import {
  ArcElement,
  Chart,
  DoughnutController,
  Tooltip,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip);

type ExpenseDonutChartProps = {
  data: {
    categoryName: string;
    total: number;
  }[];
};

const colors = ["#14b8a6", "#f59e0b", "#6366f1", "#ef4444", "#0f172a"];
const rupiah = new Intl.NumberFormat("id-ID");

export function ExpenseDonutChart({ data }: ExpenseDonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    chartRef.current?.destroy();

    const chartData =
      data.length > 0
        ? data
        : [
            {
              categoryName: "Belum ada data",
              total: 1,
            },
          ];

    chartRef.current = new Chart(context, {
      type: "doughnut",
      data: {
        labels: chartData.map((item) => item.categoryName),
        datasets: [
          {
            data: chartData.map((item) => item.total),
            backgroundColor: chartData.map(
              (_, index) => colors[index % colors.length]
            ),
            borderWidth: 0,
            hoverOffset: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#0b1220",
            padding: 12,
            callbacks: {
              label: (context) => {
                if (data.length === 0) {
                  return "Belum ada pengeluaran";
                }

                return `${context.label}: Rp ${rupiah.format(
                  Number(context.raw)
                )}`;
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}