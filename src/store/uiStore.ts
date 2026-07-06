"use client";

import { create } from "zustand";

type CommandPaletteState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

type UiState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  commandPalette: CommandPaletteState;
};

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  commandPalette: {
    open: false,
    setOpen: (open) =>
      set((state) => ({
        commandPalette: {
          ...state.commandPalette,
          open,
        },
      })),
    toggle: () =>
      set((state) => ({
        commandPalette: {
          ...state.commandPalette,
          open: !state.commandPalette.open,
        },
      })),
  },
}));
