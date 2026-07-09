export function PremiumLineChart() {
  return (
    <div className="relative h-72 overflow-hidden rounded-2xl border border-[#173047] bg-[#081a2b] p-5">
      {[8, 24, 40, 56].map((top) => (
        <div key={top} className="absolute inset-x-5 h-px bg-slate-800" style={{ top: `${top}%` }} />
      ))}

      <svg viewBox="0 0 900 240" className="relative z-10 h-full w-full">
        <defs>
          <linearGradient id="premiumArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1f8cff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1f8cff" stopOpacity="0" />
          </linearGradient>
          <filter id="premiumGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M0,190 C80,175 110,145 170,155 C230,166 250,125 320,132 C390,140 420,94 480,105 C555,118 590,70 650,76 C720,82 750,42 810,54 C850,62 870,43 900,35 L900,240 L0,240 Z"
          fill="url(#premiumArea)"
        />
        <path
          d="M0,190 C80,175 110,145 170,155 C230,166 250,125 320,132 C390,140 420,94 480,105 C555,118 590,70 650,76 C720,82 750,42 810,54 C850,62 870,43 900,35"
          fill="none"
          stroke="#1f8cff"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#premiumGlow)"
        />
        <circle cx="900" cy="35" r="7" fill="#1f8cff" stroke="#93c5fd" strokeWidth="3" />
      </svg>
    </div>
  );
}

export function PremiumDonut({ label, value }: { label: string; value: string }) {
  return (
    <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#1f8cff_0_42%,#7c3aed_42%_70%,#f97316_70%_86%,#14b8a6_86%_94%,#64748b_94%_100%)] shadow-[0_0_60px_rgba(31,140,255,0.20)]">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#071827]">
        <p className="text-center text-xs text-slate-400">
          {label}
          <span className="block text-xl font-semibold text-white">{value}</span>
        </p>
      </div>
    </div>
  );
}
