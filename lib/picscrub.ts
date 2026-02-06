import {
  removeMetadata,
  detectFormat,
  type RemoveOptions,
  type RemoveResult,
  type SupportedFormat,
} from "picscrub";
import exifr from "exifr";

export interface ImageMetadata {
  [key: string]: unknown;
}

export async function readMetadata(file: File): Promise<ImageMetadata | null> {
  try {
    const metadata = await exifr.parse(file, {
      // Include all metadata types
      tiff: true,
      exif: true,
      gps: true,
      xmp: true,
      icc: true,
      iptc: true,
      // Translate GPS to simple lat/lng
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    });
    return metadata || null;
  } catch {
    // Failed to parse metadata
    return null;
  }
}

export interface ProcessedImage {
  original: {
    buffer: ArrayBuffer;
    size: number;
    format: SupportedFormat;
  };
  cleaned: {
    buffer: ArrayBuffer;
    size: number;
    format: SupportedFormat;
  };
  removedMetadata: string[];
}

export async function processImage(
  file: File,
  options?: RemoveOptions
): Promise<ProcessedImage> {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  // Detect format
  const format = detectFormat(uint8Array);
  if (format === "unknown") {
    throw new Error("Unsupported image format");
  }

  const result: RemoveResult = await removeMetadata(uint8Array, options ?? {});

  return {
    original: {
      buffer: buffer,
      size: result.originalSize,
      format: result.format,
    },
    cleaned: {
      buffer: new Uint8Array(result.data).buffer,
      size: result.cleanedSize,
      format: result.outputFormat ?? result.format,
    },
    removedMetadata: result.removedMetadata,
  };
}

export function createDownloadUrl(buffer: ArrayBuffer, format: SupportedFormat): string {
  const mimeTypes: Record<string, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    tiff: "image/tiff",
    heic: "image/heic",
    dng: "image/x-adobe-dng",
    raw: "image/x-raw",
    unknown: "application/octet-stream",
  };

  const blob = new Blob([buffer], { type: mimeTypes[format] || "application/octet-stream" });
  return URL.createObjectURL(blob);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export type { RemoveOptions, RemoveResult, SupportedFormat };
