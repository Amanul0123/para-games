"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { TrendPoint } from "@/types";

interface TrendChartProps {
  data: TrendPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Injuries",
            data: data.map((d) => d.injuries),
            borderColor: "#E03A18",
            backgroundColor: "rgba(224,58,24,0.12)",
            borderWidth: 2,
            pointRadius: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Illnesses",
            data: data.map((d) => d.illnesses),
            borderColor: "#BA7517",
            backgroundColor: "rgba(186,117,23,0.1)",
            borderWidth: 2,
            pointRadius: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: {
            ticks: { font: { size: 10 }, color: "rgba(71,85,105,0.7)", maxRotation: 30 },
            grid: { display: false },
          },
          y: {
            ticks: { font: { size: 10 }, color: "rgba(71,85,105,0.7)" },
            grid: { color: "rgba(15,23,42,0.06)" },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/60 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-200/70 px-4 py-3">
        <i className="ti ti-chart-bar text-slate-400" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-800">Daily trend</span>
      </div>
      <div className="p-4">
        <div style={{ position: "relative", height: 130 }}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Daily injury and illness trend over 7 days"
          />
        </div>
      </div>
    </div>
  );
}
