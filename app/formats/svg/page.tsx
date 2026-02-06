import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "SVG Format Deep Dive - PicScrub",
  description:
    "Technical guide to SVG file structure, XML metadata, editor namespaces, and how PicScrub removes metadata while preserving vector graphics.",
};

export default function SVGPage() {
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
          <div className="p-3 rounded-lg bg-pink-500 text-white">
            <Code2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">SVG Format</h1>
            <p className="text-muted-foreground">Scalable Vector Graphics</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">XML Structure</h2>
            <p className="text-muted-foreground mb-4">
              SVG stands apart from every other format on this site because
              it&apos;s not binary, it&apos;s just XML text. You can open an SVG in a
              text editor and read it. This makes metadata removal conceptually
              simpler, but it also means there are more places for information
              to hide.
            </p>
            <p className="text-muted-foreground mb-6">
              Metadata can appear as dedicated elements, attributes on any
              element, XML comments, or processing instructions. Vector
              editors love to stuff their own data into SVG files.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Basic SVG Structure</h3>
              <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="100" height="100" viewBox="0 0 100 100">

  <!-- Metadata elements -->
  <title>My Drawing</title>
  <desc>Created by John Doe</desc>
  <metadata>
    <rdf:RDF xmlns:rdf="...">
      <!-- RDF/Dublin Core metadata -->
    </rdf:RDF>
  </metadata>

  <!-- Vector content -->
  <circle cx="50" cy="50" r="40" fill="red"/>
</svg>`}</pre>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Key Elements</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  <code>&lt;svg&gt;</code>:Root element with viewBox and
                  dimensions
                </li>
                <li>
                  <code>xmlns</code>:Namespace declarations
                </li>
                <li>
                  <code>&lt;defs&gt;</code>:Reusable definitions (gradients,
                  patterns)
                </li>
                <li>
                  <code>&lt;g&gt;</code>:Grouping element
                </li>
              </ul>
            </div>
          </section>

          {/* Metadata Elements */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Metadata Elements</h2>
            <p className="text-muted-foreground mb-6">
              The SVG spec defines several ways to attach metadata, and different
              tools use different approaches. Some are obvious (there&apos;s literally
              a <code>&lt;metadata&gt;</code> element), others are more subtle.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">&lt;metadata&gt;</h3>
                <p className="text-sm text-muted-foreground">
                  Container for structured metadata, typically RDF/Dublin Core.
                  Can contain creator name, creation date, rights, and more.
                </p>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
{`<metadata>
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
           xmlns:dc="http://purl.org/dc/elements/1.1/">
    <rdf:Description>
      <dc:creator>John Doe</dc:creator>
      <dc:date>2024-01-15</dc:date>
    </rdf:Description>
  </rdf:RDF>
</metadata>`}</pre>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">&lt;title&gt;</h3>
                <p className="text-sm text-muted-foreground">
                  Human-readable title for the SVG or individual elements. Often
                  used for accessibility but can reveal document purpose.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">&lt;desc&gt;</h3>
                <p className="text-sm text-muted-foreground">
                  Description element. Can contain detailed information about
                  the image, creator, or purpose.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">XML Comments</h3>
                <p className="text-sm text-muted-foreground">
                  <code>&lt;!-- comment --&gt;</code> can contain author notes,
                  creation dates, software info, or debug information.
                </p>
              </div>
            </div>
          </section>

          {/* Editor Namespaces */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Editor Namespaces</h2>
            <p className="text-muted-foreground mb-6">
              This is where SVG gets messy. Every vector editor adds its own
              namespaced attributes to store features that SVG doesn&apos;t support
              natively. Open an Inkscape file and you&apos;ll see <code>inkscape:</code>{" "}
              and <code>sodipodi:</code> attributes everywhere. These aren&apos;t
              privacy risks per se, but they do fingerprint your software.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">inkscape:* / sodipodi:*</h3>
                <p className="text-sm text-muted-foreground">
                  Inkscape adds namespaced attributes for layer names, guide
                  positions, document settings, and edit history.
                </p>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
{`<svg xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
     inkscape:version="1.2"
     sodipodi:docname="my-drawing.svg">
  <sodipodi:namedview inkscape:current-layer="layer1"/>
</svg>`}</pre>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Adobe Illustrator</h3>
                <p className="text-sm text-muted-foreground">
                  Illustrator embeds extensive metadata including version,
                  artboard settings, and sometimes full AI format data.
                </p>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
{`xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/"
xmlns:x="http://ns.adobe.com/Extensibility/1.0/"`}</pre>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">Sketch / Figma</h3>
                <p className="text-sm text-muted-foreground">
                  Modern design tools may embed layer names, component IDs, and
                  export settings in custom attributes.
                </p>
              </div>
            </div>
          </section>

          {/* Processing Instructions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Processing Instructions</h2>
            <p className="text-muted-foreground mb-4">
              XML processing instructions (<code>&lt;?...?&gt;</code>) at the
              start of SVG files can contain software identification.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/css" href="style.css"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->`}</pre>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Preserved vs Removed
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • <code>&lt;?xml ...?&gt;</code> declaration:Preserved
                  (required)
                </li>
                <li>
                  • <code>&lt;?xml-stylesheet ...?&gt;</code>:Preserved
                  (functional)
                </li>
                <li>
                  • Other processing instructions:Removed
                </li>
              </ul>
            </div>
          </section>

          {/* DOM-Based Processing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">DOM-Based Processing</h2>
            <p className="text-muted-foreground mb-6">
              Since SVG is valid XML, we can parse it into a DOM tree and
              surgically remove what we don&apos;t want. This is more precise than
              regex-based approaches and won&apos;t accidentally break valid content.
            </p>

            <div>
              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">1</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Parse XML</p>
                  <p className="text-sm text-muted-foreground">
                    Parse SVG as XML document, preserving structure
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">2</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Remove Metadata Elements</p>
                  <p className="text-sm text-muted-foreground">
                    Delete &lt;metadata&gt;, &lt;title&gt;, &lt;desc&gt; elements
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">3</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Strip Editor Attributes</p>
                  <p className="text-sm text-muted-foreground">
                    Remove inkscape:*, sodipodi:*, and other editor namespaces
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">4</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Remove Comments</p>
                  <p className="text-sm text-muted-foreground">
                    Strip all XML comments from the document
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">5</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Clean Namespaces</p>
                  <p className="text-sm text-muted-foreground">
                    Remove unused namespace declarations from root element
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">6</div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Serialize</p>
                  <p className="text-sm text-muted-foreground">
                    Write cleaned XML back as SVG file
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What's Preserved/Removed */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Processing Summary</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Preserved</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• All vector graphics (paths, shapes, text)</li>
                  <li>• Styles and CSS</li>
                  <li>• Gradients and patterns</li>
                  <li>• Filters and effects</li>
                  <li>• Embedded images (referenced)</li>
                  <li>• viewBox and dimensions</li>
                  <li>• Standard SVG namespaces</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Removed</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• &lt;metadata&gt; element</li>
                  <li>• &lt;title&gt; element</li>
                  <li>• &lt;desc&gt; element</li>
                  <li>• XML comments</li>
                  <li>• inkscape:* attributes</li>
                  <li>• sodipodi:* attributes</li>
                  <li>• Adobe/Sketch namespaces</li>
                  <li>• Unused namespace declarations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Embedded Images Warning */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Embedded Images</h2>
            <p className="text-muted-foreground mb-4">
              Here&apos;s a gotcha that catches people off guard: SVG files can
              embed raster images as base64 data URIs. Those embedded JPEGs
              or PNGs might have their own EXIF metadata hiding inside.
            </p>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Current Limitation
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                PicScrub currently removes SVG-level metadata but doesn&apos;t
                decode and process embedded raster images:
              </p>
              <pre className="text-xs bg-white/50 p-2 rounded overflow-x-auto">
{`<image href="data:image/jpeg;base64,/9j/4AAQ..." />`}</pre>
              <p className="text-sm text-yellow-700 mt-3">
                PicScrub currently does not process embedded raster images
                within SVG files. For complete privacy, extract and process
                embedded images separately.
              </p>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
