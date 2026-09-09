import type { InspirationMediaSlide } from "@/content/inspiration-links";
import { inspirationMedia } from "@/content/inspiration-media";

export type OrganicPlatform = "TikTok" | "Instagram" | "YouTube";

export type OrganicPostInspiration = {
  id: string;
  kind: "post";
  platform: OrganicPlatform;
  url: string;
  title: string;
  previewImage?: string;
  media?: InspirationMediaSlide[];
  note?: string;
};

export type OrganicCommentInspiration = {
  id: string;
  kind: "comment";
  platform: OrganicPlatform;
  text: string;
  postUrl: string;
};

export type OrganicInspiration = OrganicPostInspiration | OrganicCommentInspiration;

export const organicInspirations: OrganicInspiration[] = [
  {
    id: "tt-7659480267479993621",
    kind: "post",
    platform: "TikTok",
    url: "https://www.tiktok.com/@juanbadal/video/7659480267479993621",
    title: "Cómo minificamos las redes de Minificando",
    media: inspirationMedia["tt-7659480267479993621"],
    note: "Video largo (~3 min) de @juanbadal. Referencia de formato talking head y narrativa sobre simplificar redes.",
  },
  {
    id: "tt-7630167547035340053",
    kind: "post",
    platform: "TikTok",
    url: "https://www.tiktok.com/@franco.zanolin/photo/7630167547035340053?_r=1&_t=ZS-99am7s0Ghev",
    title: "9 apps para construir startup con IA",
    media: inspirationMedia["tt-7630167547035340053"],
    note: "Guardado para revisar hook, ritmo y formato.",
  },
  {
    id: "post-planilla-caos",
    kind: "post",
    platform: "TikTok",
    url: "https://www.tiktok.com/@ejemplo/video/0000000000000000000",
    title: "Carrusel: el caos de manejar stock en planilla",
    note: "Hook de pregunta + slide de consecuencia. Buen ritmo.",
  },
  {
    id: "post-whatsapp-duplicado",
    kind: "post",
    platform: "Instagram",
    url: "https://www.instagram.com/reel/ejemplo/",
    title: "Reel: respondiendo lo mismo 20 veces por WhatsApp",
    note: "Formato talking head, CTA suave al final.",
  },
  {
    id: "comment-precio-planilla",
    kind: "comment",
    platform: "TikTok",
    text: "Yo sigo con Excel y Google Sheets, ¿realmente vale la pena pagar otra herramienta?",
    postUrl: "https://www.tiktok.com/@competidor/video/0000000000000000001",
  },
  {
    id: "comment-sistema-unico",
    kind: "comment",
    platform: "Instagram",
    text: "Necesito algo que una pedidos y stock, no otra app más suelta.",
    postUrl: "https://www.instagram.com/reel/ejemplo-competidor/",
  },
];
