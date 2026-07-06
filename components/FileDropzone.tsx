"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Loader2, AlertCircle, Sparkles, X, Download, Check, FileArchive } from "lucide-react";
import { zipSync } from "fflate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { readMetadata, createDownloadUrl, formatFileSize, type ProcessedImage, type ImageMetadata, type RemoveOptions, type SupportedFormat } from "@/lib/picscrub";
import { scrubImage } from "@/lib/scrubClient";
import { MetadataViewer } from "./MetadataViewer";

const ACCEPTED_FORMATS = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/svg+xml": [".svg"],
  "image/tiff": [".tiff", ".tif"],
  "image/heic": [".heic", ".heif"],
  "image/x-adobe-dng": [".dng"],
  "image/x-raw": [".cr2", ".nef", ".arw", ".orf", ".rw2", ".raf", ".pef", ".srw"],
};

interface PendingFile {
  file: File;
  preview: string;
  metadata: ImageMetadata | null;
  loadingMetadata: boolean;
  options: RemoveOptions;
  applicableOptions: (keyof RemoveOptions)[];
}

interface ProcessedFile {
  file: File;
  preview: string;
  metadata: ImageMetadata | null;
  result: ProcessedImage;
  downloaded: boolean;
}

type FileEntry = { id: string } & (
  | { status: "pending"; data: PendingFile }
  | { status: "processing"; data: PendingFile }
  | { status: "processed"; data: ProcessedFile }
);

const PRESERVE_OPTIONS: { key: keyof RemoveOptions; label: string }[] = [
  { key: "preserveColorProfile", label: "Keep color profile" },
  { key: "preserveOrientation", label: "Keep orientation" },
  { key: "preserveCopyright", label: "Keep copyright" },
  { key: "preserveTitle", label: "Keep SVG title" },
  { key: "preserveDescription", label: "Keep SVG description" },
];

const ICC_KEYS = ["ProfileDescription", "ColorSpaceData", "ProfileClass", "ConnectionSpaceType", "RenderingIntent", "DeviceModelDesc", "DeviceMfgDesc"];

async function detectApplicableOptions(
  metadata: ImageMetadata | null,
  file: File,
): Promise<(keyof RemoveOptions)[]> {
  const result: (keyof RemoveOptions)[] = [];

  if (metadata) {
    const keys = Object.keys(metadata);
    if (keys.some((k) => ICC_KEYS.includes(k))) {
      result.push("preserveColorProfile");
    }
    if ("Orientation" in metadata) {
      result.push("preserveOrientation");
    }
    if (keys.some((k) => k === "Copyright" || k === "CopyrightNotice")) {
      result.push("preserveCopyright");
    }
  }

  if (file.type === "image/svg+xml") {
    const text = await file.text();
    if (/<title[\s>]/i.test(text)) result.push("preserveTitle");
    if (/<desc[\s>]/i.test(text)) result.push("preserveDescription");
  }

  return result;
}

function cleanedFileName(originalName: string, format: SupportedFormat): string {
  const extension = format === "jpeg" ? "jpg" : format;
  return originalName.replace(/\.[^/.]+$/, "") + `-picscrub.${extension}`;
}

function triggerDownload(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
}

