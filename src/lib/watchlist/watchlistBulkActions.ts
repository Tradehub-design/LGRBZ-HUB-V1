import {
  WatchlistSecurity,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

export type WatchlistBulkMode =
  | "MOVE"
  | "COPY"
  | "DELETE"
  | "TAG";

export type WatchlistBulkTagAction =
  | "ADD"
  | "REMOVE"
  | "REPLACE";

export type WatchlistBulkResult = {
  state: WatchlistState;
  affectedCount: number;
  skippedCount: number;
  message: string;
};

export type WatchlistBulkTransferDraft = {
  mode:
    | "MOVE"
    | "COPY";
  targetGroupId: string;
};

export type WatchlistBulkTagDraft = {
  action: WatchlistBulkTagAction;
  tag: string;
};

export function selectedWatchlistSecurities(
  state: WatchlistState,
  selectedIds: Set<string>
) {
  return state.securities.filter(
    (security) =>
      selectedIds.has(
        security.id
      )
  );
}

function uniqueStrings(
  values: string[]
) {
  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            value.trim()
        )
        .filter(Boolean)
    )
  );
}

export function bulkDeleteWatchlistSecurities(
  state: WatchlistState,
  selectedIds: Set<string>
): WatchlistBulkResult {
  const affectedCount =
    state.securities.filter(
      (security) =>
        selectedIds.has(
          security.id
        )
    ).length;

  const securities =
    state.securities.filter(
      (security) =>
        !selectedIds.has(
          security.id
        )
    );

  const groups =
    state.groups.map(
      (group) => ({
        ...group,
        securityIds:
          group.securityIds.filter(
            (securityId) =>
              !selectedIds.has(
                securityId
              )
          ),
        updatedAt:
          new Date().toISOString(),
      })
    );

  return {
    state: {
      ...state,
      securities,
      groups,
      updatedAt:
        new Date().toISOString(),
    },
    affectedCount,
    skippedCount:
      Math.max(
        0,
        selectedIds.size -
          affectedCount
      ),
    message:
      affectedCount === 1
        ? "1 watchlist security deleted."
        : `${affectedCount} watchlist securities deleted.`,
  };
}

export function bulkTransferWatchlistSecurities(
  state: WatchlistState,
  selectedIds: Set<string>,
  draft: WatchlistBulkTransferDraft
): WatchlistBulkResult {
  const target =
    state.groups.find(
      (group) =>
        group.id ===
        draft.targetGroupId
    );

  if (!target) {
    return {
      state,
      affectedCount: 0,
      skippedCount:
        selectedIds.size,
      message:
        "The selected target watchlist could not be found.",
    };
  }

  const validIds =
    state.securities
      .filter(
        (security) =>
          selectedIds.has(
            security.id
          )
      )
      .map(
        (security) =>
          security.id
      );

  const validSet =
    new Set(validIds);

  const groups =
    state.groups.map(
      (group) => {
        if (
          group.id ===
          target.id
        ) {
          return {
            ...group,
            securityIds:
              uniqueStrings([
                ...group.securityIds,
                ...validIds,
              ]),
            updatedAt:
              new Date().toISOString(),
          };
        }

        if (
          draft.mode ===
          "MOVE"
        ) {
          return {
            ...group,
            securityIds:
              group.securityIds.filter(
                (securityId) =>
                  !validSet.has(
                    securityId
                  )
              ),
            updatedAt:
              new Date().toISOString(),
          };
        }

        return group;
      }
    );

  return {
    state: {
      ...state,
      groups,
      updatedAt:
        new Date().toISOString(),
    },
    affectedCount:
      validIds.length,
    skippedCount:
      Math.max(
        0,
        selectedIds.size -
          validIds.length
      ),
    message:
      draft.mode ===
      "MOVE"
        ? `${validIds.length} securit${
            validIds.length === 1
              ? "y"
              : "ies"
          } moved.`
        : `${validIds.length} securit${
            validIds.length === 1
              ? "y"
              : "ies"
          } copied.`,
  };
}

function updateSecurityTags(
  security: WatchlistSecurity,
  draft: WatchlistBulkTagDraft
): WatchlistSecurity {
  const current =
    uniqueStrings(
      security.tags ?? []
    );

  const normalisedTag =
    draft.tag.trim();

  if (!normalisedTag) {
    return security;
  }

  if (
    draft.action ===
    "REPLACE"
  ) {
    return {
      ...security,
      tags: [
        normalisedTag,
      ],
      updatedAt:
        new Date().toISOString(),
    };
  }

  if (
    draft.action ===
    "REMOVE"
  ) {
    return {
      ...security,
      tags:
        current.filter(
          (tag) =>
            tag.toLowerCase() !==
            normalisedTag.toLowerCase()
        ),
      updatedAt:
        new Date().toISOString(),
    };
  }

  return {
    ...security,
    tags:
      uniqueStrings([
        ...current,
        normalisedTag,
      ]),
    updatedAt:
      new Date().toISOString(),
  };
}

export function bulkTagWatchlistSecurities(
  state: WatchlistState,
  selectedIds: Set<string>,
  draft: WatchlistBulkTagDraft
): WatchlistBulkResult {
  let affectedCount = 0;

  const securities =
    state.securities.map(
      (security) => {
        if (
          !selectedIds.has(
            security.id
          )
        ) {
          return security;
        }

        affectedCount += 1;

        return updateSecurityTags(
          security,
          draft
        );
      }
    );

  return {
    state: {
      ...state,
      securities,
      updatedAt:
        new Date().toISOString(),
    },
    affectedCount,
    skippedCount:
      Math.max(
        0,
        selectedIds.size -
          affectedCount
      ),
    message: `${affectedCount} securit${
      affectedCount === 1
        ? "y"
        : "ies"
    } updated.`,
  };
}

export function toggleWatchlistSelection(
  selectedIds: Set<string>,
  securityId: string
) {
  const next =
    new Set(
      selectedIds
    );

  if (
    next.has(
      securityId
    )
  ) {
    next.delete(
      securityId
    );
  } else {
    next.add(
      securityId
    );
  }

  return next;
}

export function selectAllWatchlistSecurities(
  selectedIds: Set<string>,
  securities: WatchlistSecurity[]
) {
  const next =
    new Set(
      selectedIds
    );

  securities.forEach(
    (security) =>
      next.add(
        security.id
      )
  );

  return next;
}

export function clearVisibleWatchlistSelection(
  selectedIds: Set<string>,
  securities: WatchlistSecurity[]
) {
  const next =
    new Set(
      selectedIds
    );

  securities.forEach(
    (security) =>
      next.delete(
        security.id
      )
  );

  return next;
}
