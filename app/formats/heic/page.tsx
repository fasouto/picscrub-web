import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Smartphone } from "lucide-react";
import { HexViewer } from "@/components/HexViewer";
import { StructureDiagram } from "@/components/StructureDiagram";

export const metadata: Metadata = {
  title: "HEIC Format Deep Dive - PicScrub",
  description:
    "Technical guide to HEIC file structure, ISOBMFF container, metadata boxes, and how PicScrub handles metadata removal.",
};

export default function HEICPage() {
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
          <div className="p-3 rounded-lg bg-red-500 text-white">
            <Smartphone className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">HEIC Format</h1>
            <p className="text-muted-foreground">
              High Efficiency Image Container
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">ISOBMFF Container</h2>
            <p className="text-muted-foreground mb-4">
              If you&apos;ve ever worked with MP4 video files, HEIC will feel familiar.
              Apple chose the ISO Base Media File Format (ISOBMFF) as the container
              for HEIC, which means it shares DNA with video formats rather than
              traditional image formats like JPEG or PNG.
            </p>
            <p className="text-muted-foreground mb-6">
              The format consists of nested &quot;boxes&quot; (also called atoms) with
              4-character type codes. It&apos;s a surprisingly elegant design that
              allows for complex hierarchies of data while remaining relatively
              easy to parse once you understand the basics.
            </p>

            <StructureDiagram
              title="HEIC File Structure"
              sections={[
                { name: "ftyp", bytes: 24, color: "blue", description: "File type and brands" },
                { name: "meta", bytes: 1000, color: "purple", description: "Metadata container" },
                { name: "mdat", bytes: "rest", color: "green", description: "Media data (HEVC)" },
              ]}
            />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">HEIC Header (ftyp box)</h3>
              <HexViewer
                data="00 00 00 18 66 74 79 70 68 65 69 63 00 00 00 00 6D 69 66 31 68 65 69 63"
                annotations={[
                  { start: 0, end: 3, label: "Box Size (24)", color: "orange" },
                  { start: 4, end: 7, label: "Box Type (ftyp)", color: "blue" },
                  { start: 8, end: 11, label: "Major Brand (heic)", color: "green" },
                  { start: 12, end: 15, label: "Minor Version", color: "gray" },
                  { start: 16, end: 19, label: "Compatible (mif1)", color: "purple" },
                  { start: 20, end: 23, label: "Compatible (heic)", color: "purple" },
                ]}
                bytesPerRow={12}
                showAscii={true}
              />
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Box Structure</h4>
              <div className="font-mono text-sm">
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground mb-2">
                  <span>Size</span>
                  <span>Type</span>
                  <span>Data</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <span className="bg-orange-100 text-orange-800 rounded px-2 py-1">
                    4 bytes (BE)
                  </span>
                  <span className="bg-blue-100 text-blue-800 rounded px-2 py-1">
                    4 bytes
                  </span>
                  <span className="bg-green-100 text-green-800 rounded px-2 py-1">
                    Size - 8
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                If size = 1, an 8-byte extended size follows the type. If size =
                0, box extends to EOF.
              </p>
            </div>
          </section>

          {/* Key Boxes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Key Boxes</h2>
            <p className="text-muted-foreground mb-4">
              The box hierarchy in HEIC files can get deep. Unlike JPEG where
              metadata sits at predictable offsets, HEIC buries its metadata
              several layers into a nested structure. Here&apos;s how the main
              pieces fit together.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">ftyp:File Type</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  First box in file. Contains major brand and compatible brands.
                  Required for format identification.
                </p>
                <div className="text-xs">
                  <span className="font-medium">Compatible brands: </span>
                  <code className="bg-muted px-1 rounded">heic</code>{" "}
                  <code className="bg-muted px-1 rounded">heix</code>{" "}
                  <code className="bg-muted px-1 rounded">hevc</code>{" "}
                  <code className="bg-muted px-1 rounded">hevx</code>{" "}
                  <code className="bg-muted px-1 rounded">heim</code>{" "}
                  <code className="bg-muted px-1 rounded">heis</code>{" "}
                  <code className="bg-muted px-1 rounded">hevm</code>{" "}
                  <code className="bg-muted px-1 rounded">hevs</code>{" "}
                  <code className="bg-muted px-1 rounded">mif1</code>{" "}
                  <code className="bg-muted px-1 rounded">msf1</code>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">meta:Metadata Container</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Contains all metadata including item locations, properties,
                  and associations. This is where EXIF/XMP data lives.
                </p>
                <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
{`meta (metadata container)
├── hdlr  (handler reference)
├── pitm  (primary item ID)
├── iloc  (item locations → offsets into mdat)
│   └── [item_id, offset, length] entries
├── iinf  (item info → find 'Exif' item)
│   └── infe entries with item types
├── iprp  (item properties)
│   ├── ipco (property container)
│   │   ├── hvcC  (HEVC decoder config)
│   │   ├── ispe  (image dimensions)
│   │   ├── colr  (ICC profile, offset+12)
│   │   ├── Exif  (EXIF in TIFF format)
│   │   └── pixi  (pixel information)
│   └── ipma (property associations)
└── iref  (item references)`}</pre>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">mdat:Media Data</h3>
                <p className="text-sm text-muted-foreground">
                  Contains the actual HEVC-encoded image data. The iloc box in
                  meta provides offsets into mdat.
                </p>
              </div>
            </div>
          </section>

          {/* Metadata in HEIC */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Metadata in HEIC</h2>
            <p className="text-muted-foreground mb-6">
              If you&apos;re used to JPEG&apos;s APP markers, HEIC takes a different
              approach. Instead of sequential markers at the start of the file,
              metadata lives as &quot;item properties&quot; inside the meta box. The actual
              EXIF data is still in the familiar TIFF format, but finding it
              requires navigating the box hierarchy first.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">EXIF Property</h3>
                <p className="text-sm text-muted-foreground">
                  Stored in ipco (item property container) with type &quot;Exif&quot;.
                  Contains standard EXIF data in TIFF format, same as JPEG.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">XMP Property</h3>
                <p className="text-sm text-muted-foreground">
                  XML-based metadata stored as &quot;mime&quot; type property with
                  content-type &quot;application/rdf+xml&quot;.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold">ICC Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Color profile stored as &quot;colr&quot; box with type &quot;prof&quot;.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Why Offsets Matter
              </h4>
              <p className="text-sm text-blue-700">
                The iloc box contains precise byte offsets pointing into mdat.
                If any box sizes change (e.g., from removing metadata), these
                offsets must be recalculated or the file becomes unreadable.
              </p>
            </div>
          </section>

          {/* Lossless Anonymization */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Lossless Anonymization</h2>
            <p className="text-muted-foreground mb-4">
              Here&apos;s where HEIC gets tricky. The format was designed for efficient
              video/image storage, not for easy metadata manipulation.
            </p>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2">
                The Challenge
              </h4>
              <p className="text-sm text-yellow-700">
                HEIC&apos;s offset-based structure makes byte removal risky.
                The iloc box contains precise byte offsets pointing into mdat.
                If you remove even a single box, those offsets become wrong,
                and the image won&apos;t open anymore.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                Zero-Overwrite Approach
              </h4>
              <p className="text-sm text-green-700 mb-3">
                Instead of removing metadata boxes, PicScrub overwrites their
                contents with zeros while preserving box structure and sizes.
              </p>
              <div className="text-xs font-mono bg-white/50 p-2 rounded">
                Before: [Exif][GPS Data: 37.7749, -122.4194][Camera: iPhone]
                <br />
                After:&nbsp; [Exif][0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x00...]
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Why Zero-Overwrite?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Preserves file integrity</strong>:All offsets
                  remain valid
                </li>
                <li>
                  • <strong>No recompression</strong>:Image data untouched
                </li>
                <li>
                  • <strong>Metadata destroyed</strong>:Zeros contain no
                  information
                </li>
                <li>
                  • <strong>Reversible?</strong>:No, overwritten data is gone
                </li>
              </ul>
            </div>
          </section>

          {/* How PicScrub Processes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How PicScrub Processes HEIC
            </h2>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Parse Box Structure</p>
                  <p className="text-sm text-muted-foreground">
                    Recursively parse ftyp, meta, and identify all boxes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Locate Metadata</p>
                  <p className="text-sm text-muted-foreground">
                    Find Exif and XMP properties in ipco container
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Zero Metadata Content</p>
                  <p className="text-sm text-muted-foreground">
                    Overwrite metadata box contents with zeros
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Preserve Structure</p>
                  <p className="text-sm text-muted-foreground">
                    Keep box headers, sizes, and all offsets unchanged
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* File Size Note */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">File Size Consideration</h2>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Because PicScrub uses zero-overwrite instead of removal, the
                output file size will be the same as the input. The metadata
                space is preserved but filled with zeros.
              </p>
              <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Input:</span> 2.5 MB (with 50KB
                  EXIF)
                </div>
                <div>
                  <span className="font-medium">Output:</span> 2.5 MB (50KB of
                  zeros)
                </div>
              </div>
            </div>
          </section>

          {/* HEVC vs HEIF */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">HEIC vs HEIF vs AVIF</h2>
            <p className="text-muted-foreground mb-4">
              The naming is confusing, so let&apos;s clear it up. HEIF is the
              container format, while HEIC and AVIF describe what codec is
              used to compress the image inside that container.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border">Format</th>
                    <th className="text-left p-2 border">Container</th>
                    <th className="text-left p-2 border">Codec</th>
                    <th className="text-left p-2 border">Used By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-medium">HEIC</td>
                    <td className="p-2 border">HEIF</td>
                    <td className="p-2 border">HEVC (H.265)</td>
                    <td className="p-2 border">Apple devices</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">HEIF</td>
                    <td className="p-2 border">HEIF</td>
                    <td className="p-2 border">Various</td>
                    <td className="p-2 border">General container</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">AVIF</td>
                    <td className="p-2 border">HEIF</td>
                    <td className="p-2 border">AV1</td>
                    <td className="p-2 border">Web (royalty-free)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground mt-3">
              All three use the same ISOBMFF/HEIF container structure, so
              PicScrub&apos;s approach works for all of them.
            </p>
          </section>

        </div>
      </article>
    </div>
  );
}
