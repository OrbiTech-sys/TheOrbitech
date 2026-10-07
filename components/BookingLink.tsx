import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";

/** Where "Book a call" goes: your booking page once it exists, otherwise the contact page. */
export const bookingHref = site.booking.url ?? "/contact#book";

export default function BookingLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (site.booking.url) {
    return (
      <a href={site.booking.url} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={bookingHref} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
