import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Layers } from "lucide-react";
import { HexViewer } from "@/components/HexViewer";
import { StructureDiagram } from "@/components/StructureDiagram";

export const metadata: Metadata = {
  title: "TIFF Format Deep Dive - PicScrub",
  description:
    "Technical guide to TIFF file structure, IFD entries, tag types, and how PicScrub removes metadata while preserving image quality.",
};

export default function TIFFPage() {
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
          <div className="p-3 rounded-lg bg-yellow-600 text-white">
            <Layers className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">TIFF Format</h1>
            <p className="text-muted-foreground">Tagged Image File Format</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Header Structure</h2>
            <p className="text-muted-foreground mb-4">
              TIFF is the grandfather of image metadata. When you see EXIF data
              in a JPEG, that&apos;s actually a TIFF structure embedded inside the
              file. Understanding TIFF means understanding how most image
              metadata works.
            </p>
            <p className="text-muted-foreground mb-6">
              The format starts with an 8-byte header that tells you two
              critical things: the byte order (Intel vs Motorola) and where
              to find the first IFD. From there, it&apos;s all pointer-chasing.
            </p>

            <StructureDiagram
              title="TIFF File Structure"
              sections={[
                { name: "Header", bytes: 8, color: "blue", description: "Byte order + magic + IFD offset" },
                { name: "IFD0", bytes: 200, color: "purple", description: "Main image directory" },
                { name: "Strip Data", bytes: "rest", color: "green", description: "Image pixel data" },
                { name: "EXIF IFD", bytes: 500, color: "red", description: "EXIF sub-directory" },
                { name: "GPS IFD", bytes: 100, color: "red", description: "GPS sub-directory" },
              ]}
            />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">TIFF Header</h3>
              <HexViewer
                data="49 49 2A 00 08 00 00 00"
                annotations={[
                  { start: 0, end: 1, label: "Byte Order (II = Little Endian)", color: "blue" },
                  { start: 2, end: 3, label: "Magic Number (42)", color: "green" },
                  { start: 4, end: 7, label: "First IFD Offset", color: "purple" },
                ]}
                bytesPerRow={8}
                showAscii={true}
              />
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Byte Order</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <code className="text-blue-600">49 49</code> (II)
                  <p className="text-muted-foreground">
                    Intel:Little-endian (least significant byte first)
                  </p>
                </div>
                <div>
                  <code className="text-blue-600">4D 4D</code> (MM)
                  <p className="text-muted-foreground">
                    Motorola:Big-endian (most significant byte first)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* IFD Structure */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">IFD Structure</h2>
            <p className="text-muted-foreground mb-4">
              IFD stands for Image File Directory, but think of it as a table
              of contents. It&apos;s a flat list of tags, each pointing to some
              piece of data. The clever part is that IFDs can point to other
              IFDs, creating a tree structure.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-3">IFD Layout</h4>
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded w-24 text-center">
                    2 bytes
                  </span>
                  <span>Entry count (number of tags)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded w-24 text-center">
                    12 × N bytes
                  </span>
                  <span>Tag entries (12 bytes each)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded w-24 text-center">
                    4 bytes
                  </span>
                  <span>Next IFD offset (0 if none)</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Tag Entry Structure (12 bytes)</h4>
              <div className="font-mono text-sm">
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
              <p className="text-sm text-muted-foreground mt-3">
                If data fits in 4 bytes, it&apos;s stored directly in the value
                field. Otherwise, value field contains an offset to the data.
              </p>
            </div>
          </section>

          {/* Tag Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Tag Types</h2>
            <p className="text-muted-foreground mb-4">
              TIFF is strongly typed. Each tag specifies not just what it
              contains, but how to interpret the bytes. This is why you need
              to understand the type system to parse TIFF correctly.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border">ID</th>
                    <th className="text-left p-2 border">Name</th>
                    <th className="text-left p-2 border">Size</th>
                    <th className="text-left p-2 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border font-mono">1</td><td className="p-2 border">BYTE</td><td className="p-2 border">1</td><td className="p-2 border">Unsigned 8-bit integer</td></tr>
                  <tr><td className="p-2 border font-mono">2</td><td className="p-2 border">ASCII</td><td className="p-2 border">1</td><td className="p-2 border">Null-terminated string (8-bit)</td></tr>
                  <tr><td className="p-2 border font-mono">3</td><td className="p-2 border">SHORT</td><td className="p-2 border">2</td><td className="p-2 border">Unsigned 16-bit integer</td></tr>
                  <tr><td className="p-2 border font-mono">4</td><td className="p-2 border">LONG</td><td className="p-2 border">4</td><td className="p-2 border">Unsigned 32-bit integer</td></tr>
                  <tr><td className="p-2 border font-mono">5</td><td className="p-2 border">RATIONAL</td><td className="p-2 border">8</td><td className="p-2 border">Two LONGs: numerator/denominator</td></tr>
                  <tr><td className="p-2 border font-mono">6</td><td className="p-2 border">SBYTE</td><td className="p-2 border">1</td><td className="p-2 border">Signed 8-bit integer</td></tr>
                  <tr><td className="p-2 border font-mono">7</td><td className="p-2 border">UNDEFINED</td><td className="p-2 border">1</td><td className="p-2 border">Raw bytes (binary data)</td></tr>
                  <tr><td className="p-2 border font-mono">8</td><td className="p-2 border">SSHORT</td><td className="p-2 border">2</td><td className="p-2 border">Signed 16-bit integer</td></tr>
                  <tr><td className="p-2 border font-mono">9</td><td className="p-2 border">SLONG</td><td className="p-2 border">4</td><td className="p-2 border">Signed 32-bit integer</td></tr>
                  <tr><td className="p-2 border font-mono">10</td><td className="p-2 border">SRATIONAL</td><td className="p-2 border">8</td><td className="p-2 border">Two SLONGs: signed num/denom</td></tr>
                  <tr><td className="p-2 border font-mono">11</td><td className="p-2 border">FLOAT</td><td className="p-2 border">4</td><td className="p-2 border">IEEE 32-bit float</td></tr>
                  <tr><td className="p-2 border font-mono">12</td><td className="p-2 border">DOUBLE</td><td className="p-2 border">8</td><td className="p-2 border">IEEE 64-bit double</td></tr>
                  <tr><td className="p-2 border font-mono">13</td><td className="p-2 border">IFD</td><td className="p-2 border">4</td><td className="p-2 border">Pointer to nested IFD</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Value Storage Rule</h4>
              <p className="text-sm text-blue-700">
                If <code>size × count ≤ 4</code> bytes, the value is stored directly
                in the 4-byte value field. Otherwise, the field contains an offset
                pointing to where the data is stored in the file.
              </p>
            </div>
          </section>

          {/* IFD Offset Calculations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">IFD Offset Calculations</h2>
            <p className="text-muted-foreground mb-4">
              The hardest part of parsing TIFF is following the offset chain.
              Everything is relative to the start of the file, and you&apos;ll
              be jumping around a lot. Here&apos;s how the math works:
            </p>

            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-3">
              <div>
                <span className="text-muted-foreground">// IFD0 location</span>
                <br />
                IFD0_offset = bytes[4:8] <span className="text-muted-foreground">// From TIFF header</span>
              </div>
              <div>
                <span className="text-muted-foreground">// Next IFD location (e.g., IFD1 for thumbnail)</span>
                <br />
                next_IFD = IFD0_offset + 2 + (entry_count × 12) + 4
              </div>
              <div>
                <span className="text-muted-foreground">// SubIFD location (EXIF, GPS)</span>
                <br />
                subIFD_offset = tag_value <span className="text-muted-foreground">// From pointer tag (0x8769, 0x8825)</span>
              </div>
            </div>
          </section>

          {/* Important Tags */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Important Tags</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">
                  Image Data Tags (Preserved)
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 border rounded">
                    <code className="text-blue-600">0x0100</code>:ImageWidth
                  </div>
                  <div className="p-3 border rounded">
                    <code className="text-blue-600">0x0101</code>:ImageLength
                  </div>
                  <div className="p-3 border rounded">
                    <code className="text-blue-600">0x0102</code>:BitsPerSample
                  </div>
                  <div className="p-3 border rounded">
                    <code className="text-blue-600">0x0103</code>:Compression
                  </div>
                  <div className="p-3 border rounded">
                    <code className="text-blue-600">0x0111</code>:StripOffsets
                  </div>
                  <div className="p-3 border rounded">
                    <code className="text-blue-600">0x0117</code>:StripByteCounts
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">
                  Metadata Tags (Removed)
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 border border-red-200 bg-red-50 rounded">
                    <code className="text-red-600">0x010F</code>:Make (camera manufacturer)
                  </div>
                  <div className="p-3 border border-red-200 bg-red-50 rounded">
                    <code className="text-red-600">0x0110</code>:Model (camera model)
                  </div>
                  <div className="p-3 border border-red-200 bg-red-50 rounded">
                    <code className="text-red-600">0x0132</code>:DateTime
                  </div>
                  <div className="p-3 border border-red-200 bg-red-50 rounded">
                    <code className="text-red-600">0x013B</code>:Artist
                  </div>
                  <div className="p-3 border border-red-200 bg-red-50 rounded">
                    <code className="text-red-600">0x8298</code>:Copyright
                  </div>
                  <div className="p-3 border border-red-200 bg-red-50 rounded">
                    <code className="text-red-600">0x9003</code>:DateTimeOriginal
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">
                  Pointer Tags (Sub-IFDs)
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 border border-purple-200 bg-purple-50 rounded">
                    <code className="text-purple-600">0x8769</code>:ExifIFDPointer
                  </div>
                  <div className="p-3 border border-purple-200 bg-purple-50 rounded">
                    <code className="text-purple-600">0x8825</code>:GPSInfoIFDPointer
                  </div>
                  <div className="p-3 border border-purple-200 bg-purple-50 rounded">
                    <code className="text-purple-600">0xA005</code>:InteroperabilityIFDPointer
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SubIFDs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">SubIFDs</h2>
            <p className="text-muted-foreground mb-4">
              The main IFD (IFD0) often contains &quot;pointer tags&quot; that reference
              sub-directories. This is how EXIF, GPS, and other metadata gets
              organized into logical groups while keeping the main IFD clean.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">EXIF SubIFD</h3>
                <p className="text-sm text-muted-foreground">
                  Contains camera-specific metadata: exposure, aperture, ISO,
                  focal length, flash, white balance, and more.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">GPS SubIFD</h3>
                <p className="text-sm text-muted-foreground">
                  Contains geolocation data: latitude, longitude, altitude,
                  timestamp, satellites, speed, direction.{" "}
                  <span className="text-red-600 font-medium">
                    Major privacy concern.
                  </span>
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold">Maker Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Proprietary camera data. Format varies by manufacturer.
                  May contain serial numbers, firmware version, custom settings.
                </p>
              </div>
            </div>
          </section>

          {/* How PicScrub Processes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How PicScrub Processes TIFF
            </h2>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Parse Header</p>
                  <p className="text-sm text-muted-foreground">
                    Determine byte order (II/MM) and locate first IFD
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Build Tag Whitelist</p>
                  <p className="text-sm text-muted-foreground">
                    Identify essential tags for image rendering
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Filter IFD Entries</p>
                  <p className="text-sm text-muted-foreground">
                    Remove metadata tags, zero out SubIFD pointers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Rewrite File</p>
                  <p className="text-sm text-muted-foreground">
                    Reconstruct TIFF with clean IFDs and copied image data
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Offset Recalculation
              </h4>
              <p className="text-sm text-blue-700">
                TIFF files use file offsets extensively. When metadata is
                removed, PicScrub must recalculate all offsets to maintain file
                integrity.
              </p>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
