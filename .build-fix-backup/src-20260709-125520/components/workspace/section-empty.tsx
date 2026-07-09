export function SectionEmpty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#173047] bg-[#0b1e30]/60 px-4 py-8 text-center">
      <p className="text-sm font-semibold text-white">{title}</p>
      {text ? <p className="mt-1 text-sm text-slate-500">{text}</p> : null}
    </div>
  );
}
