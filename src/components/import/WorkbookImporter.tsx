"use client";

import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";

import { useImportTransactions } from "@/hooks/useImportTransactions";

export default function WorkbookImporter() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { importFile, loading } = useImportTransactions();

  const [summary, setSummary] = useState<{
    sheetCount:number;
    transactionCount:number;
  } | null>(null);

  async function handleFile(file: File) {
    const result = await importFile(file);

    setSummary(result.summary);
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-4">
        <FileSpreadsheet className="h-6 w-6 text-green-600" />
        <div>
          <h2 className="font-semibold text-lg">
            Import Master Workbook
          </h2>

          <p className="text-sm text-gray-500">
            Upload your complete Finance Workbook
          </p>
        </div>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        <Upload className="inline mr-2 h-4 w-4"/>
        {loading ? "Importing..." : "Choose Workbook"}
      </button>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept=".xlsx,.xlsm,.xls"
        onChange={(e)=>{
          const file=e.target.files?.[0];
          if(file) handleFile(file);
        }}
      />

      {summary && (
        <div className="mt-6 rounded-lg bg-green-50 p-4">

          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <CheckCircle2 className="h-5 w-5"/>
            Workbook Imported
          </div>

          <div className="mt-2 text-sm">
            Worksheets detected: {summary.sheetCount}
          </div>

          <div className="text-sm">
            Transactions imported: {summary.transactionCount}
          </div>

        </div>
      )}

    </div>
  );
}
