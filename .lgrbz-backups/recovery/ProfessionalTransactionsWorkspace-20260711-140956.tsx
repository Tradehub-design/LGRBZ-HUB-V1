"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  defaultTransactionFilters,
  filterTransactions,
  normaliseTransaction,
  NormalisedTransaction,
  paginateTransactions,
  sortTransactions,
  TransactionFilterState,
  TransactionSortKey,
  transactionsToCsv,
} from "@/lib/transactions/professionalTransactions";
import {
  findNextFocusedTransactionId,
  isTypingTarget,
  resolveTransactionKeyboardCommand,
} from "@/lib/transactions/transactionKeyboard";
import {
  applyTransactionDelete,
  applyTransactionEdit,
  createDeleteOperation,
  createEditOperation,
  OptimisticTransactionOperation,
  undoOptimisticOperation,
} from "@/lib/transactions/transactionOptimisticState";
import {
  countActiveTransactionFilters,
} from "@/lib/transactions/transactionPreferences";
import {
  defaultTransactionTablePreferences,
  loadTransactionTablePreferences,
  saveTransactionTablePreferences,
  TransactionTablePreferences,
} from "@/lib/transactions/transactionTablePreferences";
import {
  defaultTransactionColumnLayout,
  loadTransactionColumnLayout,
  saveTransactionColumnLayout,
  TransactionColumnLayout,
} from "@/lib/transactions/transactionColumnLayout";
import {
  getTransactionFieldValue,
  transactionToClipboardCsv,
  transactionToClipboardText,
  writeTransactionClipboard,
} from "@/lib/transactions/transactionClipboard";
import {
  duplicateTransactionDraft,
} from "@/lib/transactions/transactionDuplicate";
import {
  createTransactionToast,
  TransactionToast,
} from "@/lib/transactions/transactionToast";
import { useDeferredTransactionSearch } from "@/hooks/useDeferredTransactionSearch";
import { ProfessionalTransactionTable } from "./ProfessionalTransactionTable";
import { TransactionAdvancedFilters } from "./TransactionAdvancedFilters";
import { TransactionBulkActionBar } from "./TransactionBulkActionBar";
import { TransactionContextMenu } from "./TransactionContextMenu";
import { TransactionDeleteDialog } from "./TransactionDeleteDialog";
import { TransactionEditDrawer } from "./TransactionEditDrawer";
import { TransactionEmptyState } from "./TransactionEmptyState";
import { TransactionErrorState } from "./TransactionErrorState";
import { TransactionKeyboardHelp } from "./TransactionKeyboardHelp";
import { TransactionLoadingState } from "./TransactionLoadingState";
import { TransactionMobileCards } from "./TransactionMobileCards";
import { TransactionOperationHistory } from "./TransactionOperationHistory";
import { TransactionPagination } from "./TransactionPagination";
import { TransactionPerformanceNotice } from "./TransactionPerformanceNotice";
import { TransactionPresetManager } from "./TransactionPresetManager";
import { TransactionQualityPanel } from "./TransactionQualityPanel";
import { TransactionResultStatus } from "./TransactionResultStatus";
import { TransactionStickyWorkspaceBar } from "./TransactionStickyWorkspaceBar";
import { TransactionSummaryCards } from "./TransactionSummaryCards";
import { TransactionToastViewport } from "./TransactionToastViewport";
import { TransactionToolbar } from "./TransactionToolbar";
import { TransactionViewSettings } from "./TransactionViewSettings";

