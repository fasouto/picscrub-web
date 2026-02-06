import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Github, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ - PicScrub",
  description:
    "Frequently asked questions about PicScrub image metadata removal. Learn about privacy, quality, and usage.",
};

const faqs = [
  {
    question: "Is my image really processed locally?",
    answer: `Yes, 100%. PicScrub runs entirely in your browser using JavaScript. Your images are never uploaded to any server. You can verify this by:

1. Disconnecting from the internet and using the tool - it still works
2. Opening your browser's Network tab and observing that no image data is transmitted
3. Reviewing the open-source code on GitHub

This is a fundamental design principle, not just a feature. Your privacy is guaranteed by architecture.`,
  },
  {
    question: "Does stripping metadata reduce image quality?",
    answer: `No. PicScrub uses lossless metadata removal, meaning we never re-encode or recompress your images.

For binary formats (JPEG, PNG, WebP, etc.), we parse the file structure and skip over metadata segments when writing the output. The actual image data passes through unchanged, bit-for-bit identical.

For SVG files, we remove metadata XML elements while preserving all visual elements exactly as they were.

Your cleaned image will look exactly like the original - only smaller because the metadata has been removed.`,
  },
  {
    question: "What metadata is removed?",
    answer: `PicScrub removes privacy-sensitive metadata including:

- **GPS location** - Exact coordinates where the photo was taken
- **Date/time** - When the photo was taken or modified
- **Camera info** - Device make, model, serial numbers
- **Author info** - Names, copyright, comments
- **Editing history** - XMP data from photo editors
- **Thumbnails** - Embedded preview images

Color profiles (ICC) are preserved by default to maintain color accuracy. Image dimensions are never affected since they're part of the image structure, not metadata.`,
  },
  {
    question: "Can I use PicScrub for commercial purposes?",
    answer: `Yes! PicScrub is released under the MIT License, which permits:

- Commercial use
- Modification
- Distribution
- Private use

The only requirement is that you include the original copyright notice and license in any copy of the software. There are no other restrictions.`,
  },
  {
    question: "Can I process multiple images at once?",
    answer: `Yes, you can drag and drop or select multiple images at once. Each image will be processed independently and shown in the results.

There's no limit to how many images you can process - the only constraint is your device's memory.`,
  },
  {
    question: "What file formats are supported?",
    answer: `PicScrub supports 9 image formats:

- **JPEG** - Full metadata removal
- **PNG** - Text chunks, EXIF, ICC profiles
- **WebP** - EXIF, XMP, ICC profiles
- **GIF** - Comments, XMP, application extensions
- **SVG** - Metadata elements, editor namespaces
- **TIFF** - EXIF, GPS, XMP, ICC profiles
- **HEIC** - EXIF, GPS, thumbnails (lossless anonymization)
- **DNG** - Full TIFF-based processing
- **RAW** - CR2, NEF, ARW (returns clean JPEG preview)`,
  },
  {
    question: "Is the source code open?",
    answer: `Yes! PicScrub is fully open source under the MIT License.

You can:
- Review exactly how metadata is removed
- Audit the code for security
- Contribute improvements
- Fork and modify for your needs

The code is available at: https://github.com/fasouto/picscrub`,
  },
  {
    question: "Does PicScrub work offline?",
    answer: `Yes! Once loaded, PicScrub works completely offline. Your images never leave your device.

This is essential for privacy-sensitive use cases where you don't want any network activity while processing images.`,
  },
  {
    question: "Why does my HEIC file stay the same size?",
    answer: `HEIC uses the ISOBMFF container format where internal offsets depend on exact byte positions. Removing bytes would break the file structure.

Instead, PicScrub uses "lossless anonymization" - we overwrite metadata with zeros rather than removing it. This destroys the sensitive data while keeping the file valid. The image data remains completely untouched.`,
  },
  {
    question: "Why do RAW files output as JPEG?",
    answer: `Proprietary RAW formats (CR2, NEF, ARW) use undocumented structures that vary by manufacturer. Rather than risk corrupting your files, we extract the embedded JPEG preview that cameras include for quick viewing.

This preview is typically full-resolution. We strip its metadata and return a clean JPEG.

**Exception:** DNG files are fully supported since they use the documented TIFF structure.`,
  },
  {
    question: "My image appears rotated after cleaning. Why?",
    answer: `Some apps rely on the EXIF orientation tag to display images correctly. By default, PicScrub removes this tag along with other metadata.

If you're using the library programmatically, you can preserve the orientation tag:

\`\`\`typescript
const result = await removeMetadata(imageBuffer, {
  preserveOrientation: true
});
\`\`\``,
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">FAQ</h1>
        </header>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3 mb-16">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-0 rounded-xl bg-muted/50 px-6 data-[state=open]:bg-muted/70"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0 [&>svg]:text-muted-foreground">
                <span className="font-medium text-base">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pt-0">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <ReactMarkdown>{faq.answer}</ReactMarkdown>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can&apos;t find what you&apos;re looking for? Check out the source code or open an issue on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <a
                href="https://github.com/fasouto/picscrub/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask a Question
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/fasouto/picscrub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View Source
              </a>
            </Button>
          </div>
        </section>
      </article>
    </div>
  );
}
