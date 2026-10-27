"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/** A route link is "current" on its own page and on any page below it, e.g. /work/aidochat. */
const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

interface NavLink {
  label: string;
  href: string;
}

/** Links and the brand name come from the server layout, so the content file stays out of the browser bundle. */
export default function Navbar({ links, siteName }: { links: NavLink[]; siteName: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="portfolio-header">
      <div className="wrap nav">
        <Link className="brand" href="/" aria-label={`${siteName} home`} onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <span>O</span>
          </span>
          <span>
            The OrbiTech <span className="gradient">Solutions</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      <nav id="mobile-menu" className={`mobile-menu-drawer ${mobileMenuOpen ? "open" : ""}`} aria-label="Mobile">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
