# PicScrub Web

> [picscrub.com](https://picscrub.com) — Strip metadata from images entirely in your browser. No uploads, no servers.

The web interface for [picscrub](https://github.com/fasouto/picscrub), a fast and lossless image metadata removal library.

## Features

- Drag & drop or click to upload images
- Shows detected metadata before cleaning (GPS, camera info, timestamps, etc.)
- Per-image options to preserve color profiles, orientation, or copyright
- Auto-downloads cleaned files
- Supports JPEG, PNG, WebP, GIF, SVG, TIFF, HEIC, DNG, and RAW
- 100% client-side — nothing leaves your browser

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Built with

- [Next.js](https://nextjs.org)
- [picscrub](https://www.npmjs.com/package/picscrub) — the underlying metadata removal library
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT
