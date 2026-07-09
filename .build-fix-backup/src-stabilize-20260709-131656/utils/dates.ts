export function getFinancialYear(dateInput: string | Date) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return month >= 7 ? `FY${year + 1}` : `FY${year}`;
}

export function getMonthKey(dateInput: string | Date) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getDayKey(dateInput: string | Date) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

export function parseFlexibleDate(value: string) {
  if (!value) return null;

  const cleaned = value.trim().replace("April", "Apr");

  const direct = new Date(cleaned);
  if (!Number.isNaN(direct.getTime())) return direct;

  const match = cleaned.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return null;

  const [, day, monthText, year] = match;

  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month = monthMap[monthText];

  if (month === undefined) return null;

  return new Date(Number(year), month, Number(day));
}
