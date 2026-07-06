export function formatDate(
  date: string,
) {
  if (!date) return "";

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
}

export function formatMonth(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "en-AU",
    {
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
}
