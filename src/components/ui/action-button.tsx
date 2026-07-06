import type { ButtonHTMLAttributes } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function ActionButton({
  variant = "secondary",
  className = "",
  ...props
}: ActionButtonProps) {
  const base =
    "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  const styles =
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-800"
      : "border border-slate-200 bg-slate-50 text-slate-950 hover:bg-slate-100";

  return (
    <button
      {...props}
      className={[base, styles, className].join(" ")}
    />
  );
}
