import { NormalisedTransaction } from "@/lib/transactions/professionalTransactions";

export type TransactionKeyboardCommand =
  | "MOVE_UP"
  | "MOVE_DOWN"
  | "MOVE_FIRST"
  | "MOVE_LAST"
  | "TOGGLE_SELECTED"
  | "EDIT"
  | "DELETE"
  | "SELECT_ALL_VISIBLE"
  | "CLEAR_SELECTION"
  | "NEXT_PAGE"
  | "PREVIOUS_PAGE"
  | "FOCUS_SEARCH"
  | "OPEN_ADVANCED_FILTERS"
  | "OPEN_SAVED_VIEWS"
  | "OPEN_COLUMN_SETTINGS"
  | "EXPORT"
  | null;

export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

export function resolveTransactionKeyboardCommand(
  event: KeyboardEvent
): TransactionKeyboardCommand {
  const key = event.key.toLowerCase();
  const modifier = event.ctrlKey || event.metaKey;

  if (modifier && !event.shiftKey && key === "f") {
    return "FOCUS_SEARCH";
  }

  if (modifier && event.shiftKey && key === "f") {
    return "OPEN_ADVANCED_FILTERS";
  }

  if (modifier && event.shiftKey && key === "s") {
    return "OPEN_SAVED_VIEWS";
  }

  if (modifier && event.shiftKey && key === "c") {
    return "OPEN_COLUMN_SETTINGS";
  }

  if (modifier && !event.shiftKey && key === "e") {
    return "EXPORT";
  }

  if (modifier && !event.shiftKey && key === "a") {
    return "SELECT_ALL_VISIBLE";
  }

  if (key === "arrowup" || key === "k") {
    return "MOVE_UP";
  }

  if (key === "arrowdown" || key === "j") {
    return "MOVE_DOWN";
  }

  if (key === "home") {
    return "MOVE_FIRST";
  }

  if (key === "end") {
    return "MOVE_LAST";
  }

  if (key === " " || key === "spacebar") {
    return "TOGGLE_SELECTED";
  }

  if (key === "enter") {
    return "EDIT";
  }

  if (key === "delete" || key === "backspace") {
    return "DELETE";
  }

  if (key === "pagedown") {
    return "NEXT_PAGE";
  }

  if (key === "pageup") {
    return "PREVIOUS_PAGE";
  }

  if (key === "escape") {
    return "CLEAR_SELECTION";
  }

  return null;
}

export function findNextFocusedTransactionId(
  rows: NormalisedTransaction[],
  currentId: string | null,
  command:
    | "MOVE_UP"
    | "MOVE_DOWN"
    | "MOVE_FIRST"
    | "MOVE_LAST"
) {
  if (rows.length === 0) return null;

  if (command === "MOVE_FIRST") {
    return rows[0].id;
  }

  if (command === "MOVE_LAST") {
    return rows[rows.length - 1].id;
  }

  const currentIndex = currentId
    ? rows.findIndex((row) => row.id === currentId)
    : -1;

  if (command === "MOVE_DOWN") {
    if (currentIndex < 0) return rows[0].id;
    return rows[Math.min(rows.length - 1, currentIndex + 1)].id;
  }

  if (currentIndex < 0) return rows[rows.length - 1].id;
  return rows[Math.max(0, currentIndex - 1)].id;
}
