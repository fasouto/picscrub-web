import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Film } from "lucide-react";
import { HexViewer } from "@/components/HexViewer";
import { StructureDiagram } from "@/components/StructureDiagram";

export const metadata: Metadata = {
  title: "GIF Format Deep Dive - PicScrub",
  description:
    "Technical guide to GIF file structure, extension blocks, animation data, and how PicScrub removes metadata while preserving animations.",
};

export default function GIFPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/formats"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Formats
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-lg bg-purple-500 text-white">
            <Film className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">GIF Format</h1>
            <p className="text-muted-foreground">Graphics Interchange Format</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Block Structure</h2>
            <p className="text-muted-foreground mb-4">
              GIF is one of those formats that has outlived its expected lifespan
              by decades. Created by CompuServe in 1987, it&apos;s still everywhere
              today, mostly because of its animation support.
            </p>
            <p className="text-muted-foreground mb-6">
              The format uses a block-based structure that&apos;s refreshingly
              straightforward compared to modern formats. A header, some
              descriptors, a color table, your image data, and a single-byte
              trailer to say &quot;the end.&quot;
            </p>

            <StructureDiagram
              title="GIF File Structure"
              sections={[
                { name: "Header", bytes: 6, color: "blue", description: "GIF87a or GIF89a" },
                { name: "LSD", bytes: 7, color: "purple", description: "Logical Screen Descriptor" },
                { name: "GCT", bytes: 768, color: "orange", description: "Global Color Table (optional)" },
                { name: "Extensions", bytes: 100, color: "red", description: "Extension blocks (metadata)" },
                { name: "Image Data", bytes: "rest", color: "green", description: "Image descriptor + LZW data" },
                { name: "Trailer", bytes: 1, color: "blue", description: "0x3B terminator" },
              ]}
            />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">GIF Header</h3>
              <HexViewer
                data="47 49 46 38 39 61 80 02 E0 01 F7 00 00"
                annotations={[
                  { start: 0, end: 2, label: "GIF Signature", color: "blue" },
                  { start: 3, end: 5, label: "Version (89a)", color: "blue" },
                  { start: 6, end: 7, label: "Width (640)", color: "purple" },
                  { start: 8, end: 9, label: "Height (480)", color: "purple" },
                  { start: 10, end: 10, label: "Packed Fields", color: "orange" },
                  { start: 11, end: 11, label: "Background Index", color: "yellow" },
                  { start: 12, end: 12, label: "Pixel Aspect Ratio", color: "yellow" },
                ]}
                bytesPerRow={13}
              />
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Version Differences</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">GIF87a</span>
                  <p className="text-muted-foreground">
                    Original spec. No extension blocks.
                  </p>
                </div>
                <div>
                  <span className="font-medium">GIF89a</span>
                  <p className="text-muted-foreground">
                    Added extensions, animation, transparency.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Extension Blocks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Extension Blocks</h2>
            <p className="text-muted-foreground mb-6">
              GIF89a (the 1989 revision) added extension blocks, which is how
              GIF got animation support. All extension blocks start with{" "}
              <code>0x21</code> followed by a type byte, which makes them easy to spot when you&apos;re
              scanning through a file. Some of these we want to keep (animation
              timing), others we want to remove (comments).
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">
                  Graphic Control Extension (0xF9)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Controls animation timing, transparency, and disposal method.
                  Precedes each image descriptor in animated GIFs.{" "}
                  <span className="text-green-600 font-medium">
                    Always preserved.
                  </span>
                </p>
                <div className="mt-2 font-mono text-xs bg-muted p-2 rounded">
                  21 F9 04 [disposal] [delay] [transparent] 00
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">Comment Extension (0xFE)</h3>
                <p className="text-sm text-muted-foreground">
                  Plain text comments. Can contain any information including
                  author, creation date, software, or personal notes.{" "}
                  <span className="text-red-600 font-medium">
                    Removed by PicScrub.
                  </span>
                </p>
                <div className="mt-2 font-mono text-xs bg-muted p-2 rounded">
                  21 FE [size] [comment data...] 00
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold">Application Extension (0xFF)</h3>
                <p className="text-sm text-muted-foreground">
                  Application-specific data. Most important: NETSCAPE2.0 for
                  animation looping. Can also contain XMP metadata.
                </p>
                <div className="mt-2 font-mono text-xs bg-muted p-2 rounded">
                  21 FF 0B [app identifier] [auth code] [data...] 00
                </div>
              </div>

              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-semibold">Plain Text Extension (0x01)</h3>
                <p className="text-sm text-muted-foreground">
                  Rarely used. Renders text using the GIF color table. Mostly
                  ignored by modern software.
                </p>
              </div>
            </div>
          </section>

          {/* Application Extensions Deep Dive */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Application Extensions
            </h2>

            <div className="space-y-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  NETSCAPE2.0:Animation Loop
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  Controls how many times an animated GIF loops. Value of 0
                  means infinite loop.
                </p>
                <HexViewer
                  data="21 FF 0B 4E 45 54 53 43 41 50 45 32 2E 30 03 01 00 00 00"
                  annotations={[
                    { start: 0, end: 1, label: "Extension intro", color: "blue" },
                    { start: 2, end: 2, label: "Block size (11)", color: "orange" },
                    { start: 3, end: 13, label: "NETSCAPE2.0", color: "green" },
                    { start: 14, end: 14, label: "Sub-block size", color: "orange" },
                    { start: 15, end: 15, label: "Sub-block ID", color: "purple" },
                    { start: 16, end: 17, label: "Loop count", color: "yellow" },
                    { start: 18, end: 18, label: "Terminator", color: "blue" },
                  ]}
                  bytesPerRow={19}
                  showAscii={true}
                />
                <p className="text-xs text-green-600 mt-2">
                  PicScrub preserves NETSCAPE2.0 to maintain animation behavior.
                </p>
              </div>

              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">
                  XMP Data:Extensible Metadata Platform
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  Application identifier: <code>XMP DataXMP</code>. Contains
                  full XMP/RDF metadata in XML format.
                </p>
                <p className="text-xs text-red-600">
                  PicScrub removes XMP application extensions.
                </p>
              </div>
            </div>
          </section>

          {/* Animation Preservation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Animation Preservation</h2>
            <p className="text-muted-foreground mb-4">
              The tricky part with GIF is distinguishing between animation data
              (which we need to keep) and metadata (which we want to remove).
              Both live in extension blocks, so we can&apos;t just strip all
              extensions.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Preserved for Animation
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• NETSCAPE2.0 loop count</li>
                  <li>• Graphic Control Extensions</li>
                  <li>• Frame delays</li>
                  <li>• Disposal methods</li>
                  <li>• Transparency indices</li>
                  <li>• Local color tables</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">
                  Removed
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Comment extensions</li>
                  <li>• XMP application blocks</li>
                  <li>• Unknown application blocks</li>
                  <li>• Plain text extensions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How PicScrub Processes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How PicScrub Processes GIF
            </h2>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Validate Header</p>
                  <p className="text-sm text-muted-foreground">
                    Check for GIF87a or GIF89a signature
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Copy Header Data</p>
                  <p className="text-sm text-muted-foreground">
                    Preserve LSD and Global Color Table unchanged
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Filter Extensions</p>
                  <p className="text-sm text-muted-foreground">
                    Keep NETSCAPE2.0 and Graphic Control, remove Comment and XMP
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Preserve Image Data</p>
                  <p className="text-sm text-muted-foreground">
                    Copy all image descriptors, LCTs, and LZW data unchanged
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">5</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Write Trailer</p>
                  <p className="text-sm text-muted-foreground">
                    End file with <code>0x3B</code> trailer byte
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* LZW Compression Note */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">LZW Compression</h2>
            <p className="text-muted-foreground mb-4">
              A quick note on GIF&apos;s image data: it uses LZW compression, which
              was actually patented until 2004 (causing all sorts of drama in
              the &apos;90s). PicScrub doesn&apos;t touch the compressed data at all. We
              copy it byte-for-byte, which means zero quality loss.
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Why This Matters
              </h4>
              <p className="text-sm text-blue-700">
                By preserving the original LZW data, PicScrub ensures:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• No quality loss (bit-perfect image preservation)</li>
                <li>• Fast processing (no decode/encode cycle)</li>
                <li>• Identical file size for image data</li>
              </ul>
            </div>
          </section>

          {/* Limitations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">GIF Metadata Limitations</h2>
            <p className="text-muted-foreground mb-4">
              The good news about GIF is that it predates the EXIF standard,
              so there&apos;s no GPS coordinates or camera info to worry about.
              The metadata concerns are more mundane.
            </p>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                What Can Leak
              </h4>
              <p className="text-sm text-yellow-700">
                GIF&apos;s privacy concerns are relatively minor compared to JPEG:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Comment extensions (sometimes containing author notes)</li>
                <li>• XMP metadata (rare, but possible)</li>
                <li>• Software identification in application blocks</li>
              </ul>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
