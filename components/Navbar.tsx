"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="portfolio-header">
      <div className="wrap nav">
        <Link className="brand" href="/#top" aria-label="The OrbiTech Solutions home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <span>O</span>
          </span>
          <span>
            The OrbiTech <span className="gradient">Solutions</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <a href="/#capabilities">Capabilities</a>
          <a href="/#projects">Projects</a>
          <a href="/#approach">Our approach</a>
          <a href="/#contact">Contact</a>
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      <div className={`mobile-menu-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <a href="/#capabilities" onClick={closeMenu}>
          Capabilities
        </a>
        <a href="/#projects" onClick={closeMenu}>
          Projects
        </a>
        <a href="/#approach" onClick={closeMenu}>
          Our approach
        </a>
        <a href="/#contact" onClick={closeMenu}>
          Contact
        </a>
      </div>
    </header>
  );
}
