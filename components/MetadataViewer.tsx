"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Calendar,
  Camera,
  Aperture,
  Clock,
  Smartphone,
  Image,
  Settings,
  User,
  FileText,
  Palette,
  ChevronDown,
  ChevronUp,
  List,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MetadataViewerProps {
  metadata: Record<string, unknown> | null;
  loading?: boolean;
}

interface MetadataField {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "location" | "device" | "camera" | "time" | "other";
  risk: "high" | "medium" | "low";
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(2);
  }
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
};

const formatGPS = (lat: number, latRef: string, lon: number, lonRef: string): string => {
  const latDir = latRef === "S" ? "S" : "N";
  const lonDir = lonRef === "W" ? "W" : "E";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
};

const formatExposureTime = (value: number): string => {
  if (value >= 1) return `${value}s`;
  const denominator = Math.round(1 / value);
  return `1/${denominator}s`;
};

const formatFocalLength = (value: number): string => {
  return `${value}mm`;
};

const formatAperture = (value: number): string => {
  return `f/${value}`;
};

export function MetadataViewer({ metadata, loading }: MetadataViewerProps) {
  const fields = useMemo(() => {
    if (!metadata) return [];

    const result: MetadataField[] = [];

    // GPS Location - High Risk
    if (metadata.latitude && metadata.longitude) {
      result.push({
        label: "GPS Location",
        value: formatGPS(
          metadata.latitude as number,
          (metadata.GPSLatitudeRef as string) || "N",
          metadata.longitude as number,
          (metadata.GPSLongitudeRef as string) || "E"
        ),
        icon: MapPin,
        category: "location",
        risk: "high",
      });
    }

    // Date/Time - High Risk
    if (metadata.DateTimeOriginal) {
      result.push({
        label: "Date Taken",
        value: formatValue(metadata.DateTimeOriginal),
        icon: Calendar,
        category: "time",
        risk: "high",
      });
    } else if (metadata.CreateDate) {
      result.push({
        label: "Date Created",
        value: formatValue(metadata.CreateDate),
        icon: Calendar,
        category: "time",
        risk: "high",
      });
    }

    if (metadata.ModifyDate && metadata.ModifyDate !== metadata.DateTimeOriginal) {
      result.push({
        label: "Last Modified",
        value: formatValue(metadata.ModifyDate),
        icon: Clock,
        category: "time",
        risk: "medium",
      });
    }

    // Device Info - Medium Risk
    const make = metadata.Make as string;
    const model = metadata.Model as string;
    if (make || model) {
      result.push({
        label: "Camera/Device",
        value: [make, model].filter(Boolean).join(" "),
        icon: Camera,
        category: "device",
        risk: "medium",
      });
    }

    // Software
    if (metadata.Software) {
      result.push({
        label: "Software",
        value: formatValue(metadata.Software),
        icon: Settings,
        category: "device",
        risk: "low",
      });
    }

    // Author/Artist
    if (metadata.Artist || metadata.Author) {
      result.push({
        label: "Author",
        value: formatValue(metadata.Artist || metadata.Author),
        icon: User,
        category: "other",
        risk: "high",
      });
    }

    // Copyright
    if (metadata.Copyright) {
      result.push({
        label: "Copyright",
        value: formatValue(metadata.Copyright),
        icon: FileText,
        category: "other",
        risk: "medium",
      });
    }

    // Camera Settings - Low Risk
    if (metadata.ExposureTime) {
      result.push({
        label: "Shutter Speed",
        value: formatExposureTime(metadata.ExposureTime as number),
        icon: Aperture,
        category: "camera",
        risk: "low",
      });
    }

    if (metadata.FNumber) {
      result.push({
        label: "Aperture",
        value: formatAperture(metadata.FNumber as number),
        icon: Aperture,
        category: "camera",
        risk: "low",
      });
    }

    if (metadata.ISO) {
      result.push({
        label: "ISO",
        value: formatValue(metadata.ISO),
        icon: Smartphone,
        category: "camera",
        risk: "low",
      });
    }

    if (metadata.FocalLength) {
      result.push({
        label: "Focal Length",
        value: formatFocalLength(metadata.FocalLength as number),
        icon: Image,
        category: "camera",
        risk: "low",
      });
    }

    // Dimensions
    if (metadata.ImageWidth && metadata.ImageHeight) {
      result.push({
        label: "Dimensions",
        value: `${metadata.ImageWidth} × ${metadata.ImageHeight}`,
        icon: Image,
        category: "other",
        risk: "low",
      });
    } else if (metadata.ExifImageWidth && metadata.ExifImageHeight) {
      result.push({
        label: "Dimensions",
        value: `${metadata.ExifImageWidth} × ${metadata.ExifImageHeight}`,
        icon: Image,
        category: "other",
        risk: "low",
      });
    }

    // Color Space
    if (metadata.ColorSpace) {
      const colorSpace = metadata.ColorSpace === 1 ? "sRGB" : formatValue(metadata.ColorSpace);
      result.push({
        label: "Color Space",
        value: colorSpace,
        icon: Palette,
        category: "other",
        risk: "low",
      });
    }

    // Orientation
    if (metadata.Orientation) {
      const orientations: Record<number, string> = {
        1: "Normal",
        2: "Mirrored",
        3: "Rotated 180°",
        4: "Mirrored + 180°",
        5: "Mirrored + 90° CW",
        6: "Rotated 90° CW",
        7: "Mirrored + 90° CCW",
        8: "Rotated 90° CCW",
      };
      result.push({
        label: "Orientation",
        value: orientations[metadata.Orientation as number] || formatValue(metadata.Orientation),
        icon: Image,
        category: "other",
        risk: "low",
      });
    }

    return result;
  }, [metadata]);

  const allTags = useMemo(() => {
    if (!metadata) return [];
    return Object.entries(metadata)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([key, value]) => ({ key, value: formatValue(value) }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [metadata]);

  const [showAllTags, setShowAllTags] = useState(false);

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Reading metadata...
      </div>
    );
  }

  if (!metadata || (fields.length === 0 && allTags.length === 0)) {
    return null;
  }

  const riskColors = {
    high: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    medium: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    low: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  };

  const riskLabels = {
    high: "Sensitive",
    medium: "Identifying",
    low: "Technical",
  };

  return (
    <div className="space-y-3">
      {fields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <field.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {field.label}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${riskColors[field.risk]}`}
                  >
                    {riskLabels[field.risk]}
                  </Badge>
                </div>
                <p className="text-sm font-medium truncate" title={field.value}>
                  {field.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {allTags.length > fields.length && (
        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllTags(!showAllTags)}
            className="gap-2 rounded-full px-5"
          >
            <List className="h-3.5 w-3.5" />
            {showAllTags ? "Hide" : "Show"} all {allTags.length} tags
            {showAllTags ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
          {showAllTags && (
            <div className="mt-2 rounded-lg border border-border overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Tag</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allTags.map(({ key, value }) => (
                      <tr key={key} className="hover:bg-muted/50">
                        <td className="px-3 py-1.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{key}</td>
                        <td className="px-3 py-1.5 text-xs break-all">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-3 py-2 bg-muted/50 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  All tags shown above will be removed when you clean this image.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
