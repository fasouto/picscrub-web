import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PicScrub - Strip Metadata from Images",
    short_name: "PicScrub",
    description:
      "Privacy-first image metadata removal. Strip EXIF, GPS, XMP, IPTC, and other sensitive data from your images. 100% client-side.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfa",
    theme_color: "#fbfbfa",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
