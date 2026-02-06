import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Layers } from "lucide-react";
import { HexViewer } from "@/components/HexViewer";
import { WebPStructure } from "@/components/StructureDiagram";

export const metadata: Metadata = {
  title: "WebP Format Deep Dive - PicScrub",
  description:
    "Technical guide to WebP file structure, RIFF container, VP8X flags, and how PicScrub removes metadata while preserving image quality.",
};

export default function WebPPage() {
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
          <div className="p-3 rounded-lg bg-blue-500 text-white">
            <Layers className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">WebP Format</h1>
            <p className="text-muted-foreground">Google&apos;s Modern Image Format</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* RIFF Container */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">RIFF Container</h2>
            <p className="text-muted-foreground mb-4">
              Google didn&apos;t invent a new container for WebP. They went with
              RIFF, the same format that&apos;s been carrying WAV audio and AVI
              video since the early &apos;90s. If you&apos;ve ever parsed a WAV file,
              you already know how WebP works at the container level.
            </p>
            <p className="text-muted-foreground mb-6">
              The format uses nested chunks with 4-character identifiers
              (called FourCC codes). It&apos;s a simple and robust design that
              has stood the test of time.
            </p>

            <WebPStructure />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">WebP Header</h3>
              <HexViewer
                data="52 49 46 46 24 1A 00 00 57 45 42 50 56 50 38 58 0A 00 00 00 10 00 00 00 FF 00 00 FF 00 00"
                annotations={[
                  { start: 0, end: 3, label: "RIFF Signature", color: "blue" },
                  { start: 4, end: 7, label: "File Size - 8", color: "orange" },
                  { start: 8, end: 11, label: "WEBP Identifier", color: "blue" },
                  { start: 12, end: 15, label: "VP8X Chunk Type", color: "green" },
                  { start: 16, end: 19, label: "VP8X Size (10)", color: "orange" },
                  { start: 20, end: 23, label: "VP8X Flags", color: "purple" },
                  { start: 24, end: 29, label: "Canvas Size", color: "yellow" },
                ]}
                bytesPerRow={16}
              />
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">RIFF Chunk Structure</h4>
              <div className="font-mono text-sm">
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground mb-2">
                  <span>FourCC</span>
                  <span>Size</span>
                  <span>Data</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <span className="bg-blue-100 text-blue-800 rounded px-2 py-1">
                    4 bytes
                  </span>
                  <span className="bg-orange-100 text-orange-800 rounded px-2 py-1">
                    4 bytes (LE)
                  </span>
                  <span className="bg-green-100 text-green-800 rounded px-2 py-1">
                    Variable
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Note: Chunk data is padded to even length with a null byte if
                necessary.
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Key Offsets</h4>
              <ul className="text-sm text-blue-700 space-y-1 font-mono">
                <li>• Sub-chunk start: <strong>12 bytes</strong> (after RIFF + size + WEBP)</li>
                <li>• Chunk header: <strong>8 bytes</strong> (4-byte FourCC + 4-byte size)</li>
                <li>• Size field offset: <strong>+4</strong> from chunk start (little-endian)</li>
              </ul>
            </div>
          </section>

          {/* Image Chunks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Image Chunks</h2>
            <p className="text-muted-foreground mb-4">
              WebP is actually three formats in one: lossy (VP8), lossless
              (VP8L), and extended (VP8X). The chunk type tells you which
              compression method was used.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">VP8:Lossy Compression</h3>
                <p className="text-sm text-muted-foreground">
                  Uses VP8 video codec for compression. Similar quality/size
                  ratio to JPEG. Simple WebP files contain only this chunk.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">VP8L:Lossless Compression</h3>
                <p className="text-sm text-muted-foreground">
                  Lossless compression with prediction, color transform, and
                  entropy coding. Typically 25-34% smaller than PNG.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">VP8X:Extended Format</h3>
                <p className="text-sm text-muted-foreground">
                  Indicates presence of optional features: animation, alpha
                  channel, ICC profile, EXIF, or XMP. Required when any of these
                  features are present.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">ALPH:Alpha Channel</h3>
                <p className="text-sm text-muted-foreground">
                  Separate alpha channel data. Can be lossless or lossy
                  compressed independently from color data.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold">ANIM/ANMF:Animation</h3>
                <p className="text-sm text-muted-foreground">
                  ANIM contains global animation parameters. ANMF chunks contain
                  individual animation frames with timing info.
                </p>
              </div>
            </div>
          </section>

          {/* Metadata Chunks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Metadata Chunks</h2>
            <p className="text-muted-foreground mb-6">
              Unlike simple WebP files that contain only image data, extended
              WebP files can carry metadata. The good news is that these chunks
              are cleanly separated from the image data, making them easy to
              identify and remove.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">EXIF:EXIF Metadata</h3>
                <p className="text-sm text-muted-foreground">
                  Contains EXIF data in the same format as JPEG (raw TIFF
                  structure). Includes camera info, GPS coordinates, timestamps,
                  and thumbnails.{" "}
                  <span className="text-red-600 font-medium">
                    Primary privacy concern.
                  </span>
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">XMP:XMP Metadata</h3>
                <p className="text-sm text-muted-foreground">
                  XML-based metadata. Can duplicate EXIF data plus editing
                  history, software info, and custom fields.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold">ICCP:ICC Color Profile</h3>
                <p className="text-sm text-muted-foreground">
                  ICC color profile for color management. PicScrub preserves by
                  default to maintain color accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* VP8X Flags */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">VP8X Flags</h2>
            <p className="text-muted-foreground mb-4">
              The VP8X chunk acts like a table of contents, telling decoders
              what to expect in the file. When we remove metadata chunks, we
              also need to update these flags, otherwise the decoder will look
              for data that isn&apos;t there.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Flag Bits</h4>
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-background px-2 py-1 rounded border w-20 text-center">
                    Bit 0
                  </span>
                  <span>Reserved (must be 0)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-background px-2 py-1 rounded border w-20 text-center">
                    Bit 1
                  </span>
                  <span>Animation flag</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded border w-20 text-center">
                    Bit 2
                  </span>
                  <span>XMP metadata present</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded border w-20 text-center">
                    Bit 3
                  </span>
                  <span>EXIF metadata present</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-background px-2 py-1 rounded border w-20 text-center">
                    Bit 4
                  </span>
                  <span>Alpha channel present</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded border w-20 text-center">
                    Bit 5
                  </span>
                  <span>ICC profile present</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Why Flags Matter
              </h4>
              <p className="text-sm text-blue-700">
                When PicScrub removes EXIF/XMP chunks, it must also update the
                VP8X flags to reflect their absence. Otherwise, decoders may
                expect data that isn&apos;t there.
              </p>
            </div>
          </section>

          {/* How PicScrub Processes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How PicScrub Processes WebP
            </h2>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Validate RIFF Header</p>
                  <p className="text-sm text-muted-foreground">
                    Check for <code>RIFF....WEBP</code> signature
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Parse Chunks</p>
                  <p className="text-sm text-muted-foreground">
                    Iterate through all RIFF chunks, reading FourCC and size
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Remove Metadata Chunks</p>
                  <p className="text-sm text-muted-foreground">
                    Skip EXIF and XMP chunks when writing output
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Update VP8X Flags</p>
                  <p className="text-sm text-muted-foreground">
                    Clear EXIF/XMP flag bits in VP8X chunk
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">5</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Recalculate File Size</p>
                  <p className="text-sm text-muted-foreground">
                    Update RIFF header with new total file size
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Preserved</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• VP8/VP8L image data</li>
                  <li>• ALPH alpha channel</li>
                  <li>• ANIM/ANMF animation data</li>
                  <li>• ICCP color profile (optional)</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Removed</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• EXIF metadata</li>
                  <li>• XMP metadata</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Simple vs Extended */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Simple vs Extended WebP
            </h2>
            <p className="text-muted-foreground mb-4">
              If a WebP file doesn&apos;t have a VP8X chunk, it&apos;s a &quot;simple&quot;
              WebP: just the RIFF wrapper around a single VP8 or VP8L chunk.
              No metadata is possible in simple WebP files, so if you&apos;re
              privacy-conscious, these are ideal.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">
                  Simple WebP
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Contains only VP8 or VP8L chunk. No metadata possible.
                </p>
                <div className="font-mono text-xs bg-muted p-2 rounded">
                  RIFF + WEBP + VP8/VP8L
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">
                  Extended WebP
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Has VP8X chunk enabling metadata, alpha, animation.
                </p>
                <div className="font-mono text-xs bg-muted p-2 rounded">
                  RIFF + WEBP + VP8X + [ICCP] + [ANIM] + [EXIF] + [XMP] + VP8/VP8L
                </div>
              </div>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
