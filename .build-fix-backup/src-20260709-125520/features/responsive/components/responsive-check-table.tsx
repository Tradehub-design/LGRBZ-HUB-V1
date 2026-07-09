import { responsiveChecks } from "../mock-data";

export function ResponsiveCheckTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Responsive Checks
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Area</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Mobile</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Tablet</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Desktop</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {responsiveChecks.map((item) => (
            <tr key={item.id}>
              <td className="px-5 py-4 font-semibold text-slate-950">{item.area}</td>
              <td className="px-5 py-4 text-right">{item.mobile}</td>
              <td className="px-5 py-4 text-right">{item.tablet}</td>
              <td className="px-5 py-4 text-right">{item.desktop}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}