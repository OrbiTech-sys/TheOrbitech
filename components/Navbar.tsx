"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import BookingLink from "@/components/BookingLink";
import Wordmark from "@/components/Wordmark";
import { nav } from "@/content/site";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar() {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  // The menu is open only for the page it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  // Compact state: one observer, no scroll listener.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // While the menu is open: the page behind it is inert, Escape closes it, focus moves in.
  useEffect(() => {
    if (!open) return;
    const behind = [document.getElementById("main"), document.querySelector("footer")];
    behind.forEach((el) => el?.setAttribute("inert", ""));
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        toggleRef.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 60rem)");
    const onWide = () => wide.matches && setOpenPath(null);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      behind.forEach((el) => el?.removeAttribute("inert"));
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <div ref={sentinelRef} id="top" className="nav-sentinel" aria-hidden="true" />
      <header className="nav" data-scrolled={scrolled} data-open={open}>
        <div className="wrap nav__row">
          <div className="nav__pill" aria-hidden="true" />
          <Link href="/" className="wordmark" aria-label="OrbiTech, home">
            <Wordmark />
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="ulink"
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav__end">
            <BookingLink className="btn btn--ink btn--small nav__cta">Book a call</BookingLink>
            <button
              ref={toggleRef}
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpenPath(open ? null : pathname)}
            >
              {open ? <X size={18} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.75} aria-hidden="true" />}
              <span>{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>

        <div id="mobile-menu" ref={menuRef} className="menu" hidden={!open}>
          <nav className="wrap menu__nav" aria-label="Mobile">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="menu__link"
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <BookingLink className="btn btn--ink menu__cta">Book a 30-minute call</BookingLink>
          </nav>
        </div>
      </header>
    </>
  );
}
