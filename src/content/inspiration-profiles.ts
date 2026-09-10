export type InspirationProfile = {
  id: string;
  platform: "Instagram" | "TikTok" | "X" | "YouTube";
  handle: string;
  url: string;
  label: string;
  why: string;
};

/** Cuentas a revisar con frecuencia para ver cómo publican. */
export const inspirationProfiles: InspirationProfile[] = [
  {
    id: "hey-canter",
    platform: "Instagram",
    handle: "hey.canter",
    url: "https://www.instagram.com/hey.canter/",
    label: "Hey Canter",
    why:
      "Referencia clave para SaaS/startups: reels educativos, carruseles de valor (listas, guardá este post) y teasers de producto con identidad visual consistente.",
  },
];
