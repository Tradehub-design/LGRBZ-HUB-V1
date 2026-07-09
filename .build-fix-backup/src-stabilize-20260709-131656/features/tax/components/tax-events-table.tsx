import { taxEvents } from "../mock-data";
import { formatTaxMoney } from "../format";

export function TaxEventsTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Tax Events</h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Date</th>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Type</th>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Symbol</th>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Description</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Amount</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Tax Year</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {taxEvents.map((event) => (
            <tr key={event.id}>
              <td className="px-5 py-4">{event.date}</td>
              <td className="px-5 py-4">{event.type}</td>
              <td className="px-5 py-4 font-semibold text-slate-950">{event.symbol}</td>
              <td className="px-5 py-4 text-slate-600">{event.description}</td>
              <td
                className={[
                  "px-5 py-4 text-right font-semibold",
                  event.amount >= 0 ? "text-emerald-700" : "text-rose-700",
                ].join(" ")}
              >
                {formatTaxMoney(event.amount)}
              </td>
              <td className="px-5 py-4 text-right">{event.taxYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
