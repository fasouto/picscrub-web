import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Caveat } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PicScrub - Strip Metadata from Images",
  description:
    "Privacy-first image metadata removal. Strip EXIF, GPS, XMP, IPTC, and other sensitive data from your images. 100% client-side, lossless, supports 9 formats.",
  keywords: [
    "image metadata",
    "EXIF remover",
    "privacy",
    "strip metadata",
    "GPS removal",
    "image privacy",
    "JPEG",
    "PNG",
    "WebP",
  ],
  authors: [{ name: "PicScrub" }],
  openGraph: {
    title: "PicScrub - Strip Metadata from Images",
    description:
      "Privacy-first image metadata removal. Strip EXIF, GPS, XMP, IPTC, and other sensitive data from your images.",
    url: "https://picscrub.com",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PicScrub",
  url: "https://picscrub.com",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web, Windows, macOS, Linux",
  description:
    "Privacy-first image metadata removal. Strip EXIF, GPS, XMP, IPTC, and other sensitive data from your images. 100% client-side, lossless, supports 9 formats.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList:
    "Strip EXIF data, Remove GPS location, Remove camera info, Remove timestamps, 100% client-side processing, Supports JPEG, PNG, WebP, HEIC, GIF, TIFF, SVG, RAW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
