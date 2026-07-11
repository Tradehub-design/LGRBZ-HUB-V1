import {
  WatchlistGroup,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

export type WatchlistGroupDraft = {
  name: string;
  description: string;
  colour: string;
};

export type WatchlistGroupValidation = {
  valid: boolean;
  errors: Partial<
    Record<
      keyof WatchlistGroupDraft | "form",
      string
    >
  >;
};

export const defaultWatchlistGroupDraft:
  WatchlistGroupDraft = {
    name: "",
    description: "",
    colour: "slate",
  };

export const watchlistGroupColours = [
  "slate",
  "blue",
  "emerald",
  "amber",
  "rose",
  "violet",
  "cyan",
] as const;

function createGroupId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `watchlist-${crypto.randomUUID()}`;
  }

  return `watchlist-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function validateWatchlistGroupDraft(
  draft: WatchlistGroupDraft,
  groups: WatchlistGroup[],
  editingId?: string | null
): WatchlistGroupValidation {
  const errors:
    WatchlistGroupValidation["errors"] = {};

  const name =
    draft.name.trim();

  if (!name) {
    errors.name =
      "Watchlist name is required.";
  }

  if (name.length > 80) {
    errors.name =
      "Watchlist name must be 80 characters or fewer.";
  }

  const duplicate =
    groups.find(
      (group) =>
        group.id !==
          editingId &&
        group.name
          .trim()
          .toLowerCase() ===
          name.toLowerCase()
    );

  if (duplicate) {
    errors.name =
      "A watchlist with this name already exists.";
  }

  if (
    draft.description.length >
    300
  ) {
    errors.description =
      "Description must be 300 characters or fewer.";
  }

  if (
    !watchlistGroupColours.includes(
      draft.colour as
        (typeof watchlistGroupColours)[number]
    )
  ) {
    errors.colour =
      "Select a supported colour.";
  }

  return {
    valid:
      Object.keys(
        errors
      ).length === 0,
    errors,
  };
}

export function groupToDraft(
  group: WatchlistGroup
): WatchlistGroupDraft {
  return {
    name: group.name,
    description:
      group.description,
    colour:
      group.colour,
  };
}

export function createWatchlistGroup(
  draft: WatchlistGroupDraft
): WatchlistGroup {
  const now =
    new Date().toISOString();

  return {
    id: createGroupId(),
    name:
      draft.name.trim(),
    description:
      draft.description.trim(),
    colour:
      draft.colour,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    securityIds: [],
  };
}

export function updateWatchlistGroup(
  group: WatchlistGroup,
  draft: WatchlistGroupDraft
): WatchlistGroup {
  return {
    ...group,
    name:
      draft.name.trim(),
    description:
      draft.description.trim(),
    colour:
      draft.colour,
    updatedAt:
      new Date().toISOString(),
  };
}

export function addWatchlistGroup(
  state: WatchlistState,
  group: WatchlistGroup
): WatchlistState {
  return {
    ...state,
    groups: [
      ...state.groups,
      group,
    ],
    activeGroupId:
      group.id,
  };
}

export function updateGroupInState(
  state: WatchlistState,
  group: WatchlistGroup
): WatchlistState {
  return {
    ...state,
    groups:
      state.groups.map(
        (entry) =>
          entry.id === group.id
            ? group
            : entry
      ),
  };
}

export function deleteWatchlistGroup(
  state: WatchlistState,
  groupId: string
): WatchlistState {
  const group =
    state.groups.find(
      (entry) =>
        entry.id === groupId
    );

  if (!group) {
    return state;
  }

  if (group.isDefault) {
    throw new Error(
      "The default watchlist cannot be deleted."
    );
  }

  if (
    state.groups.length <= 1
  ) {
    throw new Error(
      "At least one watchlist must remain."
    );
  }

  const groups =
    state.groups.filter(
      (entry) =>
        entry.id !== groupId
    );

  const activeGroupId =
    state.activeGroupId ===
    groupId
      ? groups[0].id
      : state.activeGroupId;

  return {
    ...state,
    groups,
    activeGroupId,
  };
}

export function setActiveWatchlistGroup(
  state: WatchlistState,
  groupId: string
): WatchlistState {
  if (
    !state.groups.some(
      (group) =>
        group.id === groupId
    )
  ) {
    return state;
  }

  return {
    ...state,
    activeGroupId:
      groupId,
  };
}

export function copySecurityToGroup(
  state: WatchlistState,
  securityId: string,
  targetGroupId: string
): WatchlistState {
  return {
    ...state,
    groups:
      state.groups.map(
        (group) =>
          group.id ===
          targetGroupId
            ? {
                ...group,
                securityIds:
                  group.securityIds.includes(
                    securityId
                  )
                    ? group.securityIds
                    : [
                        ...group.securityIds,
                        securityId,
                      ],
                updatedAt:
                  new Date().toISOString(),
              }
            : group
      ),
  };
}

export function moveSecurityToGroup(
  state: WatchlistState,
  securityId: string,
  sourceGroupId: string,
  targetGroupId: string
): WatchlistState {
  if (
    sourceGroupId ===
    targetGroupId
  ) {
    return state;
  }

  return {
    ...state,
    groups:
      state.groups.map(
        (group) => {
          if (
            group.id ===
            sourceGroupId
          ) {
            return {
              ...group,
              securityIds:
                group.securityIds.filter(
                  (id) =>
                    id !==
                    securityId
                ),
              updatedAt:
                new Date().toISOString(),
            };
          }

          if (
            group.id ===
            targetGroupId
          ) {
            return {
              ...group,
              securityIds:
                group.securityIds.includes(
                  securityId
                )
                  ? group.securityIds
                  : [
                      ...group.securityIds,
                      securityId,
                    ],
              updatedAt:
                new Date().toISOString(),
            };
          }

          return group;
        }
      ),
  };
}
