"use client";

import {
  ArrowDownUp,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  MouseEvent as ReactMouseEvent,
  useMemo,
  useState,
} from "react";
import {
  formatMoney,
  formatNumber,
  NormalisedTransaction,
  TransactionSortKey,
} from "@/lib/transactions/professionalTransactions";
import {
  clampTransactionColumnWidth,
  TransactionColumnLayout,
} from "@/lib/transactions/transactionColumnLayout";
import {
  TransactionColumnKey,
  TransactionColumnVisibility,
  TransactionDensity,
} from "@/lib/transactions/transactionTablePreferences";

type Props = {
  rows: NormalisedTransaction[];
  selectedIds: Set<string>;
  focusedId: string | null;
  sortKey: TransactionSortKey;
  sortDirection: "asc" | "desc";
  density: TransactionDensity;
  columnVisibility: TransactionColumnVisibility;
  columnLayout: TransactionColumnLayout;
  onColumnLayoutChange: (
    layout: TransactionColumnLayout
  ) => void;
  onSort: (
    key: TransactionSortKey
  ) => void;
  onToggleRow: (
    id: string
  ) => void;
  onToggleAll: () => void;
  onFocusRow: (
    id: string
  ) => void;
  onContextMenu?: (
    event: ReactMouseEvent<HTMLTableRowElement>,
    row: NormalisedTransaction
  ) => void;
  onEdit: (
    row: NormalisedTransaction
  ) => void;
  onDelete: (
    row: NormalisedTransaction
  ) => void;
};

type ColumnDefinition = {
  key: TransactionColumnKey;
  label: string;
  align?: "left" | "right";
  sortable?: TransactionSortKey;
};

const columnDefinitions:
  Record<
    TransactionColumnKey,
    ColumnDefinition
  > = {
    date: {
      key: "date",
      label: "Date",
      sortable: "date",
    },
    symbol: {
      key: "symbol",
      label: "Symbol",
      sortable: "symbol",
    },
    type: {
      key: "type",
      label: "Type",
      sortable: "type",
    },
    quantity: {
      key: "quantity",
      label: "Qty",
      align: "right",
      sortable: "quantity",
    },
    price: {
      key: "price",
      label: "Price",
      align: "right",
      sortable: "price",
    },
    fees: {
      key: "fees",
      label: "Fees",
      align: "right",
      sortable: "fees",
    },
    total: {
      key: "total",
      label: "Total",
      align: "right",
      sortable: "total",
    },
    broker: {
      key: "broker",
      label: "Broker",
    },
    actions: {
      key: "actions",
      label: "Actions",
      align: "right",
    },
  };

