import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, FileImage } from "lucide-react";
import { HexViewer } from "@/components/HexViewer";
import { JPEGStructure } from "@/components/StructureDiagram";

export const metadata: Metadata = {
  title: "JPEG Format Deep Dive - PicScrub",
  description:
    "Technical guide to JPEG file structure, EXIF metadata, APP markers, and how PicScrub removes metadata while preserving image quality.",
};

export default function JPEGPage() {
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
          <div className="p-3 rounded-lg bg-orange-500 text-white">
            <FileImage className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">JPEG Format</h1>
            <p className="text-muted-foreground">
              Joint Photographic Experts Group
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">File Structure Overview</h2>
            <p className="text-muted-foreground mb-4">
              If you&apos;ve ever opened a JPEG in a hex editor, you&apos;ll notice it&apos;s
              made up of segments separated by markers. Every marker starts with{" "}
              <code>0xFF</code>, followed by a byte that tells you what kind of
              segment it is. This design makes JPEGs relatively easy to parse. You
              just scan for <code>FF</code> bytes and check what follows.
            </p>
            <p className="text-muted-foreground mb-6">
              The interesting part for privacy is that all the metadata (EXIF, GPS,
              timestamps) lives in these segments, completely separate from the
              actual image data. That&apos;s why we can strip metadata without
              touching the pixels or recompressing anything.
            </p>

            <JPEGStructure />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">
                JPEG Header Example
              </h3>
              <HexViewer
                data="FF D8 FF E0 00 10 4A 46 49 46 00 01 01 00 00 48 00 48 00 00 FF E1 12 34 45 78 69 66 00 00"
                annotations={[
                  { start: 0, end: 1, label: "SOI (Start of Image)", color: "blue" },
                  { start: 2, end: 3, label: "APP0 Marker", color: "red" },
                  { start: 4, end: 5, label: "APP0 Length", color: "orange" },
                  { start: 6, end: 10, label: "JFIF Identifier", color: "purple" },
                  { start: 11, end: 17, label: "JFIF Data", color: "yellow" },
                  { start: 18, end: 19, label: "APP1 Marker", color: "red" },
                  { start: 20, end: 21, label: "APP1 Length", color: "orange" },
                  { start: 22, end: 27, label: "Exif Identifier", color: "green" },
                ]}
                bytesPerRow={16}
              />
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Marker Structure</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  <code>FF xx</code>:Marker (xx identifies the type)
                </li>
                <li>
                  <code>LL LL</code>:Length (2 bytes, big-endian, includes
                  itself)
                </li>
                <li>
                  <code>Data...</code>:Segment data (length - 2 bytes)
                </li>
              </ul>
            </div>

            {/* Complete Marker Reference */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Complete JPEG Marker Reference</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2 border">Marker</th>
                      <th className="text-left p-2 border">Name</th>
                      <th className="text-left p-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-blue-50"><td className="p-2 border font-mono">FF D8</td><td className="p-2 border">SOI</td><td className="p-2 border">Start of Image</td></tr>
                    <tr className="bg-blue-50"><td className="p-2 border font-mono">FF D9</td><td className="p-2 border">EOI</td><td className="p-2 border">End of Image</td></tr>
                    <tr><td className="p-2 border font-mono">FF C0</td><td className="p-2 border">SOF0</td><td className="p-2 border">Start of Frame (Baseline DCT)</td></tr>
                    <tr><td className="p-2 border font-mono">FF C2</td><td className="p-2 border">SOF2</td><td className="p-2 border">Start of Frame (Progressive DCT)</td></tr>
                    <tr><td className="p-2 border font-mono">FF C4</td><td className="p-2 border">DHT</td><td className="p-2 border">Define Huffman Table</td></tr>
                    <tr><td className="p-2 border font-mono">FF DB</td><td className="p-2 border">DQT</td><td className="p-2 border">Define Quantization Table</td></tr>
                    <tr><td className="p-2 border font-mono">FF DD</td><td className="p-2 border">DRI</td><td className="p-2 border">Define Restart Interval</td></tr>
                    <tr><td className="p-2 border font-mono">FF DA</td><td className="p-2 border">SOS</td><td className="p-2 border">Start of Scan (image data follows)</td></tr>
                    <tr className="bg-red-50"><td className="p-2 border font-mono">FF FE</td><td className="p-2 border">COM</td><td className="p-2 border">Comment (metadata)</td></tr>
                    <tr className="bg-red-50"><td className="p-2 border font-mono">FF E0</td><td className="p-2 border">APP0</td><td className="p-2 border">JFIF marker</td></tr>
                    <tr className="bg-red-50"><td className="p-2 border font-mono">FF E1</td><td className="p-2 border">APP1</td><td className="p-2 border">EXIF / XMP marker</td></tr>
                    <tr className="bg-yellow-50"><td className="p-2 border font-mono">FF E2</td><td className="p-2 border">APP2</td><td className="p-2 border">ICC Profile / MPF</td></tr>
                    <tr className="bg-red-50"><td className="p-2 border font-mono">FF ED</td><td className="p-2 border">APP13</td><td className="p-2 border">IPTC / Photoshop</td></tr>
                    <tr><td className="p-2 border font-mono">FF EE</td><td className="p-2 border">APP14</td><td className="p-2 border">Adobe color transform</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Red = metadata (removed), Yellow = optional preserve, Blue = required structure
              </p>
            </div>
          </section>

          {/* JFIF vs EXIF */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">JFIF vs EXIF</h2>
            <p className="text-muted-foreground mb-4">
              Here&apos;s something that confuses a lot of people: JPEG files often
              contain <em>two</em> different metadata standards at the same time.
              JFIF came first and handles basic stuff like resolution. Then cameras
              started adding EXIF data with all the detailed shooting information.
              Most modern JPEGs have both, which is why you&apos;ll see both APP0 and
              APP1 markers near the start of the file.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-orange-600 mb-2">
                  APP0:JFIF
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  JPEG File Interchange Format. Basic image information.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Version number</li>
                  <li>• Pixel density (DPI)</li>
                  <li>• Aspect ratio</li>
                  <li>• Optional thumbnail</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">
                  APP1:EXIF
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Exchangeable Image File Format. Camera metadata.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Camera make/model</li>
                  <li>• GPS coordinates</li>
                  <li>• Timestamps</li>
                  <li>• Exposure settings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* APP Markers Deep Dive */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">APP Markers Deep Dive</h2>
            <p className="text-muted-foreground mb-4">
              The JPEG spec reserved 16 &quot;application&quot; markers (APP0 through APP15)
              for vendors to use however they wanted. Over the years, different
              organizations claimed different markers for their metadata formats.
              The result is a bit of a mess, but at least it&apos;s a well-documented mess.
            </p>
            <p className="text-muted-foreground mb-6">
              The tricky part is that the same marker can mean different things
              depending on its content. APP1, for example, can be either EXIF or XMP
              data, so you have to look at the identifier string inside to know which one
              you&apos;re dealing with.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold">
                  APP0 (0xFFE0):JFIF
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifier: <code>JFIF\0</code>. Contains version, density
                  units, X/Y density, and optional embedded thumbnail. Generally
                  safe to preserve.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">
                  APP1 (0xFFE1):EXIF
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifier: <code>Exif\0\0</code>. Contains a complete TIFF
                  structure with IFD entries for camera info, GPS data,
                  timestamps, thumbnails, and maker notes.{" "}
                  <span className="text-red-600 font-medium">
                    Primary privacy concern.
                  </span>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">
                  APP1 (0xFFE1):XMP
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Identifier:{" "}
                  <code>http://ns.adobe.com/xap/1.0/\0</code>. XML-based
                  metadata standard by Adobe. Can contain editing history,
                  software info, and extended EXIF data.
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    XMP Namespaces
                  </summary>
                  <div className="mt-2 space-y-1 font-mono">
                    <div><code>xmp:</code> http://ns.adobe.com/xap/1.0/</div>
                    <div><code>xmpMM:</code> http://ns.adobe.com/xap/1.0/mm/</div>
                    <div><code>dc:</code> http://purl.org/dc/elements/1.1/</div>
                    <div><code>photoshop:</code> http://ns.adobe.com/photoshop/1.0/</div>
                    <div><code>tiff:</code> http://ns.adobe.com/tiff/1.0/</div>
                    <div><code>exif:</code> http://ns.adobe.com/exif/1.0/</div>
                  </div>
                </details>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold">
                  APP1 (0xFFE1):Extended XMP
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifier:{" "}
                  <code>http://ns.adobe.com/xmp/extension/\0</code>. For XMP data
                  exceeding 65KB, split across multiple APP1 segments.
                </p>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h3 className="font-semibold">
                  APP2 (0xFFE2):MPF
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifier: <code>MPF\0</code>. Multi-Picture Format for
                  stereoscopic images and panoramas.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">
                  APP2 (0xFFE2):ICC Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifier: <code>ICC_PROFILE\0</code>. Color management data.
                  Can be chunked across multiple APP2 markers.{" "}
                  <span className="text-green-600 font-medium">
                    Usually safe to preserve.
                  </span>
                </p>
              </div>

              <div className="border-l-4 border-yellow-600 pl-4">
                <h3 className="font-semibold">
                  APP13 (0xFFED):IPTC/Photoshop
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifier: <code>Photoshop 3.0\0</code>. Contains IPTC-IIM
                  data with captions, keywords, copyright, creator info. May
                  contain author information.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold">
                  APP14 (0xFFEE):Adobe
                </h3>
                <p className="text-sm text-muted-foreground">
                  Identifier: <code>Adobe\0</code>. Contains color transform
                  flags (RGB/CMYK). Important for proper color rendering.
                </p>
              </div>
            </div>
          </section>

          {/* EXIF Structure */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">EXIF Structure</h2>
            <p className="text-muted-foreground mb-4">
              Here&apos;s where it gets interesting (and a bit weird). EXIF data is
              actually a tiny TIFF file embedded inside your JPEG. Yes, really. It
              has its own header, its own byte order, and uses TIFF&apos;s IFD (Image
              File Directory) structure to store tags.
            </p>
            <p className="text-muted-foreground mb-4">
              The first thing you&apos;ll see after the &quot;Exif&quot; identifier is a TIFF
              header that tells you whether the data is little-endian (Intel, &quot;II&quot;)
              or big-endian (Motorola, &quot;MM&quot;). Getting this wrong means all your
              numbers will be garbage, so it&apos;s the first thing any parser checks.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">TIFF Header (8 bytes)</h3>
              <HexViewer
                data="49 49 2A 00 08 00 00 00"
                annotations={[
                  { start: 0, end: 1, label: "Byte Order (II = Little Endian)", color: "blue" },
                  { start: 2, end: 3, label: "Magic Number (42)", color: "green" },
                  { start: 4, end: 7, label: "IFD0 Offset", color: "purple" },
                ]}
                bytesPerRow={8}
                showAscii={true}
              />
              <p className="text-sm text-muted-foreground mt-2">
                <code>II</code> = Intel (little-endian), <code>MM</code> =
                Motorola (big-endian)
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">IFD Entry Structure (12 bytes)</h3>
              <div className="font-mono text-sm bg-background p-3 rounded border">
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground mb-2">
                  <span>Tag ID</span>
                  <span>Type</span>
                  <span>Count</span>
                  <span>Value/Offset</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <span className="bg-blue-100 text-blue-800 rounded px-2 py-1">
                    2 bytes
                  </span>
                  <span className="bg-green-100 text-green-800 rounded px-2 py-1">
                    2 bytes
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 rounded px-2 py-1">
                    4 bytes
                  </span>
                  <span className="bg-purple-100 text-purple-800 rounded px-2 py-1">
                    4 bytes
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Key IFD Entries</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0x010F</code>:Make
                </div>
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0x0110</code>:Model
                </div>
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0x0132</code>:DateTime
                </div>
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0x8769</code>:ExifIFDPointer
                </div>
                <div className="p-3 border rounded">
                  <code className="text-red-600">0x8825</code>:GPSInfoIFDPointer
                </div>
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0x927C</code>:MakerNote
                </div>
              </div>
            </div>
          </section>

          {/* How PicScrub Processes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How PicScrub Processes JPEG
            </h2>
            <p className="text-muted-foreground mb-4">
              The approach is pretty straightforward: we read through the file
              marker by marker, keep the ones that are essential for displaying
              the image, and skip the ones that contain metadata. Since we never
              touch the compressed image data, there&apos;s zero quality loss.
            </p>
            <p className="text-muted-foreground mb-6">
              The key insight is that JPEG&apos;s marker-based structure makes this
              easy. We don&apos;t need to understand DCT coefficients or Huffman
              tables. We just need to identify which segments are metadata and
              which aren&apos;t.
            </p>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Validate Header</p>
                  <p className="text-sm text-muted-foreground">
                    Verify SOI marker (<code>FF D8</code>) at file start
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Parse Markers</p>
                  <p className="text-sm text-muted-foreground">
                    Read each marker sequentially, extracting type and length
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Identify Metadata</p>
                  <p className="text-sm text-muted-foreground">
                    Check identifiers in APP segments (EXIF, XMP, IPTC, etc.)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Selective Copy</p>
                  <p className="text-sm text-muted-foreground">
                    Copy non-metadata segments to output, skip metadata segments
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                What&apos;s Preserved
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• SOI/EOI markers (required)</li>
                <li>• DQT (quantization tables)</li>
                <li>• SOF (frame header)</li>
                <li>• DHT (Huffman tables)</li>
                <li>• SOS and scan data (actual image)</li>
                <li>• Optional: ICC color profile (configurable)</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">
                What&apos;s Removed
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• APP1 EXIF (camera, GPS, timestamps)</li>
                <li>• APP1 XMP (editing metadata)</li>
                <li>• APP13 IPTC (captions, author)</li>
                <li>• COM markers (comments)</li>
                <li>• EXIF thumbnail images</li>
              </ul>
            </div>
          </section>

          {/* Complete EXIF Tag Reference */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">EXIF Tag Reference</h2>
            <p className="text-muted-foreground mb-4">
              Not all EXIF tags are created equal when it comes to privacy. Some,
              like exposure settings, are pretty harmless. Others, like serial
              numbers and owner names, can uniquely identify you or your equipment.
              Here are the ones we consider high-risk:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border">Tag ID</th>
                    <th className="text-left p-2 border">Name</th>
                    <th className="text-left p-2 border">Privacy Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border font-mono">0x9003</td><td className="p-2 border">DateTimeOriginal</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0x9004</td><td className="p-2 border">DateTimeDigitized</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0x9010</td><td className="p-2 border">OffsetTime</td><td className="p-2 border text-yellow-600">Medium</td></tr>
                  <tr><td className="p-2 border font-mono">0x9286</td><td className="p-2 border">UserComment</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0x927C</td><td className="p-2 border">MakerNote</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0xA420</td><td className="p-2 border">ImageUniqueID</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0xA430</td><td className="p-2 border">CameraOwnerName</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0xA431</td><td className="p-2 border">BodySerialNumber</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0xA434</td><td className="p-2 border">LensModel</td><td className="p-2 border text-yellow-600">Medium</td></tr>
                  <tr><td className="p-2 border font-mono">0xA435</td><td className="p-2 border">LensSerialNumber</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0xFDE8</td><td className="p-2 border">OwnerName</td><td className="p-2 border text-red-600">High</td></tr>
                  <tr><td className="p-2 border font-mono">0xFDE9</td><td className="p-2 border">SerialNumber</td><td className="p-2 border text-red-600">High</td></tr>
                </tbody>
              </table>
            </div>

            <details className="border rounded-lg">
              <summary className="p-3 font-semibold cursor-pointer hover:bg-muted/50">
                View all camera setting tags (non-identifying)
              </summary>
              <div className="p-3 border-t grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div><code>0x829A</code> ExposureTime</div>
                <div><code>0x829D</code> FNumber</div>
                <div><code>0x8822</code> ExposureProgram</div>
                <div><code>0x8827</code> ISOSpeedRatings</div>
                <div><code>0x9201</code> ShutterSpeedValue</div>
                <div><code>0x9202</code> ApertureValue</div>
                <div><code>0x9203</code> BrightnessValue</div>
                <div><code>0x9204</code> ExposureBiasValue</div>
                <div><code>0x9207</code> MeteringMode</div>
                <div><code>0x9208</code> LightSource</div>
                <div><code>0x9209</code> Flash</div>
                <div><code>0x920A</code> FocalLength</div>
                <div><code>0xA001</code> ColorSpace</div>
                <div><code>0xA002</code> PixelXDimension</div>
                <div><code>0xA003</code> PixelYDimension</div>
                <div><code>0xA402</code> ExposureMode</div>
                <div><code>0xA403</code> WhiteBalance</div>
                <div><code>0xA405</code> FocalLengthIn35mmFilm</div>
                <div><code>0xA406</code> SceneCaptureType</div>
              </div>
            </details>
          </section>

          {/* GPS Tag Reference */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">GPS Tag Reference</h2>
            <p className="text-muted-foreground mb-4">
              GPS data lives in its own sub-IFD, pointed to by tag <code>0x8825</code> in
              the main IFD. If that pointer exists, there&apos;s location data in your
              image. Modern smartphones are particularly aggressive about embedding
              this, often with enough precision to pinpoint exactly where you were
              standing.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-red-100">
                    <th className="text-left p-2 border">Tag ID</th>
                    <th className="text-left p-2 border">Name</th>
                    <th className="text-left p-2 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border font-mono">0x0000</td><td className="p-2 border">GPSVersionID</td><td className="p-2 border text-muted-foreground">GPS tag version</td></tr>
                  <tr><td className="p-2 border font-mono">0x0001</td><td className="p-2 border">GPSLatitudeRef</td><td className="p-2 border text-muted-foreground">N or S</td></tr>
                  <tr><td className="p-2 border font-mono">0x0002</td><td className="p-2 border">GPSLatitude</td><td className="p-2 border text-muted-foreground">Degrees, minutes, seconds</td></tr>
                  <tr><td className="p-2 border font-mono">0x0003</td><td className="p-2 border">GPSLongitudeRef</td><td className="p-2 border text-muted-foreground">E or W</td></tr>
                  <tr><td className="p-2 border font-mono">0x0004</td><td className="p-2 border">GPSLongitude</td><td className="p-2 border text-muted-foreground">Degrees, minutes, seconds</td></tr>
                  <tr><td className="p-2 border font-mono">0x0005</td><td className="p-2 border">GPSAltitudeRef</td><td className="p-2 border text-muted-foreground">Above/below sea level</td></tr>
                  <tr><td className="p-2 border font-mono">0x0006</td><td className="p-2 border">GPSAltitude</td><td className="p-2 border text-muted-foreground">Meters</td></tr>
                  <tr><td className="p-2 border font-mono">0x0007</td><td className="p-2 border">GPSTimeStamp</td><td className="p-2 border text-muted-foreground">UTC time</td></tr>
                  <tr><td className="p-2 border font-mono">0x001D</td><td className="p-2 border">GPSDateStamp</td><td className="p-2 border text-muted-foreground">UTC date</td></tr>
                  <tr><td className="p-2 border font-mono">0x0012</td><td className="p-2 border">GPSMapDatum</td><td className="p-2 border text-muted-foreground">Geodetic survey data</td></tr>
                  <tr><td className="p-2 border font-mono">0x001B</td><td className="p-2 border">GPSProcessingMethod</td><td className="p-2 border text-muted-foreground">GPS/CELLID/WLAN/MANUAL</td></tr>
                  <tr><td className="p-2 border font-mono">0x001C</td><td className="p-2 border">GPSAreaInformation</td><td className="p-2 border text-muted-foreground">Location name</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* IPTC Tag Reference */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">IPTC Tag Reference</h2>
            <p className="text-muted-foreground mb-4">
              IPTC was designed for news agencies to embed captions, credits, and
              copyright info. It&apos;s stored inside APP13 with a &quot;Photoshop 3.0&quot;
              identifier (yes, Adobe adopted it). If you&apos;ve ever added copyright
              info or keywords in Lightroom or Photoshop, this is where it ends up.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x0250</code> By-line (Author)
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x0255</code> By-line Title
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x025A</code> City
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x025C</code> Sub-location
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x025F</code> Province/State
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x0265</code> Country Name
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x0274</code> Copyright Notice
              </div>
              <div className="p-3 border border-red-200 bg-red-50 rounded">
                <code className="text-red-600">0x0276</code> Contact
              </div>
              <div className="p-3 border border-yellow-200 bg-yellow-50 rounded">
                <code className="text-yellow-600">0x0237</code> Date Created
              </div>
              <div className="p-3 border border-yellow-200 bg-yellow-50 rounded">
                <code className="text-yellow-600">0x023C</code> Time Created
              </div>
              <div className="p-3 border rounded">
                <code className="text-blue-600">0x0278</code> Caption/Abstract
              </div>
              <div className="p-3 border rounded">
                <code className="text-blue-600">0x0219</code> Keywords
              </div>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
