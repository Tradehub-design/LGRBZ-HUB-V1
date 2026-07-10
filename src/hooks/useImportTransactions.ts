"use client";

import { useState } from "react";
import { importIntoPortfolio } from "@/lib/import/store/importIntoPortfolio";

export function useImportTransactions() {
  const [loading, setLoading] = useState(false);

  async function importFile(file: File) {
    setLoading(true);

    try {
      return await importIntoPortfolio(file);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    importFile,
  };
}
