import type { RepositoryRecord } from "./types";

const DB_PREFIX = "lgrbz:";

export function saveLocal<T>(
  collection: string,
  record: RepositoryRecord<T>
) {
  localStorage.setItem(
    `${DB_PREFIX}${collection}:${record.id}`,
    JSON.stringify(record)
  );
}

export function getLocal<T>(
  collection: string,
  id: string
): RepositoryRecord<T> | null {
  const raw = localStorage.getItem(
    `${DB_PREFIX}${collection}:${id}`
  );

  if (!raw) return null;

  return JSON.parse(raw);
}

export function getAllLocal<T>(
  collection: string
): RepositoryRecord<T>[] {
  const output: RepositoryRecord<T>[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (!key?.startsWith(`${DB_PREFIX}${collection}:`)) {
      continue;
    }

    const raw = localStorage.getItem(key);

    if (raw) {
      output.push(JSON.parse(raw));
    }
  }

  return output;
}

export function deleteLocal(
  collection: string,
  id: string
) {
  localStorage.removeItem(
    `${DB_PREFIX}${collection}:${id}`
  );
}
