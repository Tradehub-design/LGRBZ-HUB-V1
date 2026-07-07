import { userProfile } from "../mock-data";

export function ProfileFooter() {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="User" value={userProfile.name} />
        <Metric title="Role" value={userProfile.role} />
        <Metric title="Currency" value={userProfile.baseCurrency} />
        <Metric title="Plan" value={userProfile.plan} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}