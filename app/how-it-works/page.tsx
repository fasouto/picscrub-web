import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnnotatedPhoto } from "@/components/AnnotatedPhoto";
import { Github } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works - PicScrub",
  description:
    "Learn how PicScrub removes metadata from images. Understand the privacy risks of image metadata and how we solve them.",
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">How It Works</h1>
        </header>

        {/* Introduction with annotated photo */}
        <section className="mb-16">
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Every digital photo carries more than just the image. Embedded within the file
            is invisible information: where you were standing, what device you used,
            and exactly when the shutter clicked. This data, called <strong className="text-foreground">metadata</strong>,
            was designed to help photographers organize their work. But when you share photos
            online, it becomes a privacy risk.
          </p>

          {/* Annotated photo illustration */}
          <AnnotatedPhoto />

          <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
            Most social media platforms strip metadata automatically, so this isn't
            always a concern. But email attachments, cloud storage links, forums, and
            personal websites often preserve the original file. If you prefer to control
            what information you share, it's worth cleaning your photos before uploading.
          </p>
        </section>

        {/* What's hidden */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">What's Hidden in Your Photos</h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            When you drop a photo into the tool on our homepage, we scan it for metadata.
            Here's what we typically find and remove:
          </p>

          <div className="my-8 space-y-4">
            <MetadataItem
              label="GPS coordinates"
              annotation="your home address!"
              description="Exact latitude and longitude, accurate to a few meters. This reveals where you live, work, and travel."
            />
            <MetadataItem
              label="Timestamps"
              annotation="when you left"
              description="When the photo was taken, down to the second. This exposes your daily schedule and habits."
            />
            <MetadataItem
              label="Device information"
              annotation="tracks you across photos"
              description="Camera make, model, lens, and sometimes serial numbers. This can identify you across different photos."
            />
            <MetadataItem
              label="Editing history"
              annotation="your name is in here"
              description="Software used, author name, copyright claims. Added by tools like Photoshop or Lightroom."
            />
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-12">How We Remove It</h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            When you use PicScrub, here's what happens:
          </p>

          <div className="my-8">
            <ProcessStep
              number={1}
              title="Your image stays on your device"
              description="The processing happens entirely in your browser using JavaScript. You can verify this by disconnecting from the internet: the tool still works."
            />
            <ProcessStep
              number={2}
              title="We detect the format"
              description="Each format stores metadata differently, so we use format-specific techniques."
            />
            <ProcessStep
              number={3}
              title="Metadata is surgically removed"
              description="We don't re-encode your image (which would degrade quality). Instead, we skip over the metadata segments and reconstruct the file with only the image data."
            />
            <ProcessStep
              number={4}
              title="You download the clean file"
              description="Same image, same quality, smaller file size (metadata can add 10-50KB), no hidden data."
            />
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-12">Lossless Quality</h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Most metadata removal tools re-encode your image, which degrades quality slightly
            each time. We take a different approach.
          </p>

          <div className="my-8 p-6 bg-muted/50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <p className="font-medium mb-2">Other tools</p>
                <div className="bg-white rounded border p-4 mb-2">
                  <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center text-sm text-gray-500">
                    Re-encoded image
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Quality: ~95%</p>
              </div>
              <div className="text-center">
                <p className="font-medium mb-2">PicScrub</p>
                <div className="bg-white rounded border p-4 mb-2 ring-2 ring-primary ring-offset-2">
                  <div className="w-full h-24 bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center text-sm text-green-700">
                    Original pixels
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Quality: 100%</p>
              </div>
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mt-8">
            Think of it this way: other tools photocopy your document to remove the sticky notes.
            We carefully peel off the sticky notes and hand you back the original.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-12">Privacy by Architecture</h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            We say your images never leave your device, but that's not just a promise, it's
            how the tool is built. There's no server receiving your photos. There's no upload
            happening in the background. The code runs locally in your browser.
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            This means we <em>can't</em> see your photos, even if we wanted to. Privacy is
            guaranteed by architecture, not policy.
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            The entire codebase is open source. You can inspect exactly what happens to your
            images, audit the code for security, or run it yourself.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-12">Limitations</h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            While PicScrub handles most common scenarios well, there are some technical
            constraints worth knowing about:
          </p>

          <div className="my-8 space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">HEIC files keep their original size</p>
              <p className="text-muted-foreground">
                HEIC uses the ISOBMFF container (same as MP4), where many internal offsets
                depend on exact byte positions. Removing bytes would break the file. Instead,
                we overwrite metadata with zeros, which destroys the sensitive data but
                doesn't reduce file size.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Proprietary RAW formats return a JPEG</p>
              <p className="text-muted-foreground">
                Formats like CR2, NEF, and ARW are undocumented and manufacturer-specific.
                Rather than risk corrupting your files, we extract the embedded JPEG preview
                (which most cameras include at full resolution) and clean that instead.
                DNG files are fully supported since they use the documented TIFF structure.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Color profiles are removed by default</p>
              <p className="text-muted-foreground">
                ICC color profiles are technically metadata and are stripped by default. For
                most web use this doesn't matter, but if you're working with color-calibrated
                workflows (print, professional photography), you can use the <code className="text-sm bg-white px-1.5 py-0.5 rounded">preserveIcc</code> option
                to keep the color profile intact.
              </p>
            </div>
          </div>
        </section>

        {/* CTA to try the tool */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center mb-16">
          <h3 className="text-xl font-bold mb-3">Try it yourself</h3>
          <p className="text-muted-foreground mb-6">
            Drop an image and see what metadata we find.
          </p>
          <Button asChild>
            <Link href="/">Remove Metadata Now</Link>
          </Button>
        </div>

        {/* Format-Specific Details */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Format-Specific Details</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Each image format stores metadata differently. The techniques that work for JPEG
            don&apos;t apply to PNG or SVG. We have detailed guides for each format:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["JPEG", "PNG", "WebP", "GIF", "SVG", "TIFF", "HEIC", "RAW"].map((format) => (
              <Link
                key={format}
                href={`/formats/${format.toLowerCase()}`}
                className="p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center font-medium"
              >
                {format}
              </Link>
            ))}
          </div>
        </section>

        {/* Developer Section */}
        <section className="mt-16 pt-16 border-t">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-3">For Developers</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              PicScrub is available as an open-source library. Use it in your own projects
              with full TypeScript support, or contribute to the codebase.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/fasouto/picscrub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://www.npmjs.com/package/picscrub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm package
                </a>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}

function MetadataItem({
  label,
  annotation,
  description
}: {
  label: string;
  annotation: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 bg-muted/50 rounded-lg relative">
      <div className="flex-1">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <span className="font-[family-name:var(--font-caveat)] text-[oklch(0.738_0.173_81)] text-2xl font-bold whitespace-nowrap self-center -rotate-2">
        ← {annotation}
      </span>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-5 mb-6 last:mb-0">
      <div className="flex-shrink-0 text-7xl font-black text-[oklch(0.92_0.01_81)]">
        {number}
      </div>
      <div className="flex-1">
        <p className="font-semibold mb-1">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
