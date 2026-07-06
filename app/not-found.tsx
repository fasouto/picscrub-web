import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageOff, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <ImageOff className="h-14 w-14 mx-auto mb-6 text-muted-foreground/50" />
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Page not found
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            This page doesn&apos;t exist &mdash; it&apos;s the one piece of data
            we didn&apos;t scrub. Head back to the tool to clean your images.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="/">
                Remove metadata
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/formats">Format guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
