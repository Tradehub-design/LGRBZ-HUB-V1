#!/usr/bin/env bash
set -e

echo "🔧 Import Centre V2 Bash 3/4: transaction preview..."

cat > src/lib/import/services/importMasterWorkbook.ts <<'TS'
import { readMasterWorkbook } from "../excel/readMasterWorkbook";
import { convertMasterTransactions } from "../transform/convertTransactions";
import { validateWorkbook } from "../validation/validateWorkbook";

export async function importMasterWorkbook(file: File) {
  const workbook = await readMasterWorkbook(file);

  const validation = validateWorkbook(workbook);

  if (!validation.valid) {
    throw new Error(validation.errors.join("\n"));
  }

  const transactions = convertMasterTransactions(workbook.transactions);

  return {
    workbookSheets: workbook.sheetNames,
    detectedHeaders: workbook.detectedHeaders,
    validation,
    transactions,
    preview: transactions.slice(0, 10),
    summary: {
      sheetCount: workbook.sheetNames.length,
      transactionCount: transactions.length,
    },
  };
}
TS

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/import-centre/page.tsx")
text = p.read_text()

text = text.replace(
'''  summary?: {
    sheetCount: number;
    transactionCount: number;
  };
};''',
'''  preview?: Array<Record<string, any>>;
  summary?: {
    sheetCount: number;
    transactionCount: number;
  };
};'''
)

insert = '''
          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Transaction Preview</p>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Action</th>
                    <th className="px-3 py-2">Ticker</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Platform</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.preview ?? []).map((tx, index) => (
                    <tr key={tx.id ?? index} className="border-t border-white/10 text-white">
                      <td className="px-3 py-2">{tx.date}</td>
                      <td className="px-3 py-2">{tx.action}</td>
                      <td className="px-3 py-2">{tx.ticker ?? tx.assetTicker}</td>
                      <td className="px-3 py-2">{tx.quantity}</td>
                      <td className="px-3 py-2">{tx.price}</td>
                      <td className="px-3 py-2">{tx.total}</td>
                      <td className="px-3 py-2">{tx.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
'''

marker = '''          {(result.validation?.warnings?.length ?? 0) > 0 && ('''
text = text.replace(marker, insert + "\n" + marker)

p.write_text(text)
PY

npm run build