export function FileDropzone() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mirror of the latest state for async flows (metadata loading, batch
  // processing) so they never act on a stale snapshot.
  const filesRef = useRef<FileEntry[]>(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const updateEntry = useCallback((id: string, update: (entry: FileEntry) => FileEntry) => {
    setFiles((prev) => prev.map((entry) => (entry.id === id ? update(entry) : entry)));
  }, []);

  const updateFileOption = (id: string, key: keyof RemoveOptions, value: boolean) => {
    updateEntry(id, (entry) =>
      entry.status === "pending"
        ? {
            ...entry,
            data: { ...entry.data, options: { ...entry.data.options, [key]: value } },
          }
        : entry,
    );
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setError(null);

    // Create pending files with previews
    const newEntries: FileEntry[] = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      status: "pending" as const,
      data: {
        file,
        preview: URL.createObjectURL(file),
        metadata: null,
        loadingMetadata: true,
        options: {},
        applicableOptions: [],
      },
    }));

    setFiles((prev) => [...prev, ...newEntries]);

    // Read metadata for each file
    for (const entry of newEntries) {
      try {
        const metadata = await readMetadata(entry.data.file);
        const applicable = await detectApplicableOptions(metadata, entry.data.file);
        const defaultOptions: RemoveOptions = Object.fromEntries(
          applicable.map((key) => [key, true]),
        );
        setFiles((prev) =>
          prev.map((existing) =>
            existing.id === entry.id && existing.status === "pending"
              ? {
                  ...existing,
                  data: {
                    ...existing.data,
                    metadata,
                    loadingMetadata: false,
                    applicableOptions: applicable,
                    options: defaultOptions,
                  },
                }
              : existing,
          ),
        );
      } catch {
        setFiles((prev) =>
          prev.map((existing) =>
            existing.id === entry.id && existing.status === "pending"
              ? { ...existing, data: { ...existing.data, loadingMetadata: false } }
              : existing,
          ),
        );
      }
    }
  }, []);

  // Paste an image (e.g. a screenshot) from the clipboard
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const clipboardFiles = event.clipboardData?.files;
      if (!clipboardFiles?.length) return;
      const images = Array.from(clipboardFiles).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (images.length > 0) {
        event.preventDefault();
        onDrop(images);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onDrop]);

  const processFile = async (
    id: string,
    { download = true }: { download?: boolean } = {},
  ): Promise<ProcessedImage | null> => {
    const entry = filesRef.current.find((f) => f.id === id);
    if (entry?.status !== "pending") return null;

    updateEntry(id, (current) =>
      current.status === "pending" ? { ...current, status: "processing" } : current,
    );

    try {
      const result = await scrubImage(entry.data.file, entry.data.options);
      updateEntry(id, (current) => ({
        id: current.id,
        status: "processed",
        data: {
          file: entry.data.file,
          preview: entry.data.preview,
          metadata: entry.data.metadata,
          result,
          downloaded: download,
        },
      }));

      if (download) {
        const downloadUrl = createDownloadUrl(result.cleaned.buffer, result.cleaned.format);
        triggerDownload(downloadUrl, cleanedFileName(entry.data.file.name, result.cleaned.format));
        URL.revokeObjectURL(downloadUrl);
      }
      return result;
    } catch (err) {
      console.error(`Error processing ${entry.data.file.name}:`, err);
      setError(`Failed to process ${entry.data.file.name}`);
      updateEntry(id, (current) =>
        current.status === "processing" ? { ...current, status: "pending", data: entry.data } : current,
      );
      return null;
    }
  };

  const processAllFiles = async () => {
    const pendingEntries = filesRef.current.filter((f) => f.status === "pending");
    if (pendingEntries.length === 0) return;

    if (pendingEntries.length === 1) {
      await processFile(pendingEntries[0].id);
      return;
    }

    // Batch: collect cleaned files and download a single ZIP instead of
    // triggering one download per file.
    const cleaned: { name: string; result: ProcessedImage }[] = [];
    for (const entry of pendingEntries) {
      const result = await processFile(entry.id, { download: false });
      if (result) {
        cleaned.push({
          name: cleanedFileName(entry.data.file.name, result.cleaned.format),
          result,
        });
      }
    }
    if (cleaned.length === 0) return;

    const zipEntries: Record<string, Uint8Array> = {};
    for (const { name, result } of cleaned) {
      let uniqueName = name;
      for (let n = 2; uniqueName in zipEntries; n++) {
        uniqueName = name.replace(/(\.[^.]+)$/, `-${n}$1`);
      }
      zipEntries[uniqueName] = new Uint8Array(result.cleaned.buffer);
    }
    // Image data is already compressed; store without recompressing
    const zipped = zipSync(zipEntries, { level: 0 });
    const blob = new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "picscrub-cleaned.zip");
    URL.revokeObjectURL(url);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const entry = prev.find((f) => f.id === id);
      if (entry) {
        URL.revokeObjectURL(entry.data.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const downloadFile = (id: string) => {
    const entry = filesRef.current.find((f) => f.id === id);
    if (entry?.status !== "processed") return;

    const { result, file } = entry.data;
    const downloadUrl = createDownloadUrl(result.cleaned.buffer, result.cleaned.format);
    triggerDownload(downloadUrl, cleanedFileName(file.name, result.cleaned.format));
    URL.revokeObjectURL(downloadUrl);

    updateEntry(id, (current) =>
      current.status === "processed"
        ? { ...current, data: { ...current.data, downloaded: true } }
        : current,
    );
  };

  const handleReset = () => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.data.preview);
    });
    setFiles([]);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    disabled: files.some((f) => f.status === "processing"),
  });

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const isProcessing = files.some((f) => f.status === "processing");

  if (files.length > 0) {
    return (
      <div className="space-y-4">
        {files.map((entry) => {
          const file = entry.data.file;
          const preview = entry.data.preview;
          const fileSize = entry.status === "processed"
            ? entry.data.result.original.size
            : entry.data.file.size;

          return (
            <Card key={entry.id} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.status === "processed"
                        ? `${formatFileSize(entry.data.result.original.size)} → ${formatFileSize(entry.data.result.cleaned.size)}`
                        : formatFileSize(fileSize)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${file.name}`}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => removeFile(entry.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image Preview */}
                  <div className="lg:w-56 flex-shrink-0">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-muted/80 to-muted shadow-inner">
                      <img
                        src={preview}
                        alt={file.name}
                        className="absolute inset-0 w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-2">
                      {entry.status === "pending" && !entry.data.loadingMetadata && (
                        <Button
                          onClick={() => processFile(entry.id)}
                          disabled={isProcessing}
                          className="w-full gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Clean & Download
                        </Button>
                      )}

                      {entry.status === "processing" && (
                        <div className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cleaning...
                        </div>
                      )}

                      {entry.status === "processed" && (
                        <Button
                          onClick={() => downloadFile(entry.id)}
                          className="w-full gap-2"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                          {entry.data.downloaded ? "Download Again" : "Download"}
                        </Button>
                      )}
                    </div>

                    {entry.status === "pending" && entry.data.applicableOptions.length > 0 && (
                      <div className="mt-1.5 grid gap-0.5">
                        {PRESERVE_OPTIONS
                          .filter((opt) => entry.data.applicableOptions.includes(opt.key))
                          .map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!entry.data.options[key]}
                                onChange={(e) => updateFileOption(entry.id, key, e.target.checked)}
                                className="h-3.5 w-3.5"
                              />
                              <span className="text-muted-foreground">{label}</span>
                            </label>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Metadata Content */}
                  <div className="flex-1 min-w-0">
                    {entry.status === "pending" && (
                      <>
                        {entry.data.loadingMetadata ? (
                          <div className="flex items-center gap-2 py-4 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Reading metadata...</span>
                          </div>
                        ) : entry.data.metadata ? (
                          <MetadataViewer metadata={entry.data.metadata} />
                        ) : (
                          <div className="py-4 text-center text-muted-foreground">
                            <p className="text-sm">No readable metadata found in this image.</p>
                            <p className="text-xs mt-1">The image may already be clean or use an unsupported metadata format.</p>
                          </div>
                        )}

                      </>
                    )}

                    {entry.status === "processing" && (
                      <div className="py-8 text-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                        <p className="text-sm">Removing metadata...</p>
                      </div>
                    )}

                    {entry.status === "processed" && (
                      <div className="space-y-4">
                        {/* With preserve options picscrub can strip metadata yet
                            report an empty removedMetadata list, so also treat a
                            size reduction as a successful clean */}
                        {entry.data.result.removedMetadata.length > 0 ||
                        entry.data.result.original.size > entry.data.result.cleaned.size ? (
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <p className="font-medium text-green-800 dark:text-green-200">Metadata removed successfully</p>
                            </div>
                            {entry.data.result.removedMetadata.length > 0 && (
                              <p className="text-sm text-green-700 dark:text-green-300">
                                Removed: {entry.data.result.removedMetadata.join(", ")}
                              </p>
                            )}
                            {entry.data.result.original.size > entry.data.result.cleaned.size && (
                              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                File size reduced by {formatFileSize(entry.data.result.original.size - entry.data.result.cleaned.size)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              This image was already clean. No metadata was found to remove.
                            </p>
                          </div>
                        )}

                        {/* Show what was in the image before */}
                        {entry.data.metadata && Object.keys(entry.data.metadata).length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              View original metadata
                            </summary>
                            <div className="mt-3">
                              <MetadataViewer metadata={entry.data.metadata} />
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {pendingCount > 1 && (
            <Button
              onClick={processAllFiles}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileArchive className="h-4 w-4" />
                  Clean All & Download ZIP ({pendingCount} images)
                </>
              )}
            </Button>
          )}
          {files.length > 0 && (
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Clear All & Start Over
            </Button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-center">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Add more files dropzone */}
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`
                flex items-center justify-center p-6 cursor-pointer
                transition-colors rounded-lg
                ${isDragActive ? "bg-primary/5" : "hover:bg-muted/50"}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-5 w-5 text-muted-foreground mr-2" />
              <p className="text-sm text-muted-foreground">Add more images</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-primary">
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={`
            flex flex-col items-center justify-center p-12 cursor-pointer
            transition-colors rounded-lg
            ${isDragActive ? "bg-primary/5" : "hover:bg-muted/50"}
          `}
        >
          <input {...getInputProps()} />

          {error ? (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-medium mb-2 text-destructive">Error</p>
              <p className="text-sm text-muted-foreground text-center mb-4">{error}</p>
              <Button variant="outline" onClick={(e) => { e.stopPropagation(); setError(null); }}>
                Try Again
              </Button>
            </>
          ) : isDragActive ? (
            <>
              <ImageIcon className="h-12 w-12 text-primary mb-4" />
              <p className="text-lg font-medium mb-2">Drop your images here</p>
              <p className="text-sm text-muted-foreground">Release to analyze metadata</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drop images here, click to upload, or paste from clipboard</p>
              <p className="text-sm text-muted-foreground mb-4">
                JPEG, PNG, WebP, GIF, SVG, TIFF, HEIC, DNG, RAW
              </p>
              <Button>Select Images</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
