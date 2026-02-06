"use client";

import { cn } from "@/lib/utils";

interface Annotation {
  start: number;
  end: number;
  label: string;
  color: "blue" | "red" | "green" | "yellow" | "purple" | "orange" | "gray";
}

interface HexViewerProps {
  data: string;
  annotations?: Annotation[];
  bytesPerRow?: number;
  showAscii?: boolean;
  className?: string;
}

const colorMap = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  yellow:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  purple:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  orange:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const legendColorMap = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  gray: "bg-gray-500",
};

export function HexViewer({
  data,
  annotations = [],
  bytesPerRow = 16,
  showAscii = true,
  className,
}: HexViewerProps) {
  // Parse hex string to bytes
  const hexBytes = data
    .replace(/\s+/g, "")
    .match(/.{1,2}/g) || [];

  // Get annotation for a byte index
  const getAnnotation = (index: number): Annotation | undefined => {
    return annotations.find((a) => index >= a.start && index <= a.end);
  };

  // Convert hex byte to ASCII character (printable only)
  const toAscii = (hex: string): string => {
    const code = parseInt(hex, 16);
    return code >= 32 && code < 127 ? String.fromCharCode(code) : ".";
  };

  // Group bytes into rows
  const rows: string[][] = [];
  for (let i = 0; i < hexBytes.length; i += bytesPerRow) {
    rows.push(hexBytes.slice(i, i + bytesPerRow));
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Legend */}
      {annotations.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs">
          {annotations.map((annotation, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-3 h-3 rounded-sm",
                  legendColorMap[annotation.color]
                )}
              />
              <span className="text-muted-foreground">{annotation.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hex display */}
      <div className="font-mono text-sm bg-muted/50 rounded-lg p-4 overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr className="text-muted-foreground text-xs">
              <th className="text-left pr-4 pb-2">Offset</th>
              <th className="text-left pb-2" colSpan={bytesPerRow}>
                Hex
              </th>
              {showAscii && (
                <th className="text-left pl-4 pb-2">ASCII</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const offset = rowIndex * bytesPerRow;
              return (
                <tr key={rowIndex}>
                  {/* Offset column */}
                  <td className="text-muted-foreground pr-4 select-none">
                    {offset.toString(16).padStart(4, "0").toUpperCase()}
                  </td>

                  {/* Hex bytes */}
                  <td>
                    <div className="flex gap-1">
                      {row.map((byte, byteIndex) => {
                        const globalIndex = offset + byteIndex;
                        const annotation = getAnnotation(globalIndex);
                        return (
                          <span
                            key={byteIndex}
                            className={cn(
                              "px-1 rounded",
                              annotation && colorMap[annotation.color]
                            )}
                            title={annotation?.label}
                          >
                            {byte.toUpperCase()}
                          </span>
                        );
                      })}
                      {/* Pad with empty spaces */}
                      {row.length < bytesPerRow &&
                        Array(bytesPerRow - row.length)
                          .fill(null)
                          .map((_, i) => (
                            <span key={`pad-${i}`} className="px-1 opacity-0">
                              00
                            </span>
                          ))}
                    </div>
                  </td>

                  {/* ASCII column */}
                  {showAscii && (
                    <td className="pl-4 text-muted-foreground select-none">
                      {row.map((byte, byteIndex) => {
                        const globalIndex = offset + byteIndex;
                        const annotation = getAnnotation(globalIndex);
                        return (
                          <span
                            key={byteIndex}
                            className={cn(
                              annotation && colorMap[annotation.color]
                            )}
                          >
                            {toAscii(byte)}
                          </span>
                        );
                      })}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
