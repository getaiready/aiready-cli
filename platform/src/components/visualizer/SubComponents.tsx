'use client';

export function LegendItem({
  color,
  label,
  active = true,
  onClick,
}: {
  color: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 group w-full transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`}
    >
      <div
        className="w-2.5 h-2.5 rounded-full shadow-lg transition-transform group-hover:scale-125"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}44` }}
      />
      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
        {label}
      </span>
    </button>
  );
}

export function StatItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
        {label}
      </div>
      <div className="text-sm font-black text-white">{value}</div>
    </div>
  );
}
