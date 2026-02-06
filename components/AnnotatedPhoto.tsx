"use client";

import Image from "next/image";

interface Annotation {
  text: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right";
  arrowTo?: { x: string; y: string };
}

interface AnnotatedPhotoProps {
  annotations?: Annotation[];
  showMetadataOverlay?: boolean;
}

export function AnnotatedPhoto({
  annotations,
  showMetadataOverlay = true
}: AnnotatedPhotoProps) {
  const defaultAnnotations: Annotation[] = [
    {
      text: "GPS: 45.4642° N, 9.1900° E",
      position: "top-left",
    },
    {
      text: "Oct 12, 2019 12:42:14",
      position: "top-right",
    },
    {
      text: "Xiaomi Mi 9T",
      position: "bottom-left",
    },
    {
      text: "f/1.75 · 1/1179s · ISO 100",
      position: "bottom-right",
    },
  ];

  const displayAnnotations = annotations || defaultAnnotations;

  return (
    <div className="relative my-16">
      {/* Main photo container with padding for annotations */}
      <div className="relative mx-auto max-w-lg pt-10 pb-10">
        {/* The photo */}
        <div className="relative rounded-lg overflow-hidden shadow-lg border-4 border-white">
          <Image
            src="/sample-photo.jpg"
            alt="Sample photo of a dog with sunglasses"
            width={600}
            height={450}
            className="w-full h-auto"
          />

          {/* Metadata overlay hint */}
          {showMetadataOverlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Annotations */}
        {displayAnnotations.map((annotation, index) => (
          <AnnotationLabel
            key={index}
            text={annotation.text}
            position={annotation.position}
          />
        ))}

      </div>

    </div>
  );
}

function AnnotationLabel({ text, position }: { text: string; position: string }) {
  const positionClasses: Record<string, string> = {
    "top-left": "top-0 left-4 -rotate-2",
    "top-right": "top-0 right-4 rotate-1",
    "bottom-left": "bottom-0 left-4 rotate-1",
    "bottom-right": "bottom-0 right-4 -rotate-1",
    "left": "top-1/2 -left-32 -translate-y-1/2 -rotate-6",
    "right": "top-1/2 -right-32 -translate-y-1/2 rotate-6",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-10`}
    >
      <span
        className="font-[family-name:var(--font-caveat)] text-[oklch(0.738_0.173_81)] text-2xl font-bold whitespace-nowrap"
      >
        {text}
      </span>
    </div>
  );
}
