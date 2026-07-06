import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://picscrub.com";

const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/how-it-works", priority: 0.8 },
  { path: "/faq", priority: 0.8 },
  { path: "/formats", priority: 0.7 },
  { path: "/formats/jpeg", priority: 0.6 },
  { path: "/formats/png", priority: 0.6 },
  { path: "/formats/webp", priority: 0.6 },
  { path: "/formats/gif", priority: 0.6 },
  { path: "/formats/svg", priority: 0.6 },
  { path: "/formats/tiff", priority: 0.6 },
  { path: "/formats/heic", priority: 0.6 },
  { path: "/formats/raw", priority: 0.6 },
  { path: "/privacy", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