export function ProfessionalTransactionTable({
  rows,
  selectedIds,
  focusedId,
  sortKey,
  sortDirection,
  density,
  columnVisibility,
  columnLayout,
  onColumnLayoutChange,
  onSort,
  onToggleRow,
  onToggleAll,
  onFocusRow,
  onContextMenu,
  onEdit,
  onDelete,
}: Props) {
  const [
    resizingColumn,
    setResizingColumn,
  ] =
    useState<TransactionColumnKey | null>(
      null
    );

  const allSelected =
    rows.length > 0 &&
    rows.every((row) =>
      selectedIds.has(
        row.id
      )
    );

  const someSelected =
    rows.some((row) =>
      selectedIds.has(
        row.id
      )
    ) &&
    !allSelected;

  const rowPadding =
    density === "compact"
      ? "px-3 py-2"
      : "px-4 py-3";

  const headerPadding =
    density === "compact"
      ? "px-3 py-2.5"
      : "px-4 py-3";

  const visibleColumns =
    useMemo(
      () =>
        columnLayout.order.filter(
          (key) =>
            columnVisibility[
              key
            ]
        ),
      [
        columnLayout.order,
        columnVisibility,
      ]
    );

  const selectionWidth = 48;

  const symbolBefore =
    visibleColumns.filter(
      (key) =>
        key !== "symbol"
    );

  const symbolIndex =
    visibleColumns.indexOf(
      "symbol"
    );

  const columnsBeforeSymbol =
    symbolIndex < 0
      ? []
      : visibleColumns.slice(
          0,
          symbolIndex
        );

  const symbolLeft =
    selectionWidth +
    columnsBeforeSymbol.reduce(
      (
        sum,
        key
      ) =>
        sum +
        Number(
          columnLayout.widths[
            key
          ] ?? 120
        ),
      0
    );

  void symbolBefore;

  const beginResize = (
    event: ReactMouseEvent,
    key: TransactionColumnKey
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const startX =
      event.clientX;

    const startWidth =
      Number(
        columnLayout.widths[
          key
        ] ?? 120
      );

    setResizingColumn(
      key
    );

    const onMove = (
      moveEvent: MouseEvent
    ) => {
      const nextWidth =
        clampTransactionColumnWidth(
          key,
          startWidth +
            moveEvent.clientX -
            startX
        );

      onColumnLayoutChange({
        ...columnLayout,
        widths: {
          ...columnLayout.widths,
          [key]:
            nextWidth,
        },
      });
    };

    const onUp = () => {
      setResizingColumn(
        null
      );

      window.removeEventListener(
        "mousemove",
        onMove
      );

      window.removeEventListener(
        "mouseup",
        onUp
      );
    };

    window.addEventListener(
      "mousemove",
      onMove
    );

    window.addEventListener(
      "mouseup",
      onUp
    );
  };

  const stickySelectionClass =
    columnLayout.freezeSelection
      ? "sticky left-0 z-20 bg-inherit"
      : "";

  const stickySymbolStyle =
    columnLayout.freezeSymbol &&
    visibleColumns.includes(
      "symbol"
    )
      ? {
          position:
            "sticky" as const,
          left:
            symbolLeft,
          zIndex: 15,
        }
      : undefined;

  const renderHeader = (
    key: TransactionColumnKey
  ) => {
    const definition =
      columnDefinitions[
        key
      ];

    const sortable =
      definition.sortable;

    const width =
      Number(
        columnLayout.widths[
          key
        ] ?? 120
      );

    return (
      <th
        key={key}
        style={{
          width,
          minWidth: width,
          maxWidth: width,
          ...(key ===
          "symbol"
            ? stickySymbolStyle
            : {}),
        }}
        className={`relative border-b border-slate-200 bg-slate-50 ${headerPadding} font-semibold dark:border-slate-800 dark:bg-slate-900 ${
          definition.align ===
          "right"
            ? "text-right"
            : "text-left"
        }`}
      >
        {sortable ? (
          <button
            type="button"
            onClick={() =>
              onSort(
                sortable
              )
            }
            className={`inline-flex items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
              definition.align ===
              "right"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {definition.label}

            <ArrowDownUp className="h-3 w-3 opacity-60" />

            {sortKey ===
              sortable && (
              <span className="text-[10px] normal-case text-slate-400">
                {sortDirection}
              </span>
            )}
          </button>
        ) : (
          <span>
            {definition.label}
          </span>
        )}

        <button
          type="button"
          aria-label={`Resize ${definition.label} column`}
          onMouseDown={(
            event
          ) =>
            beginResize(
              event,
              key
            )
          }
          className={`absolute right-0 top-0 flex h-full w-3 cursor-col-resize items-center justify-center text-slate-300 hover:bg-slate-200 hover:text-slate-500 dark:text-slate-700 dark:hover:bg-slate-800 ${
            resizingColumn ===
            key
              ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              : ""
          }`}
        >
          <GripVertical className="h-3 w-3" />
        </button>
      </th>
    );
  };

  const renderCell = (
    key: TransactionColumnKey,
    row: NormalisedTransaction
  ) => {
    const width =
      Number(
        columnLayout.widths[
          key
        ] ?? 120
      );

    const baseProps = {
      style: {
        width,
        minWidth: width,
        maxWidth: width,
        ...(key ===
        "symbol"
          ? stickySymbolStyle
          : {}),
      },
      className: `border-b border-slate-100 bg-inherit ${rowPadding} dark:border-slate-900`,
    };

    if (
      key === "date"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
          className={`${baseProps.className} text-slate-700 dark:text-slate-300`}
        >
          {row.date}
        </td>
      );
    }

    if (
      key === "symbol"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950 dark:text-slate-50">
              {row.symbol}
            </p>

            {row.name &&
              density !==
                "compact" && (
                <p className="truncate text-xs text-slate-500">
                  {row.name}
                </p>
              )}
          </div>
        </td>
      );
    }

    if (
      key === "type"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
        >
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {row.type}
          </span>
        </td>
      );
    }

    if (
      key ===
      "quantity"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
          className={`${baseProps.className} text-right tabular-nums`}
        >
          {formatNumber(
            row.quantity,
            4
          )}
        </td>
      );
    }

    if (
      key === "price"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
          className={`${baseProps.className} text-right tabular-nums`}
        >
          {formatMoney(
            row.price,
            row.currency
          )}
        </td>
      );
    }

    if (
      key === "fees"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
          className={`${baseProps.className} text-right tabular-nums`}
        >
          {formatMoney(
            row.fees,
            row.currency
          )}
        </td>
      );
    }

    if (
      key === "total"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
          className={`${baseProps.className} text-right font-semibold tabular-nums`}
        >
          {formatMoney(
            row.total,
            row.currency
          )}
        </td>
      );
    }

    if (
      key === "broker"
    ) {
      return (
        <td
          key={key}
          {...baseProps}
          className={`${baseProps.className} truncate text-slate-600 dark:text-slate-300`}
        >
          {row.broker ||
            "—"}
        </td>
      );
    }

    return (
      <td
        key={key}
        {...baseProps}
        className={`${baseProps.className} text-right`}
      >
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={(
              event
            ) => {
              event.stopPropagation();
              onEdit(row);
            }}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 outline-none hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:hover:text-white"
            aria-label={`Edit ${row.symbol}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={(
              event
            ) => {
              event.stopPropagation();
              onDelete(
                row
              );
            }}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 outline-none hover:border-red-200 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 dark:border-slate-800"
            aria-label={`Delete ${row.symbol}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    );
  };

  const totalWidth =
    selectionWidth +
    visibleColumns.reduce(
      (
        sum,
        key
      ) =>
        sum +
        Number(
          columnLayout.widths[
            key
          ] ?? 120
        ),
      0
    );

  return (
    <div
      id="professional-transactions-table"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="max-h-[68vh] overflow-auto">
        <table
          className="border-separate border-spacing-0 text-sm"
          style={{
            width:
              totalWidth,
            minWidth:
              "100%",
          }}
        >
          <thead className="sticky top-0 z-30 text-xs uppercase tracking-wide text-slate-500 shadow-sm dark:text-slate-400">
            <tr>
              <th
                style={{
                  width:
                    selectionWidth,
                  minWidth:
                    selectionWidth,
                  maxWidth:
                    selectionWidth,
                }}
                className={`border-b border-slate-200 bg-slate-50 ${headerPadding} dark:border-slate-800 dark:bg-slate-900 ${stickySelectionClass}`}
              >
                <input
                  type="checkbox"
                  checked={
                    allSelected
                  }
                  ref={(
                    element
                  ) => {
                    if (
                      element
                    ) {
                      element.indeterminate =
                        someSelected;
                    }
                  }}
                  onChange={
                    onToggleAll
                  }
                  className="h-4 w-4 rounded border-slate-300"
                  aria-label="Select all visible transactions"
                />
              </th>

              {visibleColumns.map(
                renderHeader
              )}
            </tr>
          </thead>

          <tbody>
            {rows.length ===
            0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    1
                  }
                  className="px-4 py-16 text-center text-slate-500"
                >
                  No transactions match the current filters.
                </td>
              </tr>
            ) : (
              rows.map(
                (row) => {
                  const isFocused =
                    focusedId ===
                    row.id;

                  const isSelected =
                    selectedIds.has(
                      row.id
                    );

                  return (
                    <tr
                      key={
                        row.id
                      }
                      id={`transaction-row-${row.id}`}
                      tabIndex={
                        isFocused
                          ? 0
                          : -1
                      }
                      onClick={() =>
                        onFocusRow(
                          row.id
                        )
                      }
                      onFocus={() =>
                        onFocusRow(
                          row.id
                        )
                      }
                      onContextMenu={(
                        event
                      ) => {
                        onFocusRow(
                          row.id
                        );

                        onContextMenu?.(
                          event,
                          row
                        );
                      }}
                      className={`group cursor-default outline-none transition ${
                        isFocused
                          ? "bg-blue-50 ring-2 ring-inset ring-blue-500 dark:bg-blue-950/30"
                          : isSelected
                            ? "bg-slate-100/80 dark:bg-slate-900"
                            : "bg-white hover:bg-slate-50/80 dark:bg-slate-950 dark:hover:bg-slate-900/70"
                      }`}
                      aria-selected={
                        isSelected
                      }
                    >
                      <td
                        style={{
                          width:
                            selectionWidth,
                          minWidth:
                            selectionWidth,
                          maxWidth:
                            selectionWidth,
                        }}
                        className={`border-b border-slate-100 bg-inherit ${rowPadding} dark:border-slate-900 ${stickySelectionClass}`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            isSelected
                          }
                          onClick={(
                            event
                          ) =>
                            event.stopPropagation()
                          }
                          onChange={() =>
                            onToggleRow(
                              row.id
                            )
                          }
                          className="h-4 w-4 rounded border-slate-300"
                          aria-label={`Select ${row.symbol} transaction`}
                        />
                      </td>

                      {visibleColumns.map(
                        (
                          key
                        ) =>
                          renderCell(
                            key,
                            row
                          )
                      )}
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
