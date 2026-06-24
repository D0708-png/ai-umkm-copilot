"use client";

import { useEffect, useRef } from "react";
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Filler,
  Tooltip
);

type RevenueExpenseChartProps = {
  data: {
    label: string;
    income: number;
    expense: number;
  }[];
};

const rupiah = new Intl.NumberFormat("id-ID");

export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
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

    const revenueGradient = context.createLinearGradient(0, 0, 0, 280);
    revenueGradient.addColorStop(0, "rgba(16, 185, 129, 0.28)");
    revenueGradient.addColorStop(1, "rgba(16, 185, 129, 0)");

    const expenseGradient = context.createLinearGradient(0, 0, 0, 280);
    expenseGradient.addColorStop(0, "rgba(239, 68, 68, 0.18)");
    expenseGradient.addColorStop(1, "rgba(239, 68, 68, 0)");

    chartRef.current = new Chart(context, {
      type: "line",
      data: {
        labels: data.map((item) => item.label),
        datasets: [
          {
            label: "Revenue",
            data: data.map((item) => item.income),
            borderColor: "#10b981",
            backgroundColor: revenueGradient,
            borderWidth: 3,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: "#10b981",
            tension: 0.42,
          },
          {
            label: "Expense",
            data: data.map((item) => item.expense),
            borderColor: "#ef4444",
            backgroundColor: expenseGradient,
            borderWidth: 3,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: "#ef4444",
            tension: 0.42,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#0b1220",
            padding: 12,
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: Rp ${rupiah.format(
                  Number(context.raw)
                )}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#667085",
              font: {
                weight: 700,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(15, 23, 42, 0.08)",
            },
            border: {
              display: false,
            },
            ticks: {
              color: "#667085",
              callback: (value) => `${Number(value) / 1000000} jt`,
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