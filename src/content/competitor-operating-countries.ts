import { COMPETITOR_FILTER_COUNTRIES } from "@/content/competitor-view";

export type MercantisMarket = (typeof COMPETITOR_FILTER_COUNTRIES)[number];

/** Los 16 mercados Mercantis (filtro de país). */
export const ALL_MERCANTIS_MARKETS: readonly MercantisMarket[] =
  COMPETITOR_FILTER_COUNTRIES;

const AR: MercantisMarket = "Argentina";
const BO: MercantisMarket = "Bolivia";
const CL: MercantisMarket = "Chile";
const CO: MercantisMarket = "Colombia";
const CR: MercantisMarket = "Costa Rica";
const EC: MercantisMarket = "Ecuador";
const SV: MercantisMarket = "El Salvador";
const GT: MercantisMarket = "Guatemala";
const HN: MercantisMarket = "Honduras";
const MX: MercantisMarket = "México";
const PA: MercantisMarket = "Panamá";
const PY: MercantisMarket = "Paraguay";
const PE: MercantisMarket = "Perú";
const PR: MercantisMarket = "Puerto Rico";
const DO: MercantisMarket = "República Dominicana";
const UY: MercantisMarket = "Uruguay";

const CENTROAMERICA: readonly MercantisMarket[] = [
  CR,
  SV,
  GT,
  HN,
  PA,
];

/**
 * Países donde opera cada competidor (dentro de los 16 mercados Mercantis).
 * Fuente: sitio oficial, pricing regional, casos de uso y metadata del catálogo.
 */
export const COMPETITOR_OPERATING_COUNTRIES: Partial<
  Record<string, readonly MercantisMarket[]>
> = {
  // —— Argentina / Cono Sur ——
  "minificando-ai": [AR],
  calipso: [AR, CL, PE, CO, MX],
  ventasxmayor: [AR, CL, MX],
  "ecomm-app": [AR],
  mesanube: [AR],
  "ayres-it": [AR],
  fudo: [AR, CL, MX, CO, PE, UY],
  xubio: [AR],
  colppy: [AR],
  "cobrando-app": [AR],
  contabilium: [AR, CL, UY, MX, CO],
  maxirest: [AR, UY, CL, PY],
  niabit: [AR],
  "pedido-simple": [AR],
  "micatalogo-uno": [AR],
  // —— Colombia ——
  bold: [CO],
  vendty: [CO],
  loggro: [CO],
  venddy: [CO],
  cataly: [CO],
  minitienda: [CO],
  mitienda24: [CO],
  mercadily: [CO],
  agencyrime: [CO],

  // —— México / Centroamérica ——
  sicar: [MX],
  aspel: [MX, ...CENTROAMERICA],
  eleventa: [MX],

  // —— Chile ——
  toteat: [CL, MX, CO, PE, AR],

  // —— Perú ——
  key: [PE],

  // —— Brasil / regional LATAM ——
  "redi-rediredi": ALL_MERCANTIS_MARKETS,
  kyte: ALL_MERCANTIS_MARKETS,

  // —— Global / multipaís ——
  loyverse: ALL_MERCANTIS_MARKETS,
  "callbell-shop": ALL_MERCANTIS_MARKETS,
  "sap-business-one": ALL_MERCANTIS_MARKETS,
  "oracle-netsuite": ALL_MERCANTIS_MARKETS,
};

export function getExplicitOperatingCountries(
  competitorId: string,
): readonly MercantisMarket[] | undefined {
  return COMPETITOR_OPERATING_COUNTRIES[competitorId];
}
