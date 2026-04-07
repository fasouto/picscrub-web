# PicScrub Web

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![picscrub](https://img.shields.io/npm/v/picscrub?label=picscrub)](https://www.npmjs.com/package/picscrub)

> [picscrub.com](https://picscrub.com) - Strip metadata from images entirely in your browser. No uploads, no servers.

The web interface for [picscrub](https://github.com/fasouto/picscrub), a fast and lossless image metadata removal library.

## Features

- Drag & drop or click to upload images
- Shows detected metadata before cleaning (GPS, camera info, timestamps, etc.)
- Per-image options to preserve color profiles, orientation, or copyright
- Auto-downloads cleaned files
- Supports JPEG, PNG, WebP, GIF, SVG, TIFF, HEIC, DNG, and RAW
- 100% client-side - nothing leaves your browser

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

```bash
npm run build
npm start
```

That's it. No environment variables, no databases, no external services. All processing happens client-side.

## Built with

- [Next.js](https://nextjs.org)
- [picscrub](https://www.npmjs.com/package/picscrub) - the underlying metadata removal library
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT
