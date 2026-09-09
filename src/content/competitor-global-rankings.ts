/**
 * Ranking global (sep 2026).
 * Poder: 1 = más poder de mercado. Similitud: 1 = más parecido a Mercantis.
 */
export type GlobalCompetitorRanking = {
  id: string;
  name: string;
  marketRank: number;
  similarityRank: number;
};

/** Ordenado por poder de mercado (posición 1 = líder). */
export const GLOBAL_COMPETITOR_RANKINGS: GlobalCompetitorRanking[] = [
  { id: "mercado-libre", name: "Mercado Libre / Mi Página", marketRank: 1, similarityRank: 100 },
  { id: "shopify", name: "Shopify", marketRank: 2, similarityRank: 70 },
  { id: "tiendanube", name: "Tiendanube", marketRank: 3, similarityRank: 16 },
  { id: "woocommerce", name: "WooCommerce", marketRank: 4, similarityRank: 69 },
  { id: "treinta", name: "Treinta", marketRank: 5, similarityRank: 12 },
  { id: "wix", name: "Wix Ecommerce", marketRank: 6, similarityRank: 68 },
  { id: "odoo", name: "Odoo", marketRank: 7, similarityRank: 71 },
  { id: "vtex", name: "VTEX", marketRank: 8, similarityRank: 74 },
  { id: "take-app", name: "Take App", marketRank: 9, similarityRank: 6 },
  { id: "loyverse", name: "Loyverse", marketRank: 10, similarityRank: 73 },
  { id: "siigo", name: "Siigo / Contífico", marketRank: 11, similarityRank: 75 },
  { id: "bold", name: "Bold", marketRank: 12, similarityRank: 13 },
  { id: "sicar", name: "SICAR", marketRank: 13, similarityRank: 72 },
  { id: "jumpseller", name: "Jumpseller", marketRank: 14, similarityRank: 15 },
  { id: "bsale", name: "Bsale", marketRank: 15, similarityRank: 9 },
  { id: "alegra", name: "Alegra", marketRank: 16, similarityRank: 76 },
  { id: "kyte", name: "Kyte", marketRank: 17, similarityRank: 11 },
  { id: "fudo", name: "Fudo", marketRank: 18, similarityRank: 88 },
  { id: "ecwid", name: "Lightspeed Retail / Ecwid", marketRank: 19, similarityRank: 18 },
  { id: "prestashop", name: "PrestaShop", marketRank: 20, similarityRank: 101 },
  { id: "magento", name: "Adobe Commerce / Magento", marketRank: 21, similarityRank: 103 },
  { id: "bigcommerce", name: "BigCommerce", marketRank: 22, similarityRank: 102 },
  { id: "square-online", name: "Square Online", marketRank: 23, similarityRank: 104 },
  { id: "clover", name: "Clover", marketRank: 24, similarityRank: 105 },
  { id: "squarespace", name: "Squarespace Commerce", marketRank: 25, similarityRank: 106 },
  { id: "godaddy-store", name: "GoDaddy Online Store", marketRank: 26, similarityRank: 107 },
  { id: "sap-business-one", name: "SAP Business One", marketRank: 27, similarityRank: 108 },
  { id: "oracle-netsuite", name: "Oracle NetSuite", marketRank: 28, similarityRank: 109 },
  { id: "aspel", name: "Aspel CAJA / ADM", marketRank: 29, similarityRank: 110 },
  { id: "tienda-negocio", name: "Tienda Negocio", marketRank: 30, similarityRank: 7 },
  { id: "xubio", name: "Xubio", marketRank: 31, similarityRank: 78 },
  { id: "defontana", name: "Defontana", marketRank: 32, similarityRank: 83 },
  { id: "fenicio", name: "Fenicio", marketRank: 33, similarityRank: 63 },
  { id: "dux", name: "Dux Software", marketRank: 34, similarityRank: 10 },
  { id: "pedix", name: "Pedix", marketRank: 35, similarityRank: 1 },
  { id: "empretienda", name: "Empretienda", marketRank: 36, similarityRank: 19 },
  { id: "vendty", name: "Vendty", marketRank: 37, similarityRank: 3 },
  { id: "toteat", name: "Toteat", marketRank: 38, similarityRank: 89 },
  { id: "rocketfy", name: "Rocketfy", marketRank: 39, similarityRank: 62 },
  { id: "pency", name: "Pency", marketRank: 40, similarityRank: 8 },
  { id: "colppy", name: "Colppy", marketRank: 41, similarityRank: 79 },
  { id: "eleventa", name: "eleventa", marketRank: 42, similarityRank: 111 },
  { id: "cobrando-app", name: "Cobrando.app", marketRank: 43, similarityRank: 4 },
  { id: "ventasxmayor", name: "VentasxMayor", marketRank: 44, similarityRank: 17 },
  { id: "contabilium", name: "Contabilium", marketRank: 45, similarityRank: 80 },
  { id: "loggro", name: "Loggro", marketRank: 46, similarityRank: 81 },
  { id: "bind-erp", name: "Bind ERP", marketRank: 47, similarityRank: 82 },
  { id: "dragonfish-zoo-logic", name: "Dragonfish / Zoo Logic", marketRank: 48, similarityRank: 85 },
  { id: "tango-software", name: "Tango Gestión", marketRank: 49, similarityRank: 84 },
  { id: "calipso", name: "Calipso", marketRank: 50, similarityRank: 86 },
  { id: "maxirest", name: "Maxirest", marketRank: 51, similarityRank: 90 },
  { id: "ayres-it", name: "Ayres IT", marketRank: 52, similarityRank: 87 },
  { id: "nidux", name: "Nidux", marketRank: 53, similarityRank: 66 },
  { id: "recurrente", name: "Recurrente", marketRank: 54, similarityRank: 91 },
  { id: "tiendy", name: "Tiendy", marketRank: 55, similarityRank: 5 },
  { id: "venddy", name: "Venddy", marketRank: 56, similarityRank: 2 },
  { id: "key", name: "Key", marketRank: 57, similarityRank: 77 },
  { id: "shoperly", name: "Shoperly", marketRank: 58, similarityRank: 20 },
  { id: "mitienda", name: "Mitienda", marketRank: 59, similarityRank: 23 },
  { id: "plenishop", name: "Plenishop", marketRank: 60, similarityRank: 40 },
  { id: "redi-rediredi", name: "RediRedi", marketRank: 61, similarityRank: 60 },
  { id: "callbell-shop", name: "Callbell Shop", marketRank: 62, similarityRank: 61 },
  { id: "tiendu", name: "Tiendu", marketRank: 63, similarityRank: 22 },
  { id: "qpaypro", name: "QPayShop / QPayPro", marketRank: 64, similarityRank: 92 },
  { id: "blume", name: "Blume", marketRank: 65, similarityRank: 59 },
  { id: "wstorecr", name: "WStoreCR", marketRank: 66, similarityRank: 30 },
  { id: "kioskito", name: "Kioskito", marketRank: 67, similarityRank: 28 },
  { id: "digital-shop-py", name: "Digital Shop PY", marketRank: 68, similarityRank: 31 },
  { id: "qtiko", name: "Q'Tiko", marketRank: 69, similarityRank: 29 },
  { id: "cuadra", name: "Cuadra", marketRank: 70, similarityRank: 93 },
  { id: "negocia-pe", name: "Negocia.pe", marketRank: 71, similarityRank: 38 },
  { id: "catalog-pe", name: "Catalog.pe", marketRank: 72, similarityRank: 39 },
  { id: "baggo", name: "Baggo", marketRank: 73, similarityRank: 34 },
  { id: "tiendipy", name: "Tiendipy", marketRank: 74, similarityRank: 35 },
  { id: "comerciaya", name: "Comerciaya", marketRank: 75, similarityRank: 36 },
  { id: "tiendli", name: "Tiendli", marketRank: 76, similarityRank: 21 },
  { id: "pistacho", name: "Pistacho", marketRank: 77, similarityRank: 27 },
  { id: "xcommerce", name: "XCommerce", marketRank: 78, similarityRank: 64 },
  { id: "bootic", name: "Bootic", marketRank: 79, similarityRank: 65 },
  { id: "vexo-os", name: "Vexo OS", marketRank: 80, similarityRank: 94 },
  { id: "vendabo", name: "Vendabo", marketRank: 81, similarityRank: 96 },
  { id: "digimart", name: "Digimart", marketRank: 82, similarityRank: 97 },
  { id: "smart-business-uy", name: "Smart Business", marketRank: 83, similarityRank: 99 },
  { id: "ecomm-app", name: "Ecomm-App", marketRank: 84, similarityRank: 43 },
  { id: "mesanube", name: "Mesanube", marketRank: 85, similarityRank: 44 },
  { id: "lapyme", name: "LaPyme", marketRank: 86, similarityRank: 45 },
  {
    id: "minificando-ai",
    name: "Minificando.ai",
    marketRank: 87,
    similarityRank: 5,
  },
  { id: "changuito", name: "Changuito", marketRank: 88, similarityRank: 26 },
  { id: "niabit", name: "Niabit", marketRank: 89, similarityRank: 24 },
  { id: "cataly", name: "Cataly", marketRank: 90, similarityRank: 14 },
  { id: "minitienda", name: "Minitienda", marketRank: 91, similarityRank: 25 },
  { id: "pedido-simple", name: "PedidoSimple", marketRank: 92, similarityRank: 33 },
  { id: "commercy", name: "Commercy", marketRank: 93, similarityRank: 46 },
  { id: "wendo", name: "Wendo", marketRank: 94, similarityRank: 47 },
  { id: "neolo", name: "Neolo", marketRank: 95, similarityRank: 67 },
  { id: "webtana", name: "Webtana", marketRank: 96, similarityRank: 48 },
  { id: "ecolatam", name: "E-coLATAM", marketRank: 97, similarityRank: 49 },
  { id: "towami", name: "Towami", marketRank: 98, similarityRank: 50 },
  { id: "agilpedido", name: "AgilPedido", marketRank: 99, similarityRank: 51 },
  { id: "mitienda24", name: "MiTienda24", marketRank: 100, similarityRank: 52 },
  { id: "mercadily", name: "Mercadily", marketRank: 101, similarityRank: 54 },
  { id: "agencyrime", name: "AgencyRime", marketRank: 102, similarityRank: 55 },
  { id: "micatalogo-uno", name: "MiCatalogo.uno", marketRank: 103, similarityRank: 41 },
  { id: "wishopai", name: "Wishopai", marketRank: 104, similarityRank: 113 },
  { id: "ucinema", name: "uCinema", marketRank: 105, similarityRank: 114 },
];

