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

export const INSPIRATION_HYBRID_WEIGHTS = {
  structure: { semantic: 0.7, affinity: 0.2, usage: 0.1 },
  visual: { semantic: 0.8, affinity: 0.1, usage: 0.1 },
  lowConfidencePenalty: 0.12,
  candidateLimit: 24,
  displayLimit: 6,
} as const;
