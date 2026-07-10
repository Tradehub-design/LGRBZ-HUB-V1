"use client";

import { useState } from "react";

import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";

export function useWorkbookImport() {
  const [loading, setLoading] = useState(false);

  async function importWorkbook(file: File) {
    setLoading(true);

    try {
      return await importMasterWorkbook(file);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    importWorkbook,
  };
}
