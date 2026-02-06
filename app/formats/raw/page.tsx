import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Camera } from "lucide-react";
import { HexViewer } from "@/components/HexViewer";
import { StructureDiagram } from "@/components/StructureDiagram";

export const metadata: Metadata = {
  title: "RAW Format Deep Dive - PicScrub",
  description:
    "Technical guide to RAW camera formats including DNG, CR2, NEF, and ARW. Learn about TIFF-based structure and metadata removal.",
};

export default function RAWPage() {
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
          <div className="p-3 rounded-lg bg-gray-600 text-white">
            <Camera className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">RAW Formats</h1>
            <p className="text-muted-foreground">Camera Raw Image Formats</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              RAW files are the digital equivalent of film negatives. They
              contain the raw sensor data before any processing. This makes
              them ideal for professional editing, but it also means they
              carry extensive metadata about your camera and shooting conditions.
            </p>
            <p className="text-muted-foreground mb-6">
              The good news: most RAW formats are built on TIFF structure, so
              once you understand TIFF, you can navigate most RAW files. The
              bad news: every camera manufacturer adds their own proprietary
              extensions.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">
                  Open Standard
                </h3>
                <p className="text-sm text-muted-foreground">
                  <strong>DNG</strong> (Digital Negative):Adobe&apos;s documented
                  RAW format
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-orange-600 mb-2">
                  Proprietary
                </h3>
                <p className="text-sm text-muted-foreground">
                  <strong>CR2/CR3</strong> (Canon), <strong>NEF</strong> (Nikon),
                  <strong> ARW</strong> (Sony), <strong>ORF</strong> (Olympus)
                </p>
              </div>
            </div>
          </section>

          {/* DNG Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              DNG (Adobe Digital Negative)
            </h2>
            <p className="text-muted-foreground mb-4">
              DNG is Adobe&apos;s attempt to create a universal RAW format, and it&apos;s
              the only fully documented one. If you have a choice, DNG is the
              easiest to work with because the spec is public.
            </p>
            <p className="text-muted-foreground mb-6">
              Under the hood, it&apos;s TIFF with extra tags for camera-specific
              color data. This makes it straightforward to parse with any
              TIFF-aware tool.
            </p>

            <StructureDiagram
              title="DNG File Structure"
              sections={[
                { name: "TIFF Header", bytes: 8, color: "blue", description: "II/MM + magic + IFD offset" },
                { name: "IFD0", bytes: 500, color: "purple", description: "Main image directory" },
                { name: "EXIF IFD", bytes: 1000, color: "red", description: "Camera metadata" },
                { name: "SubIFDs", bytes: 500, color: "orange", description: "Reduced resolution images" },
                { name: "Raw Data", bytes: "rest", color: "green", description: "Sensor data" },
              ]}
            />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">DNG Header</h3>
              <HexViewer
                data="49 49 2A 00 08 00 00 00"
                annotations={[
                  { start: 0, end: 1, label: "Byte Order (Little Endian)", color: "blue" },
                  { start: 2, end: 3, label: "TIFF Magic (42)", color: "green" },
                  { start: 4, end: 7, label: "IFD0 Offset", color: "purple" },
                ]}
                bytesPerRow={8}
                showAscii={true}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">DNG-Specific Tags</h4>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0xC612</code>:DNGVersion
                </div>
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0xC614</code>:UniqueCameraModel
                </div>
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0xC621</code>:ColorMatrix1
                </div>
                <div className="p-3 border rounded">
                  <code className="text-blue-600">0xC65A</code>:CalibrationIlluminant1
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                Full DNG Support
              </h4>
              <p className="text-sm text-green-700">
                PicScrub fully supports DNG files. Because DNG uses standard
                TIFF structure, we can remove EXIF, GPS, and other metadata
                using the same approach as regular TIFF files.
              </p>
            </div>
          </section>

          {/* Proprietary Formats */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Proprietary Formats</h2>
            <p className="text-muted-foreground mb-6">
              Here&apos;s where things get complicated. Every camera manufacturer
              has their own RAW format, and while most are TIFF-based, they all
              have quirks. The community has reverse-engineered most of these,
              but documentation is scattered across various projects.
            </p>

            <div className="space-y-6">
              {/* CR2 */}
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">CR2 (Canon)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  TIFF-based with Canon-specific IFDs and lossless JPEG
                  compression for sensor data.
                </p>
                <div className="bg-muted/50 p-3 rounded text-sm">
                  <strong>Signature:</strong>{" "}
                  <code>49 49 2A 00 ... 43 52 02 00</code> (II + &quot;CR&quot; + version)
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <strong>Note:</strong> CR3 (newer Canon format) uses ISOBMFF
                  container like HEIC.
                </div>
              </div>

              {/* NEF */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold">NEF (Nikon)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  TIFF-based, typically big-endian (MM). Contains extensive
                  Maker Notes with proprietary Nikon metadata.
                </p>
                <div className="bg-muted/50 p-3 rounded text-sm">
                  <strong>Byte order:</strong> Usually big-endian (4D 4D)
                </div>
              </div>

              {/* ARW */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold">ARW (Sony)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  TIFF-based with Sony-specific modifications. Contains multiple
                  image strips and proprietary encryption in some models.
                </p>
              </div>

              {/* Others */}
              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-semibold">Other Formats</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>
                    • <strong>ORF</strong> (Olympus):TIFF-based
                  </li>
                  <li>
                    • <strong>RAF</strong> (Fujifilm):Custom structure
                  </li>
                  <li>
                    • <strong>RW2</strong> (Panasonic):TIFF-based
                  </li>
                  <li>
                    • <strong>PEF</strong> (Pentax):TIFF-based
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Embedded JPEG Previews */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Embedded JPEG Previews</h2>
            <p className="text-muted-foreground mb-4">
              Something that catches people off guard: RAW files usually
              contain full JPEG previews. Your camera generates these so you
              can quickly review shots on the LCD. They&apos;re also what file
              browsers use for thumbnails.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-2">Why Previews Exist</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Camera LCD</strong>:Quick review without
                  processing RAW
                </li>
                <li>
                  • <strong>Thumbnails</strong>:File browser previews
                </li>
                <li>
                  • <strong>Quick edit</strong>:Faster initial load in editors
                </li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Privacy Consideration
              </h4>
              <p className="text-sm text-yellow-700">
                Embedded JPEG previews often contain the same EXIF metadata as
                the main image, including GPS coordinates. PicScrub processes
                these embedded images along with the main file.
              </p>
            </div>
          </section>

          {/* Maker Notes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Maker Notes</h2>
            <p className="text-muted-foreground mb-4">
              Maker Notes are the wild west of camera metadata. Each
              manufacturer stuffs whatever they want into this blob, and the
              format isn&apos;t documented. Some even encrypt portions of it.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">
                  Privacy Concerns
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Camera serial number</li>
                  <li>• Lens serial number</li>
                  <li>• Internal firmware version</li>
                  <li>• Shutter count</li>
                  <li>• Focus point used</li>
                  <li>• Custom settings</li>
                </ul>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Processing Challenge
                </h4>
                <p className="text-sm text-blue-700">
                  Maker Notes use undocumented, proprietary formats. Some are
                  encrypted. Complete removal requires understanding each
                  manufacturer&apos;s format.
                </p>
              </div>
            </div>

            {/* Manufacturer Tag Ranges */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">
                Manufacturer-Specific Tag Ranges
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2 border">Manufacturer</th>
                      <th className="text-left p-2 border">Tag Range</th>
                      <th className="text-left p-2 border">Notable Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border font-medium">Sony</td>
                      <td className="p-2 border font-mono text-xs">0x7000–0x74C8</td>
                      <td className="p-2 border text-muted-foreground text-xs">SonyRawFileType, VignettingCorrection, DistortionCorrection</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Canon</td>
                      <td className="p-2 border font-mono text-xs">0xC5E0</td>
                      <td className="p-2 border text-muted-foreground text-xs">CR2CFAPattern</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Nikon</td>
                      <td className="p-2 border font-mono text-xs">0xC7D5</td>
                      <td className="p-2 border text-muted-foreground text-xs">NikonNEFInfo</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Hasselblad</td>
                      <td className="p-2 border font-mono text-xs">0xB4C3, 0xC51B</td>
                      <td className="p-2 border text-muted-foreground text-xs">HasselbladRawImage, HasselbladExif</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Panasonic</td>
                      <td className="p-2 border font-mono text-xs">0xC6D2–0xC6D3</td>
                      <td className="p-2 border text-muted-foreground text-xs">PanasonicTitle, PanasonicTitle2</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Adobe DNG</td>
                      <td className="p-2 border font-mono text-xs">0xC612–0xC7A8</td>
                      <td className="p-2 border text-muted-foreground text-xs">DNGVersion, ColorMatrix, CalibrationIlluminant</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* How PicScrub Processes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How PicScrub Processes RAW
            </h2>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Identify Format</p>
                  <p className="text-sm text-muted-foreground">
                    Check header for TIFF structure and format-specific signatures
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Parse TIFF Structure</p>
                  <p className="text-sm text-muted-foreground">
                    Navigate IFD chain, identify EXIF, GPS, and Maker Note locations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Process Embedded JPEGs</p>
                  <p className="text-sm text-muted-foreground">
                    Locate and clean JPEG previews at various resolutions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Remove/Zero Metadata</p>
                  <p className="text-sm text-muted-foreground">
                    Remove metadata tags or zero their contents
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">5</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Preserve Raw Data</p>
                  <p className="text-sm text-muted-foreground">
                    Keep sensor data and essential color/calibration tags intact
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Preserved
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Raw sensor data</li>
                  <li>• Color matrices</li>
                  <li>• Camera calibration</li>
                  <li>• White balance coefficients</li>
                  <li>• Active area definition</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Removed</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• EXIF metadata</li>
                  <li>• GPS coordinates</li>
                  <li>• Maker Notes</li>
                  <li>• Embedded JPEG metadata</li>
                  <li>• Serial numbers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conversion Recommendation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">DNG Conversion</h2>
            <p className="text-muted-foreground mb-4">
              If you&apos;re sharing RAW files and want to ensure clean metadata
              removal, consider converting to DNG first.
            </p>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Recommended Workflow
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                DNG conversion strips out proprietary structures while
                preserving the actual image data:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Convert to DNG using Adobe DNG Converter (free)</li>
                <li>Process with PicScrub to remove metadata</li>
                <li>Share the cleaned DNG file</li>
              </ol>
              <p className="text-xs text-blue-600 mt-3">
                This ensures the recipient can open the file without proprietary
                software, and all metadata is cleanly removed.
              </p>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
