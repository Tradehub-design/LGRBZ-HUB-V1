const palette = [
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-violet-500 to-purple-400",
  "from-rose-500 to-pink-400",
  "from-slate-400 to-slate-600",
];

function hash(input: string) {
  return input.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function AssetLogo({ symbol, size = "md" }: { symbol: string; size?: "sm" | "md" | "lg" }) {
  const clean = symbol.replace(".AX", "").replace("ASX:", "").slice(0, 3).toUpperCase();
  const gradient = palette[hash(symbol) % palette.length];

  const sizeClass = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-9 w-9 text-[10px]",
    lg: "h-11 w-11 text-xs",
  }[size];

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} ${sizeClass} font-black text-white shadow-lg`}>
      {clean || "?"}
    </div>
  );
}
