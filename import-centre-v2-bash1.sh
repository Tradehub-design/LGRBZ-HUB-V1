#!/usr/bin/env bash
set -e

echo "🔧 Building Import Centre V2 upload UI..."

cat > 'src/app/(dashboard)/import-centre/page.tsx' <<'TSX'
"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileSpreadsheet, Upload, AlertTriangle } from "lucide-react";
import { importIntoPortfolio } from "@/lib/import/store/importIntoPortfolio";

type ImportResult = {
  workbookSheets?: string[];
  detectedHeaders?: Record<string, string>;
  validation?: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  summary?: {
    sheetCount: number;
    transactionCount: number;
  };
};

export default function ImportCentrePage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const imported = await importIntoPortfolio(file);
      setResult(imported as ImportResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          Import Centre
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Master Workbook Import
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Upload your full LGRBZ master Excel workbook. The importer currently reads the Transactions sheet and prepares the rest of the workbook structure for future Budget, Property, Super, Goals and Watchlist imports.
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-300">
              <FileSpreadsheet className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Upload Excel Workbook
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Supported formats: .xlsx, .xlsm, .xls
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Required sheet: Transactions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Importing..." : "Choose Workbook"}
          </button>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".xlsx,.xlsm,.xls"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.currentTarget.value = "";
            }}
          />
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className="mt-6 rounded-2xl border border-dashed border-cyan-500/30 bg-cyan-500/5 p-8 text-center"
        >
          <Upload className="mx-auto h-8 w-8 text-cyan-300" />
          <p className="mt-3 font-semibold text-white">
            Drag your master workbook here
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Or use the Choose Workbook button above.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-5 w-5" />
            Import failed
          </div>
          <pre className="mt-3 whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 font-semibold text-emerald-200">
            <CheckCircle2 className="h-5 w-5" />
            Workbook imported
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Stat label="Worksheets" value={String(result.summary?.sheetCount ?? result.workbookSheets?.length ?? 0)} />
            <Stat label="Transactions" value={String(result.summary?.transactionCount ?? 0)} />
            <Stat label="Detected Columns" value={String(Object.keys(result.detectedHeaders ?? {}).length)} />
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Detected Sheets</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(result.workbookSheets ?? []).map((sheet) => (
                <span key={sheet} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {sheet}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Detected Transaction Columns</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {Object.entries(result.detectedHeaders ?? {}).map(([field, column]) => (
                <div key={field} className="flex justify-between rounded-lg bg-slate-900 px-3 py-2 text-sm">
                  <span className="text-slate-400">{field}</span>
                  <span className="text-white">{column}</span>
                </div>
              ))}
            </div>
          </div>

          {(result.validation?.warnings?.length ?? 0) > 0 && (
            <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-amber-200">Optional sheets not found yet</p>
              <p className="mt-1 text-sm text-amber-100/80">
                These are optional for future modules, not required for transaction import.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.validation?.warnings.map((warning) => (
                  <span key={warning} className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-100">
                    {warning}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
TSX

npm run build
