export type CompetitorCountryRanking = {
  /** Poder de mercado en ese país (1–10). Cuota, líderes, relevancia. */
  market?: number;
  /** Similitud con el core de Mercantis en ese país (1–10). */
  similarity?: number;
};

export type CompetitorInspiration = {
  id: string;
  name: string;
  /** Una línea: qué hacen y para quién. */
  summary: string;
  /** País de origen de la empresa. */
  originCountry: string;
  /** Países o regiones donde operan comercialmente. */
  operatingCountries: string[];
  /**
   * Ranking global (1–10). Completar cuando tengamos los valores.
   * Si hay `rankings` por país, ese valor gana al filtrar un mercado.
   */
  marketScore?: number;
  similarityScore?: number;
  /** Ranking por país (ej. `"Argentina": { market: 8, similarity: 6 }`). */
  rankings?: Record<string, CompetitorCountryRanking>;
  instagramUrl?: string;
  websiteUrl?: string;
  tiktokUrl?: string;
  /** Carpeta en assets/competidores/documentos/{documentId}/ — archivo interno, no se muestra en la card. */
  documentId?: string;
  /** Notas internas más largas (opcional). */
  note?: string;
};

export { competitorCatalog as competitorInspirations } from "@/content/competitor-catalog";
