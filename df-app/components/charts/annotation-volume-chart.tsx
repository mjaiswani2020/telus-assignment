"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Mar 17", helpfulness: 580, safety: 120, sft: 200, arena: 60 },
  { date: "Mar 19", helpfulness: 620, safety: 140, sft: 220, arena: 70 },
  { date: "Mar 21", helpfulness: 700, safety: 180, sft: 260, arena: 80 },
  { date: "Mar 23", helpfulness: 750, safety: 200, sft: 280, arena: 100 },
  { date: "Mar 25", helpfulness: 820, safety: 250, sft: 300, arena: 110 },
  { date: "Mar 27", helpfulness: 900, safety: 300, sft: 320, arena: 130 },
  { date: "Mar 29", helpfulness: 950, safety: 350, sft: 340, arena: 150 },
  { date: "Mar 31", helpfulness: 1000, safety: 420, sft: 360, arena: 170 },
  { date: "Apr 2", helpfulness: 1050, safety: 500, sft: 380, arena: 200 },
  { date: "Apr 4", helpfulness: 1100, safety: 550, sft: 400, arena: 220 },
  { date: "Apr 7", helpfulness: 1150, safety: 620, sft: 420, arena: 250 },
  { date: "Apr 9", helpfulness: 1200, safety: 700, sft: 440, arena: 280 },
  { date: "Apr 11", helpfulness: 1280, safety: 780, sft: 450, arena: 300 },
  { date: "Apr 13", helpfulness: 1350, safety: 850, sft: 460, arena: 320 },
  { date: "Apr 16", helpfulness: 1500, safety: 920, sft: 470, arena: 340 },
];

const series = [
  { key: "helpfulness", color: "#005151", name: "Helpfulness" },
  { key: "safety", color: "#D97706", name: "Safety" },
  { key: "sft", color: "#059669", name: "SFT" },
  { key: "arena", color: "#2563EB", name: "Arena" },
];

export function AnnotationVolumeChart() {
  return (
    <div className="rounded-comfortable border border-level-2 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-inter text-[16px] font-medium text-ink">
          Annotation Volume — Last 30 Days
        </h3>
        <div className="flex items-center gap-4">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-4 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="font-inter text-[12px] text-tertiary-text">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="#EBEEED"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6F7A77" }}
            axisLine={{ stroke: "#EBEEED" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6F7A77" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid #EBEEED",
              boxShadow: "none",
            }}
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              name={s.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
