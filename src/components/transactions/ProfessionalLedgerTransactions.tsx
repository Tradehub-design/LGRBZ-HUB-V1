"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  NormalisedTransaction,
} from "@/lib/transactions/professionalTransactions";
import {
  deleteProfessionalLedgerTransaction,
  deleteProfessionalLedgerTransactions,
  loadProfessionalTransactions,
  restoreProfessionalLedgerTransactions,
  updateProfessionalLedgerTransaction,
} from "@/lib/transactions/professionalLedgerBridge";
import { ProfessionalTransactionsWorkspace } from "./ProfessionalTransactionsWorkspace";

type Props = {
  onAddTransaction?: () => void;
  className?: string;
};

export function ProfessionalLedgerTransactions({
  onAddTransaction,
  className,
}: Props) {
  const [
    transactions,
    setTransactions,
  ] = useState<
    NormalisedTransaction[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const refresh =
    useCallback(() => {
      setLoading(true);
      setError(null);

      try {
        const loaded =
          loadProfessionalTransactions();

        setTransactions(
          loaded
        );
      } catch (
        caughtError
      ) {
        const message =
          caughtError instanceof
          Error
            ? caughtError.message
            : "The transaction ledger could not be loaded.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (
      event: StorageEvent
    ) => {
      if (
        event.storageArea ===
        window.localStorage
      ) {
        refresh();
      }
    };

    const onLedgerChanged =
      () => {
        refresh();
      };

    window.addEventListener(
      "storage",
      onStorage
    );

    window.addEventListener(
      "lgrbz:ledger-changed",
      onLedgerChanged
    );

    window.addEventListener(
      "lgrbz:transactions-changed",
      onLedgerChanged
    );

    return () => {
      window.removeEventListener(
        "storage",
        onStorage
      );

      window.removeEventListener(
        "lgrbz:ledger-changed",
        onLedgerChanged
      );

      window.removeEventListener(
        "lgrbz:transactions-changed",
        onLedgerChanged
      );
    };
  }, [refresh]);

  const notifyLedgerChanged =
    () => {
      window.dispatchEvent(
        new CustomEvent(
          "lgrbz:ledger-changed"
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "lgrbz:transactions-changed"
        )
      );
    };

  const editTransaction =
    async (
      transaction: NormalisedTransaction
    ) => {
      updateProfessionalLedgerTransaction(
        transaction
      );

      setTransactions(
        loadProfessionalTransactions()
      );

      notifyLedgerChanged();
    };

  const deleteTransaction =
    async (
      transaction: NormalisedTransaction
    ) => {
      deleteProfessionalLedgerTransaction(
        transaction
      );

      setTransactions(
        loadProfessionalTransactions()
      );

      notifyLedgerChanged();
    };

  const bulkDeleteTransactions =
    async (
      selected:
        NormalisedTransaction[]
    ) => {
      deleteProfessionalLedgerTransactions(
        selected
      );

      setTransactions(
        loadProfessionalTransactions()
      );

      notifyLedgerChanged();
    };

  const restoreTransactions =
    async (
      removed:
        NormalisedTransaction[]
    ) => {
      restoreProfessionalLedgerTransactions(
        removed
      );

      setTransactions(
        loadProfessionalTransactions()
      );

      notifyLedgerChanged();
    };

  return (
    <div
      className={
        className ?? ""
      }
    >
      <ProfessionalTransactionsWorkspace
        transactions={
          transactions
        }
        loading={
          loading
        }
        error={error}
        onRetry={
          refresh
        }
        onAddTransaction={
          onAddTransaction
        }
        onEditTransaction={
          editTransaction
        }
        onDeleteTransaction={
          deleteTransaction
        }
        onBulkDeleteTransactions={
          bulkDeleteTransactions
        }
        onRestoreTransactions={
          restoreTransactions
        }
      />
    </div>
  );
}