type Props = {
  transactions: any[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onAddTransaction?: () => void;
  onEditTransaction?: (
    transaction: NormalisedTransaction
  ) => void | Promise<void>;
  onDeleteTransaction?: (
    transaction: NormalisedTransaction
  ) => void | Promise<void>;
  onBulkDeleteTransactions?: (
    transactions: NormalisedTransaction[]
  ) => void | Promise<void>;
  onRestoreTransactions?: (
    transactions: NormalisedTransaction[]
  ) => void | Promise<void>;
};

export function ProfessionalTransactionsWorkspace({
  transactions,
  loading = false,
  error = null,
  onRetry,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onBulkDeleteTransactions,
  onRestoreTransactions,
}: Props) {
  const workspaceRef =
    useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] =
    useState<TransactionFilterState>(
      defaultTransactionFilters
    );

  const deferredSearch =
    useDeferredTransactionSearch(
      filters.search
    );

  const effectiveFilters =
    useMemo<TransactionFilterState>(
      () => ({
        ...filters,
        search: deferredSearch,
      }),
      [filters, deferredSearch]
    );

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<Set<string>>(
    new Set()
  );

  const [
    focusedId,
    setFocusedId,
  ] = useState<string | null>(
    null
  );

  const [page, setPage] =
    useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState(25);

  const [
    sortKey,
    setSortKey,
  ] =
    useState<TransactionSortKey>(
      "date"
    );

  const [
    sortDirection,
    setSortDirection,
  ] = useState<
    "asc" | "desc"
  >("desc");

  const [
    optimisticTransactions,
    setOptimisticTransactions,
  ] = useState<
    NormalisedTransaction[]
  >([]);

  const [
    operations,
    setOperations,
  ] = useState<
    OptimisticTransactionOperation[]
  >([]);

  const [toasts, setToasts] =
    useState<TransactionToast[]>(
      []
    );

  const [
    editingTransaction,
    setEditingTransaction,
  ] =
    useState<NormalisedTransaction | null>(
      null
    );

  const [
    duplicateSourceTransaction,
    setDuplicateSourceTransaction,
  ] =
    useState<NormalisedTransaction | null>(
      null
    );

  const [
    contextMenuTransaction,
    setContextMenuTransaction,
  ] =
    useState<NormalisedTransaction | null>(
      null
    );

  const [
    contextMenuPosition,
    setContextMenuPosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const [
    pendingDeleteTransactions,
    setPendingDeleteTransactions,
  ] = useState<
    NormalisedTransaction[]
  >([]);

  const [
    savingTransaction,
    setSavingTransaction,
  ] = useState(false);

  const [
    deletingTransaction,
    setDeletingTransaction,
  ] = useState(false);

  const [
    advancedFiltersOpen,
    setAdvancedFiltersOpen,
  ] = useState(false);

  const [
    presetManagerOpen,
    setPresetManagerOpen,
  ] = useState(false);

  const [
    viewSettingsOpen,
    setViewSettingsOpen,
  ] = useState(false);

  const [
    keyboardHelpOpen,
    setKeyboardHelpOpen,
  ] = useState(false);

  const [
    historyOpen,
    setHistoryOpen,
  ] = useState(false);

  const [
    qualityOpen,
    setQualityOpen,
  ] = useState(false);

  const [
    stickyBarVisible,
    setStickyBarVisible,
  ] = useState(false);

  const [
    tablePreferences,
    setTablePreferences,
  ] =
    useState<TransactionTablePreferences>(
      defaultTransactionTablePreferences
    );

  const [
    columnLayout,
    setColumnLayout,
  ] =
    useState<TransactionColumnLayout>(
      defaultTransactionColumnLayout
    );

  const sourceNormalised =
    useMemo(
      () =>
        transactions.map(
          (
            transaction,
            index
          ) =>
            normaliseTransaction(
              transaction,
              index
            )
        ),
      [transactions]
    );

  useEffect(() => {
    setOptimisticTransactions(
      sourceNormalised
    );
  }, [sourceNormalised]);

  useEffect(() => {
    setTablePreferences(
      loadTransactionTablePreferences()
    );
  }, []);

  useEffect(() => {
    setColumnLayout(
      loadTransactionColumnLayout()
    );
  }, []);

  const addToast = (
    toast: Omit<
      TransactionToast,
      "id"
    >
  ) => {
    const created =
      createTransactionToast(
        toast
      );

    setToasts(
      (current) => [
        ...current,
        created,
      ]
    );

    return created.id;
  };

  const dismissToast = (
    id: string
  ) => {
    setToasts(
      (current) =>
        current.filter(
          (toast) =>
            toast.id !== id
        )
    );
  };

  const addOperation = (
    operation: OptimisticTransactionOperation
  ) => {
    setOperations(
      (current) =>
        [
          operation,
          ...current,
        ].slice(0, 20)
    );
  };

  const updateTablePreferences =
    (
      preferences: TransactionTablePreferences
    ) => {
      setTablePreferences(
        preferences
      );

      saveTransactionTablePreferences(
        preferences
      );
    };

  const normalised =
    optimisticTransactions;

  const symbols =
    useMemo(
      () =>
        Array.from(
          new Set(
            normalised
              .map(
                (row) =>
                  row.symbol
              )
              .filter(
                Boolean
              )
          )
        ).sort(),
      [normalised]
    );

  const filtered =
    useMemo(
      () =>
        filterTransactions(
          normalised,
          effectiveFilters
        ),
      [
        normalised,
        effectiveFilters,
      ]
    );

  const sorted =
    useMemo(
      () =>
        sortTransactions(
          filtered,
          sortKey,
          sortDirection
        ),
      [
        filtered,
        sortKey,
        sortDirection,
      ]
    );

  const paginated =
    useMemo(
      () =>
        paginateTransactions(
          sorted,
          page,
          pageSize
        ),
      [
        sorted,
        page,
        pageSize,
      ]
    );

  const selectedTransactions =
    useMemo(
      () =>
        sorted.filter(
          (row) =>
            selectedIds.has(
              row.id
            )
        ),
      [
        sorted,
        selectedIds,
      ]
    );

  const focusedTransaction =
    useMemo(
      () =>
        paginated.rows.find(
          (row) =>
            row.id ===
            focusedId
        ) ?? null,
      [
        paginated.rows,
        focusedId,
      ]
    );

  const activeFilterCount =
    countActiveTransactionFilters(
      filters
    );

  const hasActiveFilters =
    activeFilterCount > 0;

  useEffect(() => {
    setPage(1);
  }, [
    effectiveFilters,
    pageSize,
  ]);

  useEffect(() => {
    if (
      page >
      paginated.totalPages
    ) {
      setPage(
        paginated.totalPages
      );
    }
  }, [
    page,
    paginated.totalPages,
  ]);

  useEffect(() => {
    if (
      paginated.rows
        .length === 0
    ) {
      setFocusedId(null);
      return;
    }

    const focusedStillVisible =
      focusedId &&
      paginated.rows.some(
        (row) =>
          row.id ===
          focusedId
      );

    if (
      !focusedStillVisible
    ) {
      setFocusedId(
        paginated.rows[0]
          .id
      );
    }
  }, [
    paginated.rows,
    focusedId,
  ]);

  useEffect(() => {
    setSelectedIds(
      (current) => {
        const validIds =
          new Set(
            normalised.map(
              (row) =>
                row.id
            )
          );

        const next =
          new Set<string>();

        current.forEach(
          (id) => {
            if (
              validIds.has(
                id
              )
            ) {
              next.add(id);
            }
          }
        );

        return next;
      }
    );
  }, [normalised]);

  useEffect(() => {
    const handleScroll =
      () => {
        const workspaceTop =
          workspaceRef.current
            ?.getBoundingClientRect()
            .top ?? 0;

        setStickyBarVisible(
          window.scrollY >
            260 ||
            workspaceTop <
              -180
        );
      };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const exportCsv = (
    rows = sorted,
    fileSuffix =
      "filtered"
  ) => {
    const csv =
      transactionsToCsv(
        rows
      );

    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8",
      });

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href = url;

    anchor.download =
      `lgrbz-transactions-${fileSuffix}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    anchor.click();

    URL.revokeObjectURL(
      url
    );

    addToast({
      title:
        "CSV export created",
      message: `${rows.length.toLocaleString(
        "en-AU"
      )} transaction${
        rows.length === 1
          ? ""
          : "s"
      } exported.`,
      tone: "success",
      duration: 3500,
    });
  };

  const updateColumnLayout = (
    layout: TransactionColumnLayout
  ) => {
    setColumnLayout(
      layout
    );

    saveTransactionColumnLayout(
      layout
    );
  };

  const focusSearch =
    () => {
      const input =
        document.querySelector<HTMLInputElement>(
          'input[placeholder^="Search symbol"]'
        );

      input?.focus();
      input?.select();
    };

  const focusTransactionElement =
    (
      transactionId:
        | string
        | null
    ) => {
      if (
        !transactionId
      ) {
        return;
      }

      window.requestAnimationFrame(
        () => {
          const desktopRow =
            document.getElementById(
              `transaction-row-${transactionId}`
            );

          const mobileRow =
            document.getElementById(
              `transaction-mobile-row-${transactionId}`
            );

          const target =
            window.innerWidth >=
            1024
              ? desktopRow
              : mobileRow;

          target?.focus({
            preventScroll:
              false,
          });

          target?.scrollIntoView(
            {
              block:
                "nearest",
              behavior:
                "smooth",
            }
          );
        }
      );
    };

  const setAndFocusTransaction =
    (
      transactionId:
        | string
        | null
    ) => {
      setFocusedId(
        transactionId
      );

      focusTransactionElement(
        transactionId
      );
    };

  const toggleRow = (
    id: string
  ) => {
    setSelectedIds(
      (current) => {
        const next =
          new Set(
            current
          );

        if (
          next.has(id)
        ) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      }
    );

    setFocusedId(id);
  };

  const toggleAll =
    () => {
      setSelectedIds(
        (current) => {
          const allVisibleSelected =
            paginated.rows
              .length >
              0 &&
            paginated.rows.every(
              (row) =>
                current.has(
                  row.id
                )
            );

          const next =
            new Set(
              current
            );

          if (
            allVisibleSelected
          ) {
            paginated.rows.forEach(
              (row) =>
                next.delete(
                  row.id
                )
            );
          } else {
            paginated.rows.forEach(
              (row) =>
                next.add(
                  row.id
                )
            );
          }

          return next;
        }
      );
    };

  const selectVisible =
    () => {
      setSelectedIds(
        (current) => {
          const next =
            new Set(
              current
            );

          paginated.rows.forEach(
            (row) =>
              next.add(
                row.id
              )
          );

          return next;
        }
      );
    };

  const handleSort = (
    key: TransactionSortKey
  ) => {
    if (
      key === sortKey
    ) {
      setSortDirection(
        (current) =>
          current ===
          "asc"
            ? "desc"
            : "asc"
      );

      return;
    }

    setSortKey(key);
    setSortDirection(
      "desc"
    );
  };

  const requestDeleteTransaction =
    (
      transaction: NormalisedTransaction
    ) => {
      setPendingDeleteTransactions(
        [transaction]
      );
    };

  const openTransactionContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    transaction: NormalisedTransaction
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setFocusedId(
      transaction.id
    );

    setContextMenuTransaction(
      transaction
    );

    setContextMenuPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const closeTransactionContextMenu =
    () => {
      setContextMenuTransaction(
        null
      );
    };

  const copyTransactionValue = async (
    title: string,
    value: string
  ) => {
    try {
      await writeTransactionClipboard(
        value
      );

      addToast({
        title,
        message:
          "Copied to clipboard.",
        tone: "success",
        duration: 2500,
      });
    } catch {
      addToast({
        title:
          "Clipboard unavailable",
        message:
          "The selected transaction information could not be copied.",
        tone: "error",
        duration: 4500,
      });
    }
  };

  const copyTransactionSymbol = (
    transaction: NormalisedTransaction
  ) =>
    void copyTransactionValue(
      `${transaction.symbol} copied`,
      getTransactionFieldValue(
        transaction,
        "symbol"
      )
    );

  const copyTransactionRow = (
    transaction: NormalisedTransaction
  ) =>
    void copyTransactionValue(
      "Transaction copied",
      transactionToClipboardText(
        transaction
      )
    );

  const copyTransactionCsv = (
    transaction: NormalisedTransaction
  ) =>
    void copyTransactionValue(
      "Transaction CSV copied",
      transactionToClipboardCsv(
        transaction
      )
    );

  const duplicateTransaction = (
    transaction: NormalisedTransaction
  ) => {
    const duplicate =
      duplicateTransactionDraft(
        transaction
      );

    setDuplicateSourceTransaction(
      transaction
    );

    setEditingTransaction(
      duplicate
    );

    addToast({
      title:
        "Duplicate transaction prepared",
      message:
        "Review the copied transaction and save it as a new ledger entry.",
      tone: "info",
      duration: 4000,
    });
  };

  const requestBulkDelete =
    () => {
      if (
        selectedTransactions.length ===
        0
      ) {
        return;
      }

      setPendingDeleteTransactions(
        selectedTransactions
      );
    };

  const undoOperation =
    async (
      operation: OptimisticTransactionOperation
    ) => {
      setOptimisticTransactions(
        (current) =>
          undoOptimisticOperation(
            current,
            operation
          )
      );

      setOperations(
        (current) =>
          current.filter(
            (entry) =>
              entry.id !==
              operation.id
          )
      );

      try {
        if (
          operation.type ===
          "EDIT"
        ) {
          await onEditTransaction?.(
            operation.before
          );
        } else {
          await onRestoreTransactions?.(
            operation.removed
          );
        }

        addToast({
          title:
            "Action undone",
          message:
            operation.label,
          tone: "success",
          duration: 3500,
        });
      } catch {
        setOptimisticTransactions(
          (current) => {
            if (
              operation.type ===
              "EDIT"
            ) {
              return applyTransactionEdit(
                current,
                operation.after
              );
            }

            return applyTransactionDelete(
              current,
              new Set(
                operation.removed.map(
                  (row) =>
                    row.id
                )
              )
            );
          }
        );

        addOperation(
          operation
        );

        addToast({
          title:
            "Undo failed",
          message:
            "The ledger could not be restored. The latest state has been reapplied.",
          tone: "error",
          duration: 6000,
        });
      }
    };

  const saveEditedTransaction =
    async (
      transaction: NormalisedTransaction
    ) => {
      if (
        savingTransaction
      ) {
        return;
      }

      if (
        duplicateSourceTransaction &&
        transaction.id !==
          duplicateSourceTransaction.id
      ) {
        addToast({
          title:
            "Duplicate ready",
          message:
            "Creation of brand-new transactions remains connected through the existing Add Transaction ledger tools.",
          tone: "info",
          duration: 5500,
        });

        setEditingTransaction(
          null
        );

        setDuplicateSourceTransaction(
          null
        );

        onAddTransaction?.();

        return;
      }

      const before =
        normalised.find(
          (row) =>
            row.id ===
            transaction.id
        );

      if (!before) {
        addToast({
          title:
            "Transaction not found",
          message:
            "The transaction may have changed or been removed.",
          tone: "error",
          duration: 5000,
        });

        return;
      }

      const operation =
        createEditOperation(
          before,
          transaction
        );

      setSavingTransaction(
        true
      );

      setOptimisticTransactions(
        (current) =>
          applyTransactionEdit(
            current,
            transaction
          )
      );

      try {
        await onEditTransaction?.(
          transaction
        );

        addOperation(
          operation
        );

        addToast({
          title:
            "Transaction updated",
          message: `${transaction.symbol} ${transaction.type} was saved.`,
          tone: "success",
          actionLabel:
            "Undo",
          onAction: () =>
            void undoOperation(
              operation
            ),
          duration: 7000,
        });
      } catch {
        setOptimisticTransactions(
          (current) =>
            applyTransactionEdit(
              current,
              before
            )
        );

        addToast({
          title:
            "Update failed",
          message:
            "The transaction could not be saved. Your previous values were restored.",
          tone: "error",
          duration: 6500,
        });

        throw new Error(
          "Transaction update failed"
        );
      } finally {
        setSavingTransaction(
          false
        );
      }
    };

  const confirmDelete =
    async () => {
      if (
        deletingTransaction ||
        pendingDeleteTransactions.length ===
          0
      ) {
        return;
      }

      const removed = [
        ...pendingDeleteTransactions,
      ];

      const operation =
        createDeleteOperation(
          removed
        );

      const removedIds =
        new Set(
          removed.map(
            (row) =>
              row.id
          )
        );

      setDeletingTransaction(
        true
      );

      setOptimisticTransactions(
        (current) =>
          applyTransactionDelete(
            current,
            removedIds
          )
      );

      setPendingDeleteTransactions(
        []
      );

      setSelectedIds(
        new Set()
      );

      try {
        if (
          removed.length ===
          1
        ) {
          await onDeleteTransaction?.(
            removed[0]
          );
        } else {
          await onBulkDeleteTransactions?.(
            removed
          );
        }

        addOperation(
          operation
        );

        addToast({
          title:
            removed.length ===
            1
              ? "Transaction deleted"
              : `${removed.length} transactions deleted`,
          message:
            removed.length ===
            1
              ? `${removed[0].symbol} ${removed[0].type} was removed.`
              : "The selected transactions were removed from the workspace.",
          tone: "warning",
          actionLabel:
            "Undo",
          onAction: () =>
            void undoOperation(
              operation
            ),
          duration: 8000,
        });
      } catch {
        setOptimisticTransactions(
          (current) => {
            const existingIds =
              new Set(
                current.map(
                  (row) =>
                    row.id
                )
              );

            return [
              ...current,
              ...removed.filter(
                (row) =>
                  !existingIds.has(
                    row.id
                  )
              ),
            ];
          }
        );

        addToast({
          title:
            "Deletion failed",
          message:
            "The transactions were restored because the ledger update failed.",
          tone: "error",
          duration: 6500,
        });
      } finally {
        setDeletingTransaction(
          false
        );
      }
    };

  const resetFilters =
    () => {
      setFilters(
        defaultTransactionFilters
      );

      setPage(1);
    };

  const applyPreset =
    (
      presetFilters: TransactionFilterState
    ) => {
      setFilters(
        presetFilters
      );

      setPage(1);
    };

  const previousPage =
    () => {
      setPage(
        (current) =>
          Math.max(
            1,
            current - 1
          )
      );
    };

  const nextPage =
    () => {
      setPage(
        (current) =>
          Math.min(
            paginated.totalPages,
            current + 1
          )
      );
    };

  const openTransactionById =
    (
      transactionId: string
    ) => {
      const transaction =
        normalised.find(
          (row) =>
            row.id ===
            transactionId
        );

      if (!transaction) {
        addToast({
          title:
            "Transaction unavailable",
          message:
            "The selected transaction could not be found.",
          tone: "error",
          duration: 4000,
        });

        return;
      }

      setQualityOpen(
        false
      );

      setEditingTransaction(
        transaction
      );

      setFocusedId(
        transaction.id
      );
    };

  const overlaysOpen =
    Boolean(
      editingTransaction
    ) ||
    pendingDeleteTransactions.length >
      0 ||
    advancedFiltersOpen ||
    presetManagerOpen ||
    viewSettingsOpen ||
    keyboardHelpOpen ||
    historyOpen ||
    qualityOpen;

  useEffect(() => {
    const onKeyDown =
      (
        event: KeyboardEvent
      ) => {
        const command =
          resolveTransactionKeyboardCommand(
            event
          );

        if (!command) {
          return;
        }

        const typing =
          isTypingTarget(
            event.target
          );

        if (
          typing &&
          command !==
            "FOCUS_SEARCH" &&
          command !==
            "OPEN_ADVANCED_FILTERS" &&
          command !==
            "OPEN_SAVED_VIEWS" &&
          command !==
            "OPEN_COLUMN_SETTINGS" &&
          command !==
            "EXPORT" &&
          command !==
            "CLEAR_SELECTION"
        ) {
          return;
        }

        if (
          overlaysOpen
        ) {
          return;
        }

        if (
          command ===
          "FOCUS_SEARCH"
        ) {
          event.preventDefault();
          focusSearch();
          return;
        }

        if (
          command ===
          "OPEN_ADVANCED_FILTERS"
        ) {
          event.preventDefault();
          setAdvancedFiltersOpen(
            true
          );
          return;
        }

        if (
          command ===
          "OPEN_SAVED_VIEWS"
        ) {
          event.preventDefault();
          setPresetManagerOpen(
            true
          );
          return;
        }

        if (
          command ===
          "OPEN_COLUMN_SETTINGS"
        ) {
          event.preventDefault();
          setViewSettingsOpen(
            true
          );
          return;
        }

        if (
          command ===
          "EXPORT"
        ) {
          event.preventDefault();
          exportCsv();
          return;
        }

        if (
          command ===
          "SELECT_ALL_VISIBLE"
        ) {
          event.preventDefault();
          selectVisible();
          return;
        }

        if (
          command ===
            "MOVE_UP" ||
          command ===
            "MOVE_DOWN" ||
          command ===
            "MOVE_FIRST" ||
          command ===
            "MOVE_LAST"
        ) {
          event.preventDefault();

          const nextId =
            findNextFocusedTransactionId(
              paginated.rows,
              focusedId,
              command
            );

          setAndFocusTransaction(
            nextId
          );

          return;
        }

        if (
          command ===
          "TOGGLE_SELECTED"
        ) {
          if (
            !focusedTransaction
          ) {
            return;
          }

          event.preventDefault();

          toggleRow(
            focusedTransaction.id
          );

          return;
        }

        if (
          command ===
          "EDIT"
        ) {
          if (
            !focusedTransaction
          ) {
            return;
          }

          event.preventDefault();

          setEditingTransaction(
            focusedTransaction
          );

          return;
        }

        if (
          command ===
          "DELETE"
        ) {
          if (
            !focusedTransaction
          ) {
            return;
          }

          event.preventDefault();

          requestDeleteTransaction(
            focusedTransaction
          );

          return;
        }

        if (
          command ===
          "NEXT_PAGE"
        ) {
          event.preventDefault();
          nextPage();
          return;
        }

        if (
          command ===
          "PREVIOUS_PAGE"
        ) {
          event.preventDefault();
          previousPage();
          return;
        }

        if (
          command ===
          "CLEAR_SELECTION"
        ) {
          event.preventDefault();

          setSelectedIds(
            new Set()
          );
        }
      };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
  }, [
    overlaysOpen,
    paginated.rows,
    focusedId,
    focusedTransaction,
    sorted,
    paginated.totalPages,
  ]);

  if (loading) {
    return (
      <TransactionLoadingState />
    );
  }

  if (error) {
    return (
      <TransactionErrorState
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (
    normalised.length ===
    0
  ) {
    return (
      <TransactionEmptyState
        onAddTransaction={
          onAddTransaction
        }
      />
    );
  }

  return (
    <div
      ref={workspaceRef}
      className="space-y-4 pb-24"
    >
      <TransactionToastViewport
        toasts={toasts}
        onDismiss={
          dismissToast
        }
      />

      <TransactionSummaryCards
        transactions={
          filtered
        }
      />

      <TransactionPerformanceNotice
        transactionCount={
          normalised.length
        }
        filteredCount={
          filtered.length
        }
      />

      <TransactionResultStatus
        filteredCount={
          filtered.length
        }
        totalCount={
          normalised.length
        }
        search={
          filters.search
        }
        activeFilterCount={
          activeFilterCount
        }
      />

      <div className="sticky top-3 z-30">
        <TransactionToolbar
          filters={filters}
          symbols={symbols}
          selectedCount={
            selectedIds.size
          }
          density={
            tablePreferences.density
          }
          operationCount={
            operations.length
          }
          onFiltersChange={
            setFilters
          }
          onExportCsv={() =>
            exportCsv(
              sorted,
              "filtered"
            )
          }
          onClearSelection={() =>
            setSelectedIds(
              new Set()
            )
          }
          onOpenAdvancedFilters={() =>
            setAdvancedFiltersOpen(
              true
            )
          }
          onOpenPresets={() =>
            setPresetManagerOpen(
              true
            )
          }
          onOpenViewSettings={() =>
            setViewSettingsOpen(
              true
            )
          }
          onOpenHistory={() =>
            setHistoryOpen(
              true
            )
          }
          onResetFilters={
            resetFilters
          }
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() =>
            setQualityOpen(
              true
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Review Data Quality
        </button>
      </div>

      <TransactionBulkActionBar
        selectedCount={
          selectedIds.size
        }
        onClear={() =>
          setSelectedIds(
            new Set()
          )
        }
        onExportSelected={() =>
          exportCsv(
            selectedTransactions,
            "selected"
          )
        }
        onBulkDelete={
          requestBulkDelete
        }
        onBulkTag={() =>
          addToast({
            title:
              "Tagging not connected",
            message:
              "Transaction tagging will be added in a later sprint.",
            tone: "info",
            duration: 4000,
          })
        }
      />

      {filtered.length ===
      0 ? (
        <TransactionEmptyState
          filtered={
            hasActiveFilters
          }
          search={
            filters.search
          }
          onResetFilters={
            resetFilters
          }
          onAddTransaction={
            onAddTransaction
          }
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <ProfessionalTransactionTable
              rows={
                paginated.rows
              }
              selectedIds={
                selectedIds
              }
              focusedId={
                focusedId
              }
              sortKey={
                sortKey
              }
              sortDirection={
                sortDirection
              }
              density={
                tablePreferences.density
              }
              columnVisibility={
                tablePreferences.columnVisibility
              }
              columnLayout={
                columnLayout
              }
              onColumnLayoutChange={
                updateColumnLayout
              }
              onSort={
                handleSort
              }
              onToggleRow={
                toggleRow
              }
              onToggleAll={
                toggleAll
              }
              onFocusRow={
                setFocusedId
              }
              onContextMenu={
                openTransactionContextMenu
              }
              onEdit={(transaction) => {
                setDuplicateSourceTransaction(
                  null
                );

                setEditingTransaction(
                  transaction
                );
              }}
              onDelete={
                requestDeleteTransaction
              }
            />
          </div>

          <TransactionMobileCards
            rows={
              paginated.rows
            }
            selectedIds={
              selectedIds
            }
            focusedId={
              focusedId
            }
            onToggleRow={
              toggleRow
            }
            onFocusRow={
              setFocusedId
            }
            onContextMenu={
              openTransactionContextMenu
            }
            onEdit={(transaction) => {
              setDuplicateSourceTransaction(
                null
              );

              setEditingTransaction(
                transaction
              );
            }}
            onDelete={
              requestDeleteTransaction
            }
          />

          <TransactionPagination
            page={page}
            pageSize={
              pageSize
            }
            totalRows={
              sorted.length
            }
            totalPages={
              paginated.totalPages
            }
            start={
              paginated.start
            }
            end={
              paginated.end
            }
            onPageChange={
              setPage
            }
            onPageSizeChange={
              setPageSize
            }
          />
        </>
      )}

      <button
        type="button"
        onClick={() =>
          setKeyboardHelpOpen(
            true
          )
        }
        className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-900"
      >
        Shortcuts:{" "}
        <span className="font-semibold">
          J / K
        </span>{" "}
        navigate,{" "}
        <span className="font-semibold">
          Space
        </span>{" "}
        select,{" "}
        <span className="font-semibold">
          Enter
        </span>{" "}
        edit,{" "}
        <span className="font-semibold">
          Delete
        </span>{" "}
        remove,{" "}
        <span className="font-semibold">
          Ctrl/Cmd + F
        </span>{" "}
        search. Click to view all shortcuts.
      </button>

      <TransactionEditDrawer
        open={Boolean(
          editingTransaction
        )}
        saving={
          savingTransaction
        }
        transaction={
          editingTransaction
        }
        onClose={() => {
          setEditingTransaction(
            null
          );

          setDuplicateSourceTransaction(
            null
          );
        }}
        onSave={
          saveEditedTransaction
        }
      />

      <TransactionContextMenu
        open={Boolean(
          contextMenuTransaction
        )}
        position={
          contextMenuPosition
        }
        transaction={
          contextMenuTransaction
        }
        onClose={
          closeTransactionContextMenu
        }
        onEdit={(transaction) => {
          setDuplicateSourceTransaction(
            null
          );

          setEditingTransaction(
            transaction
          );
        }}
        onDelete={
          requestDeleteTransaction
        }
        onDuplicate={
          duplicateTransaction
        }
        onCopySymbol={
          copyTransactionSymbol
        }
        onCopyRow={
          copyTransactionRow
        }
        onCopyCsv={
          copyTransactionCsv
        }
      />

      <TransactionDeleteDialog
        open={
          pendingDeleteTransactions.length >
          0
        }
        transactions={
          pendingDeleteTransactions
        }
        deleting={
          deletingTransaction
        }
        onCancel={() =>
          setPendingDeleteTransactions(
            []
          )
        }
        onConfirm={() =>
          void confirmDelete()
        }
      />

      <TransactionAdvancedFilters
        open={
          advancedFiltersOpen
        }
        filters={
          filters
        }
        symbols={
          symbols
        }
        onClose={() =>
          setAdvancedFiltersOpen(
            false
          )
        }
        onFiltersChange={
          setFilters
        }
        onReset={
          resetFilters
        }
      />

      <TransactionPresetManager
        open={
          presetManagerOpen
        }
        filters={
          filters
        }
        onClose={() =>
          setPresetManagerOpen(
            false
          )
        }
        onApplyPreset={
          applyPreset
        }
      />

      <TransactionViewSettings
        open={
          viewSettingsOpen
        }
        preferences={
          tablePreferences
        }
        onClose={() =>
          setViewSettingsOpen(
            false
          )
        }
        onChange={
          updateTablePreferences
        }
      />

      <TransactionKeyboardHelp
        open={
          keyboardHelpOpen
        }
        onClose={() =>
          setKeyboardHelpOpen(
            false
          )
        }
      />

      <TransactionOperationHistory
        open={
          historyOpen
        }
        operations={
          operations
        }
        onClose={() =>
          setHistoryOpen(
            false
          )
        }
        onUndo={(
          operation
        ) =>
          void undoOperation(
            operation
          )
        }
      />

      <TransactionQualityPanel
        open={
          qualityOpen
        }
        transactions={
          normalised
        }
        onClose={() =>
          setQualityOpen(
            false
          )
        }
        onOpenTransaction={
          openTransactionById
        }
      />

      <TransactionStickyWorkspaceBar
        visible={
          stickyBarVisible
        }
        filteredCount={
          sorted.length
        }
        totalCount={
          normalised.length
        }
        selectedCount={
          selectedIds.size
        }
        page={page}
        totalPages={
          paginated.totalPages
        }
        density={
          tablePreferences.density
        }
        onFocusSearch={
          focusSearch
        }
        onOpenAdvancedFilters={() =>
          setAdvancedFiltersOpen(
            true
          )
        }
        onOpenViewSettings={() =>
          setViewSettingsOpen(
            true
          )
        }
        onExport={() =>
          exportCsv(
            sorted,
            "filtered"
          )
        }
        onClearSelection={() =>
          setSelectedIds(
            new Set()
          )
        }
        onSelectVisible={
          selectVisible
        }
        onPreviousPage={
          previousPage
        }
        onNextPage={
          nextPage
        }
        onScrollTop={() =>
          window.scrollTo({
            top: 0,
            behavior:
              "smooth",
          })
        }
        onOpenShortcuts={() =>
          setKeyboardHelpOpen(
            true
          )
        }
      />
    </div>
  );
}
