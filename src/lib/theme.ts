export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "dark";

/** Clave de `usePersistedState` (`mercantis-studio:theme` en localStorage). */
export const THEME_STORAGE_KEY = "theme";

export const THEME_STORAGE_FULL_KEY = `mercantis-studio:${THEME_STORAGE_KEY}`;

export function parseTheme(raw: unknown): Theme | undefined {
  return raw === "light" || raw === "dark" ? raw : undefined;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}
