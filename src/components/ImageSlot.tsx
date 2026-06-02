import Image from "next/image";
import { IconCamera } from "@/lib/icons";

/**
 * Emplacement photo. Si `src` fourni → next/image (AVIF/WebP, lazy).
 * Sinon → placeholder soigné en attendant les vraies photos du client.
 */
export function ImageSlot({
  src,
  alt,
  label,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  src?: string;
  alt?: string;
  label: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={`img-slot ${className}`.trim()}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }
  return (
    <div className={`img-slot ${className}`.trim()} role="img" aria-label={alt ?? label}>
      <span className="lbl">
        <IconCamera />
        {label}
      </span>
    </div>
  );
}
