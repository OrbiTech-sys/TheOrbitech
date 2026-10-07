import Image from "next/image";
import type { Img } from "@/content/site";
import { Pending, PendingMedia } from "@/components/Pending";
import { displayHost } from "@/lib/projects";

interface ProjectFrameProps {
  image: Img | null;
  /** Shown as a bracketed placeholder until a real screenshot exists */
  label: string;
  device?: "desktop" | "mobile";
  /** Real address of the live site, shown as a caption */
  url?: string | null;
  caption?: boolean;
  priority?: boolean;
  sizes: string;
  className?: string;
}

/**
 * A screenshot with a hairline ring and a soft layered shadow.
 * Deliberately not a drawn browser or phone: no fake address bar, no dots, no notch.
 */
export default function ProjectFrame({
  image,
  label,
  device = "desktop",
  url,
  caption = false,
  priority = false,
  sizes,
  className = "",
}: ProjectFrameProps) {
  return (
    <figure className={`frame frame--${device} ${className}`.trim()}>
      <div className="frame__shot">
        {image ? (
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} />
        ) : (
          <PendingMedia label={label} hint="Add the real screenshot in content/site.ts" />
        )}
      </div>
      {caption && (
        <figcaption className="frame__cap">
          {url ? (
            <a href={url} className="ulink" target="_blank" rel="noopener noreferrer">
              {displayHost(url)}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Pending>Live URL</Pending>
          )}
        </figcaption>
      )}
    </figure>
  );
}
