import Image from "next/image";
import type { Img } from "@/content/site";
import { displayHost } from "@/lib/projects";

interface ProjectFrameProps {
  image: Img | null;
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
 * Renders nothing when there is no screenshot, so the page never shows a stand-in.
 */
export default function ProjectFrame({
  image,
  device = "desktop",
  url,
  caption = false,
  priority = false,
  sizes,
  className = "",
}: ProjectFrameProps) {
  if (!image) return null;
  return (
    <figure className={`frame frame--${device} ${className}`.trim()}>
      <div className="frame__shot">
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} />
      </div>
      {caption && url && (
        <figcaption className="frame__cap">
          <a href={url} target="_blank" rel="noopener">
            {displayHost(url)}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </figcaption>
      )}
    </figure>
  );
}
