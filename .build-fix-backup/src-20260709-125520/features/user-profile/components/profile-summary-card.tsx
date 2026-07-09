import { userProfile } from "../mock-data";

export function ProfileSummaryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Profile Summary
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Name" value={userProfile.name} />
        <Metric title="Role" value={userProfile.role} />
        <Metric title="Currency" value={userProfile.baseCurrency} />
        <Metric title="Plan" value={userProfile.plan} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="text-xs uppercase text-slate-500">{title}</div>
      <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}