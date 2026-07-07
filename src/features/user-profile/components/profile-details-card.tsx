import { userProfile } from "../mock-data";

export function ProfileDetailsCard() {
  const rows = [
    ["Name", userProfile.name],
    ["Email", userProfile.email],
    ["Role", userProfile.role],
    ["Base Currency", userProfile.baseCurrency],
    ["Timezone", userProfile.timezone],
    ["Plan", userProfile.plan],
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Account Details
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between py-3">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-950">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}