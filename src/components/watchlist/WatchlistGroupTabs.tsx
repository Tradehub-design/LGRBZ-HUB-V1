"use client";

import {
  ChevronDown,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useState,
} from "react";
import {
  WatchlistGroup,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  groups: WatchlistGroup[];
  activeGroupId: string;
  securityCounts: Record<
    string,
    number
  >;
  onChange: (
    groupId: string
  ) => void;
  onCreate: () => void;
  onEdit: (
    group: WatchlistGroup
  ) => void;
  onDelete: (
    group: WatchlistGroup
  ) => void;
};

export function WatchlistGroupTabs({
  groups,
  activeGroupId,
  securityCounts,
  onChange,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const [
    openMenuId,
    setOpenMenuId,
  ] = useState<
    string | null
  >(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {groups.map(
          (group) => {
            const active =
              group.id ===
              activeGroupId;

            return (
              <div
                key={group.id}
                className="relative flex shrink-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      group.id
                    )
                  }
                  className={`flex min-w-[180px] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white shadow-md dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {group.name}
                    </span>

                    <span
                      className={`mt-1 block text-xs ${
                        active
                          ? "text-slate-300 dark:text-slate-600"
                          : "text-slate-500"
                      }`}
                    >
                      {securityCounts[
                        group.id
                      ] ?? 0}{" "}
                      securities
                    </span>
                  </span>

                  <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId(
                      (
                        current
                      ) =>
                        current ===
                        group.id
                          ? null
                          : group.id
                    )
                  }
                  className={`ml-1 rounded-xl border p-2 ${
                    active
                      ? "border-slate-800 bg-slate-900 text-slate-300 hover:text-white dark:border-slate-300 dark:bg-slate-200 dark:text-slate-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  }`}
                  aria-label={`Open ${group.name} options`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {openMenuId ===
                  group.id && (
                  <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(
                          null
                        );

                        onEdit(
                          group
                        );
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      <Pencil className="h-4 w-4" />
                      Rename
                    </button>

                    <button
                      type="button"
                      disabled={
                        group.isDefault
                      }
                      onClick={() => {
                        setOpenMenuId(
                          null
                        );

                        onDelete(
                          group
                        );
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          }
        )}

        <button
          type="button"
          onClick={onCreate}
          className="flex min-w-[170px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <FolderPlus className="h-4 w-4" />
          New Watchlist
        </button>
      </div>
    </section>
  );
}
