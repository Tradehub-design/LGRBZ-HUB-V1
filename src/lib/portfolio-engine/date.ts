const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

export function parseLedgerDate(value: string): string {
  const cleaned = String(value ?? "").trim();

  if (!cleaned) return "";

  const direct = new Date(cleaned);
  if (!Number.isNaN(direct.getTime())) return toIsoDate(direct);

  const match = cleaned.match(/^(\d{1,2})[-/ ]([A-Za-z]+)[-/ ](\d{2,4})$/);

  if (match) {
    const day = Number(match[1]);
    const monthText = match[2].toLowerCase();
    const yearRaw = Number(match[3]);
    const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;
    const month = MONTHS[monthText];

    if (month !== undefined) {
      return toIsoDate(new Date(year, month, day));
    }
  }

  const numeric = cleaned.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);

  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]) - 1;
    const yearRaw = Number(numeric[3]);
    const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;

    return toIsoDate(new Date(year, month, day));
  }

  return "";
}

export function toIsoDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function sortByDateAsc<T extends { date: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.date.localeCompare(b.date));
}
