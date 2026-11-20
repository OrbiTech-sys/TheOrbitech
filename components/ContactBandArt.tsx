import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { CodeXml, Lightbulb, TrendingUp } from "lucide-react";

/** Drop a transparent-background portrait here (webp, png or jpg) and it appears in the band. */
const PORTRAIT_FILES = ["contact-hero.webp", "contact-hero.png", "contact-hero.jpg"];

function portraitSrc(): string | null {
  const dir = path.join(process.cwd(), "public", "contact");
  const found = PORTRAIT_FILES.find((name) => fs.existsSync(path.join(dir, name)));
  return found ? `/contact/${found}` : null;
}

/** Decorative only: a person at work and three floating marks. Hidden below 62.5rem. */
export default function ContactBandArt() {
  const src = portraitSrc();
  return (
    <div className={src ? "contact-art contact-art--portrait" : "contact-art"} aria-hidden="true">
      <span className="contact-art__card contact-art__card--idea">
        <Lightbulb size={34} strokeWidth={1.5} />
      </span>
      <span className="contact-art__card contact-art__card--code">
        <CodeXml size={30} strokeWidth={1.75} />
      </span>
      <span className="contact-art__card contact-art__card--growth">
        <TrendingUp size={30} strokeWidth={1.75} />
      </span>
      {src && <Image className="contact-art__portrait" src={src} alt="" fill sizes="(min-width: 1000px) 680px, 460px" priority unoptimized />}
    </div>
  );
}
