"use client";

import {
  Clipboard,
  Copy,
  FileText,
  Pencil,
  PlusSquare,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
} from "react";
import {
  NormalisedTransaction,
} from "@/lib/transactions/professionalTransactions";

export type TransactionContextMenuPosition = {
  x: number;
  y: number;
};

type Props = {
  open: boolean;
  position: TransactionContextMenuPosition;
  transaction: NormalisedTransaction | null;
  onClose: () => void;
  onEdit: (
    transaction: NormalisedTransaction
  ) => void;
  onDelete: (
    transaction: NormalisedTransaction
  ) => void;
  onDuplicate: (
    transaction: NormalisedTransaction
  ) => void;
  onCopySymbol: (
    transaction: NormalisedTransaction
  ) => void;
  onCopyRow: (
    transaction: NormalisedTransaction
  ) => void;
  onCopyCsv: (
    transaction: NormalisedTransaction
  ) => void;
};

type MenuButtonProps = {
  icon: typeof Copy;
  label: string;
  danger?: boolean;
  onClick: () => void;
};

function MenuButton({
  icon: Icon,
  label,
  danger = false,
  onClick,
}: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}

export function TransactionContextMenu({
  open,
  position,
  transaction,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onCopySymbol,
  onCopyRow,
  onCopyCsv,
}: Props) {
  const menuRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    };

    const onKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    };

    const onScroll = () => {
      onClose();
    };

    window.addEventListener(
      "mousedown",
      onPointerDown
    );

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    window.addEventListener(
      "scroll",
      onScroll,
      true
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        onPointerDown
      );

      window.removeEventListener(
        "keydown",
        onKeyDown
      );

      window.removeEventListener(
        "scroll",
        onScroll,
        true
      );
    };
  }, [open, onClose]);

  useEffect(() => {
    if (
      !open ||
      !menuRef.current
    ) {
      return;
    }

    const menu =
      menuRef.current;

    const bounds =
      menu.getBoundingClientRect();

    const safeX = Math.max(
      12,
      Math.min(
        position.x,
        window.innerWidth -
          bounds.width -
          12
      )
    );

    const safeY = Math.max(
      12,
      Math.min(
        position.y,
        window.innerHeight -
          bounds.height -
          12
      )
    );

    menu.style.left =
      `${safeX}px`;

    menu.style.top =
      `${safeY}px`;

    menu.focus();
  }, [
    open,
    position.x,
    position.y,
  ]);

  if (
    !open ||
    !transaction
  ) {
    return null;
  }

  const run = (
    action: () => void
  ) => {
    action();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      tabIndex={-1}
      role="menu"
      aria-label={`Actions for ${transaction.symbol}`}
      className="fixed z-[110] w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-950"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-3 pb-2 pt-1 dark:border-slate-900">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
            {transaction.symbol}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {transaction.type} ·{" "}
            {transaction.date}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          aria-label="Close transaction menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 space-y-1">
        <MenuButton
          icon={Pencil}
          label="Edit transaction"
          onClick={() =>
            run(() =>
              onEdit(
                transaction
              )
            )
          }
        />

        <MenuButton
          icon={PlusSquare}
          label="Duplicate transaction"
          onClick={() =>
            run(() =>
              onDuplicate(
                transaction
              )
            )
          }
        />
      </div>

      <div className="my-2 border-t border-slate-100 dark:border-slate-900" />

      <div className="space-y-1">
        <MenuButton
          icon={Copy}
          label="Copy symbol"
          onClick={() =>
            run(() =>
              onCopySymbol(
                transaction
              )
            )
          }
        />

        <MenuButton
          icon={Clipboard}
          label="Copy transaction details"
          onClick={() =>
            run(() =>
              onCopyRow(
                transaction
              )
            )
          }
        />

        <MenuButton
          icon={FileText}
          label="Copy as CSV"
          onClick={() =>
            run(() =>
              onCopyCsv(
                transaction
              )
            )
          }
        />
      </div>

      <div className="my-2 border-t border-slate-100 dark:border-slate-900" />

      <MenuButton
        icon={Trash2}
        label="Delete transaction"
        danger
        onClick={() =>
          run(() =>
            onDelete(
              transaction
            )
          )
        }
      />
    </div>
  );
}
