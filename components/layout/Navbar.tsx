"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface MenuLink {
  label: string;
  href: string;
  text?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** A menu shown under the item. The item itself then opens the menu instead of navigating. */
  menu?: { links: MenuLink[]; allLabel: string };
}

/** A route link is "current" on its own page and on any page below it. Home matches only itself. */
const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Links and the brand name come from the server layout, so the content files stay out of the browser bundle.
 * Desktop: menus open on hover, click and keyboard, and close on Escape or a click elsewhere.
 * Phone: a full-screen drawer with the same links, which locks the page behind it while open.
 */
export default function Navbar({
  items,
  siteName,
  shortName,
}: {
  items: NavItem[];
  siteName: string;
  shortName: string;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeAll = () => {
    setOpenMenu(null);
    setDrawerOpen(false);
  };

  // Escape closes whatever is open and gives focus back to the control that opened it.
  useEffect(() => {
    if (!openMenu && !drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (drawerOpen) toggleRef.current?.focus();
      setOpenMenu(null);
      setDrawerOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (openMenu && barRef.current && !barRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu, drawerOpen]);

  // The page behind the drawer does not scroll while it is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="site-header">
        <div className="wrap site-header__bar" ref={barRef}>
          <Link className="brand" href="/" aria-label={`${siteName} home`} onClick={closeAll}>
            <LogoMark />
            <span className="brand__full">{siteName}</span>
            <span className="brand__short">{shortName}</span>
          </Link>

          <nav className="primary-nav" aria-label="Primary">
            {items.map((item) =>
              item.menu ? (
                <div
                  key={item.label}
                  className="nav-item"
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") setOpenMenu(item.label);
                  }}
                  onPointerLeave={() => setOpenMenu((current) => (current === item.label ? null : current))}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setOpenMenu((current) => (current === item.label ? null : current));
                    }
                  }}
                >
                  <button
                    type="button"
                    className="nav-link"
                    aria-expanded={openMenu === item.label}
                    aria-controls={`menu-${item.label}`}
                    aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                    onClick={(event) => {
                      // A mouse click keeps the menu that hover already opened. Enter or Space (detail 0) toggles it.
                      if (event.detail === 0) setOpenMenu((current) => (current === item.label ? null : item.label));
                      else setOpenMenu(item.label);
                    }}
                  >
                    {item.label}
                    <ChevronDown size={15} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <div id={`menu-${item.label}`} className="dropdown" data-open={openMenu === item.label}>
                    <div className="dropdown__panel">
                      {item.menu.links.map((link) => (
                        <Link key={link.href} href={link.href} onClick={closeAll}>
                          <span className="dropdown__title">{link.label}</span>
                          {link.text && <span className="dropdown__text">{link.text}</span>}
                        </Link>
                      ))}
                      <Link href={item.href} className="dropdown__all" onClick={closeAll}>
                        {item.menu.allLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <ThemeToggle />

          <Link href="/contact" className="btn btn--primary site-header__cta">
            Let’s Talk
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            {drawerOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Outside the header on purpose: the header's backdrop blur would otherwise become the containing block for this fixed panel and shrink it to the header's height. */}
      <nav id="mobile-nav" className="drawer" data-open={drawerOpen} aria-label="Mobile">
        {items.map((item) =>
          item.menu ? (
            <details key={item.label}>
              <summary>
                {item.label}
                <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
              </summary>
              <div className="drawer__sub">
                {item.menu.links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeAll}>
                    {link.label}
                  </Link>
                ))}
                <Link href={item.href} onClick={closeAll} className="text-link">
                  {item.menu.allLabel}
                </Link>
              </div>
            </details>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="drawer__link"
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              onClick={closeAll}
            >
              {item.label}
            </Link>
          ),
        )}
        <Link href="/contact" className="btn btn--primary btn--lg drawer__cta" onClick={closeAll}>
          Let’s Talk
        </Link>
      </nav>
    </>
  );
}
