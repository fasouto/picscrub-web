import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { HexViewer } from "@/components/HexViewer";
import { PNGStructure } from "@/components/StructureDiagram";

export const metadata: Metadata = {
  title: "PNG Format Deep Dive - PicScrub",
  description:
    "Technical guide to PNG file structure, chunk-based metadata, and how PicScrub removes metadata while preserving image quality.",
};

export default function PNGPage() {
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
          <div className="p-3 rounded-lg bg-green-500 text-white">
            <ImageIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">PNG Format</h1>
            <p className="text-muted-foreground">
              Portable Network Graphics
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Chunk-Based Structure</h2>
            <p className="text-muted-foreground mb-4">
              PNG has one of the cleanest file formats around. Everything is organized
              into &quot;chunks&quot;, which are self-contained blocks with a type, data, and checksum.
              The elegant part is that decoders can skip chunks they don&apos;t understand,
              which is how PNG supports metadata without breaking older software.
            </p>
            <p className="text-muted-foreground mb-6">
              The clever bit is in the chunk naming: if the first letter is uppercase,
              it&apos;s &quot;critical&quot; (the image won&apos;t display without it). Lowercase means
              &quot;ancillary&quot;, meaning nice to have but not essential. All the metadata chunks
              we care about are ancillary, which is why we can safely remove them.
            </p>

            <PNGStructure />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">
                PNG Signature and IHDR
              </h3>
              <HexViewer
                data="89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52 00 00 01 00 00 00 01 00 08 02 00 00 00"
                annotations={[
                  { start: 0, end: 7, label: "PNG Signature", color: "blue" },
                  { start: 8, end: 11, label: "IHDR Length (13)", color: "orange" },
                  { start: 12, end: 15, label: "IHDR Type", color: "green" },
                  { start: 16, end: 19, label: "Width (256)", color: "purple" },
                  { start: 20, end: 23, label: "Height (256)", color: "purple" },
                  { start: 24, end: 28, label: "Bit depth, color type, etc.", color: "yellow" },
                ]}
                bytesPerRow={16}
              />
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Chunk Structure</h4>
              <div className="font-mono text-sm">
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground mb-2">
                  <span>Length</span>
                  <span>Type</span>
                  <span>Data</span>
                  <span>CRC32</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <span className="bg-orange-100 text-orange-800 rounded px-2 py-1">
                    4 bytes
                  </span>
                  <span className="bg-green-100 text-green-800 rounded px-2 py-1">
                    4 bytes
                  </span>
                  <span className="bg-blue-100 text-blue-800 rounded px-2 py-1">
                    Variable
                  </span>
                  <span className="bg-purple-100 text-purple-800 rounded px-2 py-1">
                    4 bytes
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Chunk Type Naming Convention
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • <strong>First letter uppercase</strong> = Critical chunk
                  (must be understood)
                </li>
                <li>
                  • <strong>First letter lowercase</strong> = Ancillary chunk
                  (optional, can be ignored)
                </li>
                <li>
                  • <strong>Second letter</strong> = Public (uppercase) or
                  Private (lowercase)
                </li>
              </ul>
            </div>
          </section>

          {/* Critical Chunks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Critical Chunks</h2>
            <p className="text-muted-foreground mb-4">
              These chunks must be present and understood for the image to be
              valid. PicScrub always preserves critical chunks.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">IHDR:Image Header</h3>
                <p className="text-sm text-muted-foreground">
                  First chunk after signature. Contains width, height, bit
                  depth, color type, compression method, filter method, and
                  interlace method. Exactly 13 bytes of data.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">IDAT:Image Data</h3>
                <p className="text-sm text-muted-foreground">
                  Contains the compressed (zlib/deflate) image data. May be
                  split across multiple IDAT chunks. All IDAT chunks must be
                  consecutive.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">IEND:Image End</h3>
                <p className="text-sm text-muted-foreground">
                  Marks the end of the PNG datastream. Must be the last chunk.
                  Has zero data bytes.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">PLTE:Palette</h3>
                <p className="text-sm text-muted-foreground">
                  Required for indexed color images (color type 3). Contains 1–256
                  RGB palette entries.
                </p>
              </div>
            </div>
          </section>

          {/* Metadata Chunks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Metadata Chunks</h2>
            <p className="text-muted-foreground mb-6">
              Ancillary chunks that can contain privacy-sensitive metadata.
              These are the chunks PicScrub removes.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">tEXt:Uncompressed Text</h3>
                <p className="text-sm text-muted-foreground">
                  Key-value pairs in Latin-1 encoding. Common keys: Author,
                  Description, Copyright, Creation Time, Software.
                </p>
                <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                  Format: keyword + null + text
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">zTXt:Compressed Text</h3>
                <p className="text-sm text-muted-foreground">
                  Same as tEXt but with zlib compression. Used for longer text
                  content.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">iTXt:International Text</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  UTF-8 text with optional compression. Supports language tags
                  and translated keywords. Used for XMP metadata.
                </p>
                <div className="text-xs font-mono bg-muted p-2 rounded">
                  XMP keyword: <code>XML:com.adobe.xmp\0</code>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">eXIf:EXIF Data</h3>
                <p className="text-sm text-muted-foreground">
                  Registered as a PNG extension in 2017. Contains raw EXIF data in TIFF format,
                  same structure as JPEG EXIF.{" "}
                  <span className="text-red-600 font-medium">
                    Can contain GPS, timestamps, device info.
                  </span>
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold">iCCP:ICC Color Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Embedded ICC color profile. Compressed with zlib. PicScrub
                  preserves by default for color accuracy.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">tIME:Last Modification Time</h3>
                <p className="text-sm text-muted-foreground">
                  Seven bytes: year (2), month, day, hour, minute, second.
                  Reveals when the image was last modified.
                </p>
              </div>
            </div>
          </section>

          {/* Color-Related Chunks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Color-Related Chunks</h2>
            <p className="text-muted-foreground mb-4">
              These chunks affect color rendering but typically don&apos;t contain
              personal information. PicScrub preserves them by default.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">sRGB</h3>
                <p className="text-sm text-muted-foreground">
                  Indicates sRGB color space. Single byte for rendering intent.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">gAMA</h3>
                <p className="text-sm text-muted-foreground">
                  Gamma value as 4-byte unsigned integer (scaled by 100,000).
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">cHRM</h3>
                <p className="text-sm text-muted-foreground">
                  Primary chromaticities and white point coordinates.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">sBIT</h3>
                <p className="text-sm text-muted-foreground">
                  Original sample bit depths for each channel.
                </p>
              </div>
            </div>
          </section>

          {/* CRC32 Verification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">CRC32 Verification</h2>
            <p className="text-muted-foreground mb-4">
              Every PNG chunk includes a CRC32 checksum calculated over the
              chunk type and data. This ensures data integrity.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">CRC Calculation</h4>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`CRC32 input = chunk_type (4 bytes) + chunk_data (N bytes)
CRC32 output = 4 bytes appended after chunk data

// PNG uses CRC-32 polynomial: 0xEDB88320`}</pre>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Why PicScrub Validates CRC
              </h4>
              <p className="text-sm text-blue-700">
                When reading PNG files, PicScrub validates each chunk&apos;s CRC to
                ensure data integrity. Corrupted chunks are handled gracefully.
              </p>
            </div>
          </section>

          {/* How PicScrub Processes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How PicScrub Processes PNG
            </h2>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Verify Signature</p>
                  <p className="text-sm text-muted-foreground">
                    Check for PNG signature: <code>89 50 4E 47 0D 0A 1A 0A</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Parse Chunks</p>
                  <p className="text-sm text-muted-foreground">
                    Read each chunk&apos;s length, type, and validate CRC
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Filter Metadata Chunks</p>
                  <p className="text-sm text-muted-foreground">
                    Identify and skip tEXt, zTXt, iTXt, eXIf, tIME chunks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Reconstruct File</p>
                  <p className="text-sm text-muted-foreground">
                    Write signature + filtered chunks + IEND
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Preserved Chunks
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• IHDR, PLTE, IDAT, IEND (critical)</li>
                  <li>• sRGB, gAMA, cHRM (color)</li>
                  <li>• iCCP (color profile, optional)</li>
                  <li>• pHYs (pixel dimensions)</li>
                  <li>• tRNS (transparency)</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">
                  Removed Chunks
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• tEXt (text metadata)</li>
                  <li>• zTXt (compressed text)</li>
                  <li>• iTXt (international text, XMP)</li>
                  <li>• eXIf (EXIF data)</li>
                  <li>• tIME (modification time)</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
