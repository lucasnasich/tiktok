/** Pesos centralizados del matching slot → inspiración. Sin números mágicos sueltos. */
export const INSPIRATION_MATCH_WEIGHTS = {
  base: 10,
  sameFormat: 28,
  formatAffinity: 22,
  pillarAffinity: 20,
  pillarKeyword: 8,
  pillarKeywordCap: 16,
  roleAffinity: 14,
  roleKeyword: 6,
  roleKeywordCap: 12,
  angleAffinity: 8,
  exampleWithFormat: 4,
  suggestionForValueCommunity: 6,
  unusedBonus: 8,
  /** Referencia visual sin afinidades ni formato: no inventar match. */
  unclassifiedVisualPenalty: 12,
  perUsePenalty: 5,
  perUsePenaltyCap: 20,
  recentUsePenalty: 14,
  repeatedAnglePenalty: 6,
  recentUseDays: 7,
} as const;

export type InspirationMatchWeights = typeof INSPIRATION_MATCH_WEIGHTS;
