"use client";

import { useState, useMemo, useEffect } from "react";
import { Download, Check, ArrowRight, FileImage, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createDownloadUrl, formatFileSize, type ProcessedImage } from "@/lib/picscrub";

interface BeforeAfterComparisonProps {
  fileName: string;
  result: ProcessedImage;
}

export function BeforeAfterComparison({ fileName, result }: BeforeAfterComparisonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const downloadUrl = useMemo(() => {
    return createDownloadUrl(result.cleaned.buffer, result.cleaned.format);
  }, [result]);

  useEffect(() => {
    return () => URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    const outFormat = result.cleaned.format;
    const extension = outFormat === "jpeg" ? "jpg" : outFormat;
    const cleanName = fileName.replace(/\.[^/.]+$/, "") + `-cleaned.${extension}`;
    link.download = cleanName;
    link.click();
    setDownloaded(true);
  };

  const sizeDiff = result.original.size - result.cleaned.size;
  const sizeReduction = result.original.size > 0
    ? ((sizeDiff / result.original.size) * 100).toFixed(1)
    : "0";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileImage className="h-8 w-8 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{fileName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {result.original.format.toUpperCase()} image
              </p>
            </div>
          </div>
          <Button onClick={handleDownload} className="gap-2">
            {downloaded ? (
              <>
                <Check className="h-4 w-4" />
                Downloaded
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Clean Image
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Size comparison */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Original</p>
            <p className="text-lg font-semibold">{formatFileSize(result.original.size)}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Cleaned</p>
            <p className="text-lg font-semibold">{formatFileSize(result.cleaned.size)}</p>
          </div>
          {sizeDiff > 0 && (
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300">
              -{sizeReduction}% smaller
            </Badge>
          )}
        </div>

        {/* Removed metadata summary */}
        {result.removedMetadata.length > 0 ? (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              Successfully removed:
            </p>
            <div className="flex flex-wrap gap-2">
              {result.removedMetadata.map((item) => (
                <Badge key={item} variant="secondary" className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300">
                  <Check className="h-3 w-3 mr-1" />
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                No metadata found in this image - it was already clean!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
