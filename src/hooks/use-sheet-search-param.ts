import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/** Deep link de sheet: setea el param, cerrar lo limpia, back/forward del browser funciona. */
export function useSheetSearchParam(key: string) {
  const [params, setParams] = useSearchParams();
  const value = params.get(key);

  const setValue = useCallback(
    (next: string | null) => {
      const copy = new URLSearchParams(params);
      if (next) copy.set(key, next);
      else copy.delete(key);
      setParams(copy, { replace: false });
    },
    [key, params, setParams],
  );

  return [value, setValue] as const;
}
