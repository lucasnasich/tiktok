export type SocialEmbedKind = "instagram" | "tiktok" | "youtube";

export function isInstagramReelUrl(url: string): boolean {
  try {
    return /\/reels?\//i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

/** Instagram embed.js espera `/reel/`, no `/reels/`. */
export function normalizeSocialEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("instagram.com")) {
      parsed.pathname = parsed.pathname.replace(/\/reels\//i, "/reel/");
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

export function getSocialEmbedKind(url: string): SocialEmbedKind | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");

    if (host.includes("instagram.com")) return "instagram";
    if (host.includes("tiktok.com")) return "tiktok";
    if (host === "youtu.be" || host.includes("youtube.com")) return "youtube";
  } catch {
    return null;
  }

  return null;
}

