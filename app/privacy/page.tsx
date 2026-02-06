import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - PicScrub",
  description: "Privacy policy for PicScrub image metadata removal tool.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto prose prose-lg">
        <h1>Privacy Policy</h1>

        <p className="text-muted-foreground">Last updated: February 2026</p>

        <h2>The Short Version</h2>

        <p>
          PicScrub processes your images entirely in your browser. Your photos never leave
          your device and are never uploaded to any server. We cannot see, access, or store
          your images.
        </p>

        <h2>Data Controller</h2>

        <p>
          Fabio Souto<br />
          Spain<br />
          Contact: fabio@fabiosouto.me
        </p>

        <h2>Image Processing</h2>

        <p>
          When you use PicScrub to remove metadata from images:
        </p>

        <ul>
          <li>All processing happens locally in your web browser using JavaScript</li>
          <li>Your images are never transmitted over the internet</li>
          <li>We have no access to your images or their contents</li>
          <li>No image data is stored on our servers</li>
        </ul>

        <p>
          You can verify this by disconnecting from the internet after loading the page.
          The tool will continue to work because it runs entirely on your device.
        </p>

        <h2>Website Hosting</h2>

        <p>
          This website is hosted on Vercel. When you visit the site, the following data
          may be automatically collected by the hosting infrastructure:
        </p>

        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Pages visited and time of access</li>
          <li>Referring website</li>
        </ul>

        <p>
          This data is collected for security and performance purposes and is processed
          by Vercel in accordance with their{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>.
        </p>

        <h2>Cookies</h2>

        <p>
          PicScrub does not use cookies for tracking or advertising. Essential cookies
          may be used by the hosting provider for security and performance purposes.
        </p>

        <h2>Analytics</h2>

        <p>
          We do not use any analytics or tracking services on this website.
        </p>

        <h2>Third-Party Services</h2>

        <p>
          This website uses Google Fonts which are self-hosted via Next.js. Font files
          are served directly from our infrastructure — no requests are made to
          Google&apos;s servers when you visit this site.
        </p>

        <h2>Your Rights Under GDPR</h2>

        <p>
          Under the General Data Protection Regulation (GDPR) and Spanish data protection
          law (LOPDGDD), you have the right to:
        </p>

        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Rectify inaccurate personal data</li>
          <li>Request deletion of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Data portability</li>
          <li>Lodge a complaint with the Spanish Data Protection Agency (AEPD)</li>
        </ul>

        <p>
          Since we do not collect or store personal data from your use of the image
          processing tool, these rights primarily apply to any data collected through
          website hosting logs.
        </p>

        <h2>Contact</h2>

        <p>
          For any questions about this privacy policy or to exercise your rights,
          please contact us at: fabio@fabiosouto.me
        </p>

        <h2>Changes to This Policy</h2>

        <p>
          We may update this privacy policy from time to time. Any changes will be
          posted on this page with an updated revision date.
        </p>
      </article>
    </div>
  );
}
