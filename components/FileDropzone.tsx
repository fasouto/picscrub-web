"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Loader2, AlertCircle, Sparkles, X, Download, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { processImage, readMetadata, createDownloadUrl, formatFileSize, type ProcessedImage, type ImageMetadata, type RemoveOptions } from "@/lib/picscrub";
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

type FileState =
  | { status: "pending"; data: PendingFile }
  | { status: "processing"; data: PendingFile }
  | { status: "processed"; data: ProcessedFile };

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

export function FileDropzone() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [error, setError] = useState<string | null>(null);

  const updateFileOption = (index: number, key: keyof RemoveOptions, value: boolean) => {
    setFiles((prev) => {
      const updated = [...prev];
      const file = updated[index];
      if (file?.status === "pending") {
        updated[index] = {
          ...file,
          data: { ...file.data, options: { ...file.data.options, [key]: value } },
        };
      }
      return updated;
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setError(null);

    // Create pending files with previews
    const newFiles: FileState[] = acceptedFiles.map((file) => ({
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

    setFiles((prev) => [...prev, ...newFiles]);

    // Read metadata for each file
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      try {
        const metadata = await readMetadata(file);
        const applicable = await detectApplicableOptions(metadata, file);
        const defaultOptions: RemoveOptions = Object.fromEntries(
          applicable.map((key) => [key, true]),
        );
        setFiles((prev) => {
          const updated = [...prev];
          const idx = prev.length - acceptedFiles.length + i;
          if (updated[idx]?.status === "pending") {
            updated[idx] = {
              status: "pending",
              data: {
                ...updated[idx].data,
                metadata,
                loadingMetadata: false,
                applicableOptions: applicable,
                options: defaultOptions,
              },
            };
          }
          return updated;
        });
      } catch {
        setFiles((prev) => {
          const updated = [...prev];
          const idx = prev.length - acceptedFiles.length + i;
          if (updated[idx]?.status === "pending") {
            updated[idx] = {
              status: "pending",
              data: {
                ...updated[idx].data,
                loadingMetadata: false,
              },
            };
          }
          return updated;
        });
      }
    }
  }, []);

  const processFile = async (index: number) => {
    const fileState = files[index];
    if (fileState?.status !== "pending") return;

    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = { status: "processing", data: fileState.data };
      return updated;
    });

    try {
      const result = await processImage(fileState.data.file, fileState.data.options);
      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = {
          status: "processed",
          data: {
            file: fileState.data.file,
            preview: fileState.data.preview,
            metadata: fileState.data.metadata,
            result,
            downloaded: true,
          },
        };
        return updated;
      });

      // Auto-download the cleaned file
      const downloadUrl = createDownloadUrl(result.cleaned.buffer, result.cleaned.format);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const outFormat = result.cleaned.format;
      const extension = outFormat === "jpeg" ? "jpg" : outFormat;
      const cleanName = fileState.data.file.name.replace(/\.[^/.]+$/, "") + `-picscrub.${extension}`;
      link.download = cleanName;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(`Error processing ${fileState.data.file.name}:`, err);
      setError(`Failed to process ${fileState.data.file.name}`);
      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = { status: "pending", data: fileState.data };
        return updated;
      });
    }
  };

  const processAllFiles = async () => {
    const pendingIndices = files
      .map((f, i) => (f.status === "pending" ? i : -1))
      .filter((i) => i !== -1);

    for (const index of pendingIndices) {
      await processFile(index);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      const file = updated[index];
      if (file) {
        URL.revokeObjectURL(file.data.preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const downloadFile = (index: number) => {
    const fileState = files[index];
    if (fileState?.status !== "processed") return;

    const { result, file } = fileState.data;
    const downloadUrl = createDownloadUrl(result.cleaned.buffer, result.cleaned.format);
    const link = document.createElement("a");
    link.href = downloadUrl;
    const outFormat = result.cleaned.format;
    const extension = outFormat === "jpeg" ? "jpg" : outFormat;
    const cleanName = file.name.replace(/\.[^/.]+$/, "") + `-picscrub.${extension}`;
    link.download = cleanName;
    link.click();
    URL.revokeObjectURL(downloadUrl);

    setFiles((prev) => {
      const updated = [...prev];
      if (updated[index]?.status === "processed") {
        updated[index] = {
          ...updated[index],
          data: { ...updated[index].data, downloaded: true },
        };
      }
      return updated;
    });
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
        {files.map((fileState, index) => {
          const file = fileState.data.file;
          const preview = fileState.data.preview;
          const fileSize = fileState.status === "processed"
            ? fileState.data.result.original.size
            : fileState.data.file.size;

          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {fileState.status === "processed"
                        ? `${formatFileSize(fileState.data.result.original.size)} → ${formatFileSize(fileState.data.result.cleaned.size)}`
                        : formatFileSize(fileSize)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${file.name}`}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => removeFile(index)}
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
                      {fileState.status === "pending" && !fileState.data.loadingMetadata && (
                        <Button
                          onClick={() => processFile(index)}
                          disabled={isProcessing}
                          className="w-full gap-2 bg-[oklch(0.738_0.173_81)] hover:bg-[oklch(0.68_0.173_81)]"
                        >
                          <Sparkles className="h-4 w-4" />
                          Clean & Download
                        </Button>
                      )}

                      {fileState.status === "processing" && (
                        <div className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cleaning...
                        </div>
                      )}

                      {fileState.status === "processed" && (
                        <Button
                          onClick={() => downloadFile(index)}
                          className="w-full gap-2"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                          Download Again
                        </Button>
                      )}
                    </div>

                    {fileState.status === "pending" && fileState.data.applicableOptions.length > 0 && (
                      <div className="mt-1.5 grid gap-0.5">
                        {PRESERVE_OPTIONS
                          .filter((opt) => fileState.data.applicableOptions.includes(opt.key))
                          .map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!fileState.data.options[key]}
                                onChange={(e) => updateFileOption(index, key, e.target.checked)}
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
                    {fileState.status === "pending" && (
                      <>
                        {fileState.data.loadingMetadata ? (
                          <div className="flex items-center gap-2 py-4 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Reading metadata...</span>
                          </div>
                        ) : fileState.data.metadata ? (
                          <MetadataViewer metadata={fileState.data.metadata} />
                        ) : (
                          <div className="py-4 text-center text-muted-foreground">
                            <p className="text-sm">No readable metadata found in this image.</p>
                            <p className="text-xs mt-1">The image may already be clean or use an unsupported metadata format.</p>
                          </div>
                        )}

                      </>
                    )}

                    {fileState.status === "processing" && (
                      <div className="py-8 text-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                        <p className="text-sm">Removing metadata...</p>
                      </div>
                    )}

                    {fileState.status === "processed" && (
                      <div className="space-y-4">
                        {fileState.data.result.removedMetadata.length > 0 ? (
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <p className="font-medium text-green-800 dark:text-green-200">Metadata removed successfully</p>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Removed: {fileState.data.result.removedMetadata.join(", ")}
                            </p>
                            {fileState.data.result.original.size > fileState.data.result.cleaned.size && (
                              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                File size reduced by {formatFileSize(fileState.data.result.original.size - fileState.data.result.cleaned.size)}
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
                        {fileState.data.metadata && Object.keys(fileState.data.metadata).length > 0 && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              View original metadata
                            </summary>
                            <div className="mt-3">
                              <MetadataViewer metadata={fileState.data.metadata} />
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
              className="gap-2 bg-[oklch(0.738_0.173_81)] hover:bg-[oklch(0.68_0.173_81)]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Clean & Download All ({pendingCount} images)
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
    <Card className="border-2 border-dashed border-[oklch(0.738_0.173_81)]">
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
              <p className="text-lg font-medium mb-2">Drop images here or click to upload</p>
              <p className="text-sm text-muted-foreground mb-4">
                JPEG, PNG, WebP, GIF, SVG, TIFF, HEIC, DNG, RAW
              </p>
              <Button className="bg-[oklch(0.738_0.173_81)] text-white hover:bg-[oklch(0.68_0.173_81)]">Select Images</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
