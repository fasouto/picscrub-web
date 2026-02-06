import { Shield, Zap, Layers } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Private",
    description: "Runs in your browser",
  },
  {
    icon: Zap,
    title: "Lossless",
    description: "No quality loss",
  },
  {
    icon: Layers,
    title: "9 Formats",
    description: "All major types",
  },
];

export function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center"
            >
              <feature.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
