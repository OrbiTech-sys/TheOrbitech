import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar, { type NavItem } from "@/components/layout/Navbar";
import { industryPages } from "@/content/industries";
import { servicePages } from "@/content/offerings";
import { nav, site } from "@/content/site";
import { siteUrl } from "@/lib/site-config";
import "./globals.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/home.css";
import "./styles/pages.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080b12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Canonical, Open Graph and Twitter tags are set per page (lib/seo.ts), never here:
// metadata set in the root layout is inherited by every route, including the 404 page.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.tagline} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  applicationName: site.name,
  authors: [{ name: site.name }],
};

/** The primary navigation: the links from content, with a menu under Services and Industries. */
const navItems: NavItem[] = nav.map((item) => {
  if (item.href === "/services") {
    return {
      ...item,
      menu: {
        allLabel: "All services",
        links: servicePages.map((page) => ({ label: page.navLabel, href: `/services/${page.slug}`, text: page.navText })),
      },
    };
  }
  if (item.href === "/industries") {
    return {
      ...item,
      menu: {
        allLabel: "All industries",
        links: industryPages.map((page) => ({ label: page.name, href: `/industries/${page.slug}`, text: page.summary })),
      },
    };
  }
  return item;
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar items={navItems} siteName={site.name} shortName={site.shortName} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