const RANKING_BY_ID = new Map(
  GLOBAL_COMPETITOR_RANKINGS.map((entry) => [entry.id, entry]),
);

/** IDs que comparten el ranking global de otro competidor. */
const GLOBAL_RANKING_ALIASES: Record<string, string> = {
  "contifico-siigo": "siigo",
};

function resolveRankingId(competitorId: string): string {
  return GLOBAL_RANKING_ALIASES[competitorId] ?? competitorId;
}

export function getGlobalRanking(
  competitorId: string,
): GlobalCompetitorRanking | undefined {
  return RANKING_BY_ID.get(resolveRankingId(competitorId));
}

export function getGlobalMarketRank(competitorId: string): number | undefined {
  return getGlobalRanking(competitorId)?.marketRank;
}

export function getGlobalSimilarityRank(competitorId: string): number | undefined {
  return getGlobalRanking(competitorId)?.similarityRank;
}

/** Orden global por poder de mercado (posición 1 = líder LATAM). */
export const GLOBAL_MARKET_ORDER = GLOBAL_COMPETITOR_RANKINGS.map((e) => e.id);

/** Orden global por similitud con Mercantis (1 = más parecido). */
export const GLOBAL_SIMILARITY_ORDER = [...GLOBAL_COMPETITOR_RANKINGS]
  .sort((a, b) => a.similarityRank - b.similarityRank)
  .map((e) => e.id);

export const GLOBAL_RANKING_ORDER = GLOBAL_MARKET_ORDER;

export const GLOBAL_RANKING_IDS = new Set(GLOBAL_MARKET_ORDER);
