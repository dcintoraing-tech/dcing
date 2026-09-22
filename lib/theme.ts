"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dcing-theme";

const listeners = new Set<() => void>();
let transitionTimer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function toggleTheme() {
  const root = document.documentElement;

  // Cross-fade colors only while the change is happening.
  root.classList.add("theme-transition");
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => root.classList.remove("theme-transition"), 340);

  setTheme(readTheme() === "dark" ? "light" : "dark");
}

/** Resolves to "light" during SSR and the first client render, then to the real theme. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "light");
}
