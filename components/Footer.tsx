import Link from "next/link";
import Image from "next/image";

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src="/logo.png" alt="PicScrub logo" width={24} height={24} />
              <span className="text-lg">PicScrub</span>
            </Link>
            <span className="hidden md:inline text-border">|</span>
            <p className="hidden md:block text-sm text-muted-foreground">
              Privacy-first image metadata removal.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
