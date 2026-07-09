"use client";

import { useEffect } from "react";

type KeyboardShortcutOptions = {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  enabled?: boolean;
};

export function useKeyboardShortcut(options: KeyboardShortcutOptions, callback: () => void) {
  const { key, metaKey, ctrlKey, shiftKey, altKey, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();

      const metaMatches = metaKey === undefined || event.metaKey === metaKey;
      const ctrlMatches = ctrlKey === undefined || event.ctrlKey === ctrlKey;
      const shiftMatches = shiftKey === undefined || event.shiftKey === shiftKey;
      const altMatches = altKey === undefined || event.altKey === altKey;

      if (keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches) {
        event.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [altKey, callback, ctrlKey, enabled, key, metaKey, shiftKey]);
}
