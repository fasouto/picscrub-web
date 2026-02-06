import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Image Format Guides - PicScrub",
  description:
    "Deep-dive technical guides for image formats: JPEG, PNG, WebP, GIF, SVG, TIFF, HEIC, and RAW. Learn about binary structure, metadata locations, and how PicScrub processes each format.",
};

const formats = [
  {
    name: "JPEG",
    slug: "jpeg",
    description: "The most common image format with complex EXIF/IPTC metadata",
  },
  {
    name: "PNG",
    slug: "png",
    description: "Lossless format with chunk-based metadata storage",
  },
  {
    name: "WebP",
    slug: "webp",
    description: "Modern format using RIFF container with embedded metadata",
  },
  {
    name: "GIF",
    slug: "gif",
    description: "Animation-capable format with comment and XMP extensions",
  },
  {
    name: "SVG",
    slug: "svg",
    description: "XML-based vector format with embedded metadata elements",
  },
  {
    name: "TIFF",
    slug: "tiff",
    description: "Flexible format with IFD-based tag structure",
  },
  {
    name: "HEIC",
    slug: "heic",
    description: "Apple's high-efficiency format using ISOBMFF container",
  },
  {
    name: "RAW",
    slug: "raw",
    description: "Camera raw formats including DNG, CR2, NEF, and ARW",
  },
];

export default function FormatsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">Image Format Guides</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Deep-dive technical documentation for developers. Learn the binary
            structure, metadata locations, and byte-level details of each
            image format PicScrub supports.
          </p>
        </header>

        {/* Format Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formats.map((format) => (
              <Link key={format.slug} href={`/formats/${format.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      {format.name}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {format.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Comparison Table */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Format Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Format</th>
                  <th className="text-left p-3 font-semibold">EXIF</th>
                  <th className="text-left p-3 font-semibold">GPS</th>
                  <th className="text-left p-3 font-semibold">XMP</th>
                  <th className="text-left p-3 font-semibold">ICC Profile</th>
                  <th className="text-left p-3 font-semibold">Lossless Removal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "JPEG", exif: true, gps: true, xmp: true, icc: true, lossless: true },
                  { name: "PNG", exif: true, gps: true, xmp: true, icc: true, lossless: true },
                  { name: "WebP", exif: true, gps: true, xmp: true, icc: true, lossless: true },
                  { name: "GIF", exif: false, gps: false, xmp: true, icc: false, lossless: true },
                  { name: "SVG", exif: false, gps: false, xmp: true, icc: false, lossless: true },
                  { name: "TIFF", exif: true, gps: true, xmp: true, icc: true, lossless: true },
                  { name: "HEIC", exif: true, gps: true, xmp: true, icc: false, lossless: "Zero-overwrite" },
                  { name: "RAW/DNG", exif: true, gps: true, xmp: true, icc: true, lossless: true },
                ].map((row) => (
                  <tr key={row.name} className="border-b">
                    <td className="p-3 font-medium">{row.name}</td>
                    <td className="p-3">{row.exif ? "✓" : "-"}</td>
                    <td className="p-3">{row.gps ? "✓" : "-"}</td>
                    <td className="p-3">{row.xmp ? "✓" : "-"}</td>
                    <td className="p-3">{row.icc ? "✓" : "-"}</td>
                    <td className="p-3">
                      {typeof row.lossless === "string" ? (
                        <span className="text-yellow-600">{row.lossless}</span>
                      ) : row.lossless ? (
                        "✓"
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Developer Info */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">For Developers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Each format guide includes byte-level hex examples, binary structure
            diagrams, and code references from the PicScrub library. Use these
            guides to understand how metadata is stored and removed.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/fasouto/picscrub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              View on GitHub →
            </a>
            <a
              href="https://www.npmjs.com/package/picscrub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              npm package →
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}
