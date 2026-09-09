import { imagePrompts } from "@/content/image-prompts";

export type Asset = {
  src: string;
  name: string;
  prompt: string | null;
};

const modules = import.meta.glob("../../assets/**/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const assets: Asset[] = Object.entries(modules)
  .map(([path, src]) => {
    const name = path.split("/").at(-1) ?? path;
    return {
      src,
      name,
      prompt: imagePrompts[name] ?? null,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "es"));
