import { getAssetBrand } from "@/lib/portfolio-engine/assetBrand";

const themeClass = {
  blue: "from-blue-500 to-cyan-400",
  green: "from-emerald-500 to-teal-400",
  orange: "from-orange-500 to-amber-400",
  purple: "from-violet-500 to-purple-400",
  rose: "from-rose-500 to-pink-400",
  slate: "from-slate-400 to-slate-600",
};

export function AssetLogo({ symbol, size = "md" }: { symbol: string; size?: "sm" | "md" | "lg" }) {
  const brand = getAssetBrand(symbol);

  const sizeClass = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-9 w-9 text-[10px]",
    lg: "h-11 w-11 text-xs",
  }[size];

  return (
    <div
      title={brand.displayName}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${themeClass[brand.theme]} ${sizeClass} font-black text-white shadow-lg`}
    >
      {brand.shortName.slice(0, 3)}
    </div>
  );
}
