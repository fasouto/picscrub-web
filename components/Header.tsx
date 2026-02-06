"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Github, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="PicScrub logo" width={24} height={24} />
          <span className="text-lg">PicScrub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/formats"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Formats
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
          <a
            href="https://github.com/fasouto/picscrub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-[280px] border-0 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col h-full">
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation */}
              <nav className="flex flex-col gap-1 mt-16 px-2">
                <Link
                  href="/how-it-works"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-muted/60 active:bg-muted transition-colors"
                >
                  How It Works
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/formats"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-muted/60 active:bg-muted transition-colors"
                >
                  Formats
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-muted/60 active:bg-muted transition-colors"
                >
                  FAQ
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </nav>

              {/* Footer with GitHub */}
              <div className="mt-auto p-4">
                <a
                  href="https://github.com/fasouto/picscrub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-muted text-base font-semibold hover:bg-muted/80 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  View on GitHub
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
