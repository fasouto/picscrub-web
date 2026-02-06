"use client";

import { cn } from "@/lib/utils";

interface Section {
  name: string;
  bytes: number | string;
  color: "blue" | "red" | "green" | "yellow" | "purple" | "orange" | "gray";
  description?: string;
}

interface StructureDiagramProps {
  sections: Section[];
  title?: string;
  className?: string;
}

const colorMap = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  gray: "bg-gray-400",
};

const lightColorMap = {
  blue: "bg-blue-100 border-blue-300 text-blue-800",
  red: "bg-red-100 border-red-300 text-red-800",
  green: "bg-green-100 border-green-300 text-green-800",
  yellow: "bg-yellow-100 border-yellow-300 text-yellow-800",
  purple: "bg-purple-100 border-purple-300 text-purple-800",
  orange: "bg-orange-100 border-orange-300 text-orange-800",
  gray: "bg-gray-100 border-gray-300 text-gray-800",
};

export function StructureDiagram({
  sections,
  title,
  className,
}: StructureDiagramProps) {
  // Calculate total bytes for proportional display
  const numericSections = sections.filter(
    (s) => typeof s.bytes === "number"
  ) as Array<Section & { bytes: number }>;
  const totalBytes = numericSections.reduce((sum, s) => sum + s.bytes, 0);
  const hasRest = sections.some((s) => s.bytes === "rest");

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {title}
        </h4>
      )}

      {/* Visual bar representation */}
      <div className="flex h-10 rounded-lg overflow-hidden border border-border">
        {sections.map((section, index) => {
          const isRest = section.bytes === "rest";
          const width = isRest
            ? "flex-1"
            : totalBytes > 0
              ? `${((section.bytes as number) / totalBytes) * 100}%`
              : `${100 / sections.length}%`;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center justify-center text-white text-xs font-medium transition-all hover:opacity-80",
                colorMap[section.color],
                isRest ? "flex-1 min-w-[60px]" : ""
              )}
              style={isRest ? undefined : { width, minWidth: "40px" }}
              title={`${section.name}: ${
                typeof section.bytes === "number"
                  ? `${section.bytes} bytes`
                  : "variable"
              }`}
            >
              <span className="truncate px-1">{section.name}</span>
            </div>
          );
        })}
      </div>

      {/* Detailed legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {sections.map((section, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-2 p-2 rounded-md border text-sm",
              lightColorMap[section.color]
            )}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-sm mt-0.5 flex-shrink-0",
                colorMap[section.color]
              )}
            />
            <div className="min-w-0">
              <div className="font-medium">{section.name}</div>
              <div className="text-xs opacity-75">
                {typeof section.bytes === "number"
                  ? `${section.bytes} bytes`
                  : "Variable length"}
              </div>
              {section.description && (
                <div className="text-xs mt-0.5 opacity-75">
                  {section.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pre-built structure diagrams for common formats
export function JPEGStructure() {
  return (
    <StructureDiagram
      title="JPEG File Structure"
      sections={[
        { name: "SOI", bytes: 2, color: "blue", description: "Start of Image (FF D8)" },
        { name: "APP0-15", bytes: 100, color: "red", description: "Application markers (metadata)" },
        { name: "DQT", bytes: 130, color: "purple", description: "Quantization tables" },
        { name: "SOF", bytes: 20, color: "orange", description: "Start of Frame" },
        { name: "DHT", bytes: 420, color: "yellow", description: "Huffman tables" },
        { name: "SOS + Data", bytes: "rest", color: "green", description: "Scan data (image)" },
        { name: "EOI", bytes: 2, color: "blue", description: "End of Image (FF D9)" },
      ]}
    />
  );
}

export function PNGStructure() {
  return (
    <StructureDiagram
      title="PNG File Structure"
      sections={[
        { name: "Signature", bytes: 8, color: "blue", description: "89 50 4E 47 0D 0A 1A 0A" },
        { name: "IHDR", bytes: 25, color: "purple", description: "Image header (required)" },
        { name: "Metadata", bytes: 100, color: "red", description: "tEXt, iTXt, eXIf chunks" },
        { name: "IDAT", bytes: "rest", color: "green", description: "Compressed image data" },
        { name: "IEND", bytes: 12, color: "blue", description: "Image end marker" },
      ]}
    />
  );
}

export function WebPStructure() {
  return (
    <StructureDiagram
      title="WebP File Structure (RIFF Container)"
      sections={[
        { name: "RIFF", bytes: 4, color: "blue", description: "Container signature" },
        { name: "Size", bytes: 4, color: "gray", description: "File size - 8" },
        { name: "WEBP", bytes: 4, color: "blue", description: "Format identifier" },
        { name: "VP8X", bytes: 18, color: "purple", description: "Extended features flags" },
        { name: "EXIF/XMP", bytes: 100, color: "red", description: "Metadata chunks" },
        { name: "VP8/VP8L", bytes: "rest", color: "green", description: "Image data" },
      ]}
    />
  );
}
