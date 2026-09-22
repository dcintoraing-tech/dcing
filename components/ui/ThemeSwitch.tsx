"use client";

import { toggleTheme, useTheme } from "@/lib/theme";

/* Component by zanina-yassine (Uiverse.io) — markup kept as authored. */
export function ThemeSwitch() {
  const isDark = useTheme() === "dark";

  return (
    <div className="theme-switch">
      <div className="container">
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          role="switch"
          checked={isDark}
          onChange={toggleTheme}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        />
        <label className="switch" htmlFor="checkbox">
          <span className="slider" />
        </label>
      </div>
    </div>
  );
}
