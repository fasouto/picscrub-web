import Link from "next/link";
import { FileDropzone } from "@/components/FileDropzone";
import { Features } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero + Tool Combined - Above the Fold */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Brief headline */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Remove metadata from images
              </h1>

              <p className="text-lg text-muted-foreground">
                Strip GPS location, camera info, timestamps, and other hidden data.
              </p>
            </div>

            {/* Dropzone - Primary focus */}
            <FileDropzone />

          </div>
        </div>
      </section>

      <Features />

      {/* Learn More Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Want to know more?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Learn why image metadata is a privacy concern and exactly how PicScrub
              removes it from each format.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <Link href="/how-it-works">
                  How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">
                  FAQ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
