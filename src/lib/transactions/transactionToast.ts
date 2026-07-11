export type TransactionToastTone =
  | "success"
  | "error"
  | "warning"
  | "info";

export type TransactionToast = {
  id: string;
  title: string;
  message?: string;
  tone: TransactionToastTone;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
};

function createToastId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `transaction-toast-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createTransactionToast(
  toast: Omit<TransactionToast, "id">
): TransactionToast {
  return {
    id: createToastId(),
    duration: 5000,
    ...toast,
  };
}
