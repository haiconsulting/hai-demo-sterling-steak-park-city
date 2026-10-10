import manifest from "@/data/images.generated.json";
import { asset } from "@/lib/paths";
import { cn } from "@/lib/utils";

export type PhotoName = keyof typeof manifest;

type Props = {
  name: PhotoName;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/** Pre-optimized responsive image (see scripts/optimize-images.mjs). */
export function Photo({ name, alt, sizes, className, imgClassName, priority }: Props) {
  const m = manifest[name];
  const srcset = (ext: string) => m.widths.map((w) => `${asset(`/img/${name}-${w}.${ext}`)} ${w}w`).join(", ");
  const largest = m.widths[m.widths.length - 1];
  const height = Math.round((m.height / m.width) * largest);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={asset(`/img/${name}-${m.widths[0]}.webp`)}
        alt={alt}
        width={largest}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </picture>
  );
}
