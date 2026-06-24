import type { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
};

export function PremiumCard({ children, className = "" }: PremiumCardProps) {
  return (
    <div
      className={`rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  note: string;
  tone?: "emerald" | "red" | "blue" | "amber" | "slate";
};

export function StatCard({
  label,
  value,
  note,
  tone = "slate",
}: StatCardProps) {
  const toneClass = {
    emerald: "from-emerald-500 to-teal-500 text-white",
    red: "from-rose-500 to-red-500 text-white",
    blue: "from-blue-500 to-indigo-500 text-white",
    amber: "from-amber-400 to-orange-500 text-slate-950",
    slate: "from-slate-900 to-slate-700 text-white",
  }[tone];

  return (
    <div className={`rounded-[1.5rem] bg-gradient-to-br p-5 shadow-sm ${toneClass}`}>
      <p className="text-sm opacity-85">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-3 text-xs opacity-80">{note}</p>
    </div>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}