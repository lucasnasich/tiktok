/** Banderas por nombre de país (español). */
const COUNTRY_FLAGS: Record<string, string> = {
  Argentina: "🇦🇷",
  Australia: "🇦🇺",
  Bélgica: "🇧🇪",
  Bolivia: "🇧🇴",
  Brasil: "🇧🇷",
  Canadá: "🇨🇦",
  Chile: "🇨🇱",
  Colombia: "🇨🇴",
  "Costa Rica": "🇨🇷",
  Ecuador: "🇪🇨",
  "El Salvador": "🇸🇻",
  España: "🇪🇸",
  "Estados Unidos": "🇺🇸",
  Alemania: "🇩🇪",
  Francia: "🇫🇷",
  Guatemala: "🇬🇹",
  Honduras: "🇭🇳",
  Israel: "🇮🇱",
  México: "🇲🇽",
  Nicaragua: "🇳🇮",
  Panamá: "🇵🇦",
  Paraguay: "🇵🇾",
  Perú: "🇵🇪",
  Portugal: "🇵🇹",
  "Puerto Rico": "🇵🇷",
  "República Dominicana": "🇩🇴",
  Singapur: "🇸🇬",
  Uruguay: "🇺🇾",
  Venezuela: "🇻🇪",
};

const REGION_FLAGS: Record<string, string> = {
  Centroamérica: "🌎",
  Internacional: "🌎",
  Latinoamérica: "🌎",
  Región: "🌎",
};

export function getCountryFlag(countryId: string): string | null {
  return COUNTRY_FLAGS[countryId] ?? REGION_FLAGS[countryId] ?? null;
}

export function formatCountryFlag(country: string): string {
  if (/\d+\s*países/i.test(country)) return "🌎";
  return getCountryFlag(country) ?? "🌐";
}

export function formatCountryFlags(countries: string[]): string {
  const flags: string[] = [];
  const seen = new Set<string>();

  for (const country of countries) {
    const flag = formatCountryFlag(country);
    if (seen.has(flag)) continue;
    seen.add(flag);
    flags.push(flag);
  }

  return flags.join(" ");
}
