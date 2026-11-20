import type { ReactNode } from "react";
import { site } from "@/content/site";

/** A link to the booking page. Renders nothing until a booking link is supplied. */
export default function BookingLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (!site.booking.url) return null;
  return (
    <a href={site.booking.url} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
