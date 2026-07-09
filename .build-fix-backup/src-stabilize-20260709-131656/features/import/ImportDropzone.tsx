"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useImportLedger } from "./useImportLedger";

export function ImportDropzone() {
  const { importLedger } =
    useImportLedger();

  const [loading, setLoading] =
    useState(false);

  async function onChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (!e.target.files?.length)
      return;

    setLoading(true);

    await importLedger(
      e.target.files[0],
    );

    setLoading(false);
  }

  return (
    <label className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.05]">
      <UploadCloud className="mb-5 h-12 w-12 text-slate-500" />

      <h3 className="text-xl font-semibold text-white">
        Import Master Ledger
      </h3>

      <p className="mt-2 max-w-md text-center text-sm text-slate-400">
        Upload your master CSV.
        Everything else updates
        automatically.
      </p>

      <div className="mt-6">
        <Button
          loading={loading}
        >
          Select CSV
        </Button>
      </div>

      <input
        hidden
        type="file"
        accept=".csv"
        onChange={onChange}
      />
    </label>
  );
}
