import { useCallback, useState } from "react";

const STORAGE_PREFIX = "mercantis-studio:";

function readStorage<T>(
  key: string,
  defaultValue: T,
  parse?: (raw: unknown) => T | undefined,
): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw === null) return defaultValue;
    const parsed = JSON.parse(raw) as unknown;
    if (parse) {
      const validated = parse(parsed);
      if (validated !== undefined) return validated;
      return defaultValue;
    }
    return parsed as T;
  } catch {
    return defaultValue;
  }
}

/** Estado de UI que persiste en localStorage entre sesiones y pantallas. */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  parse?: (raw: unknown) => T | undefined,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(() =>
    readStorage(key, defaultValue, parse),
  );

  const setPersisted = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        const value =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(
            `${STORAGE_PREFIX}${key}`,
            JSON.stringify(value),
          );
        } catch {
          // quota / private mode
        }
        return value;
      });
    },
    [key],
  );

  return [state, setPersisted];
}
