import { Shield, Lock, Zap, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm mb-8">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>100% client-side processing</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Strip metadata from images{" "}
            <span className="text-primary">instantly</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Remove EXIF, GPS coordinates, camera info, and other sensitive metadata from your images.
            Privacy-first, lossless, and works entirely in your browser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" asChild>
              <a href="#tool">Try It Now</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/fasouto/picscrub" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <FeaturePill icon={Shield} text="Privacy-first" />
            <FeaturePill icon={Zap} text="Lossless quality" />
            <FeaturePill icon={Code} text="9 formats supported" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon: Icon, text }: { icon: typeof Shield; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
      <Icon className="h-4 w-4 text-primary" />
      <span>{text}</span>
    </div>
  );
}
