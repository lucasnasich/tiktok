/** Reparte 100 entre entradas con peso relativo; ignora claves con peso 0. */
export function normalizePercentTargets<T extends string>(
  weights: Record<T, number>,
): Record<T, number> {
  const entries = Object.entries(weights).filter(
    ([, value]) => (value as number) > 0,
  ) as [T, number][];

  if (entries.length === 0) return weights;

  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (total === 0) return weights;

  const normalized = {} as Record<T, number>;
  let assigned = 0;

  entries.forEach(([key, value], index) => {
    if (index === entries.length - 1) {
      normalized[key] = 100 - assigned;
    } else {
      const pct = Math.round((value / total) * 100);
      normalized[key] = pct;
      assigned += pct;
    }
  });

  return normalized;
}

export function sumPercentTargets(targets: Record<string, number>): number {
  return Object.values(targets).reduce((sum, value) => sum + value, 0);
}
