import Link from "next/link";
import { Shield } from "lucide-react";

const footerLinks = [
  { name: "How It Works", href: "/how-it-works" },
  { name: "FAQ", href: "/faq" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "GitHub", href: "https://github.com/fasouto/picscrub", external: true },
  { name: "npm", href: "https://www.npmjs.com/package/picscrub", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg">PicScrub</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Privacy-first image metadata removal. Strip EXIF, XMP, IPTC, and other metadata
              from images entirely client-side.
            </p>
          </div>

          {/* Links */}
          <div className="md:text-right">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}
