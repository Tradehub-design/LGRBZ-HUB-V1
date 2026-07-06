import { DividendTable } from "@/features/dividends/components/dividend-table";
import { DividendSummaryCards } from "@/features/dividends/components/dividend-summary-cards";
import { DividendsHeader } from "@/features/dividends/components/dividends-header";

export default function DividendsPage() {
  return (
    <div className="space-y-6">
      <DividendsHeader />
      <DividendSummaryCards />
      <DividendTable />
    </div>
  );
}

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Date",
              "Symbol",
              "Shares",
              "Dividend",
              "Gross",
              "Net",
            ].map((item) => (
              <th
                key={item}
                className="px-5 py-3 text-left font-semibold text-slate-600"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {dividendRecords.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-4">{row.date}</td>
              <td className="px-5 py-4">
                <div className="font-semibold">{row.symbol}</div>
                <div className="text-xs text-slate-500">{row.company}</div>
              </td>
              <td className="px-5 py-4">{row.shares}</td>
              <td className="px-5 py-4">
                {formatDividendMoney(row.dividendPerShare)}
              </td>
              <td className="px-5 py-4 font-semibold">
                {formatDividendMoney(row.grossAmount)}
              </td>
              <td className="px-5 py-4 font-semibold text-emerald-700">
                {formatDividendMoney(row.netAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
