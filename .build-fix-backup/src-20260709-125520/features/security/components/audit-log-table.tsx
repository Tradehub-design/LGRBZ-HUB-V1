import { securityEvents } from "../mock-data";

export function AuditLogTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Audit Log</h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Time</th>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Type</th>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Description</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {securityEvents.map((event) => (
            <tr key={event.id}>
              <td className="px-5 py-4">{event.createdAt}</td>
              <td className="px-5 py-4 font-semibold text-slate-950">{event.type}</td>
              <td className="px-5 py-4 text-slate-600">{event.description}</td>
              <td className="px-5 py-4 text-right">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {event.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}