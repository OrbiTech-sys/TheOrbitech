import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
import "./styles/form.css";
import "./styles/home.css";
import "./styles/hero-text.css";
import "./styles/pin.css";
import "./styles/pages.css";

// Self-hosted variable fonts (Latin subset, files and licences in ./fonts), so neither
// `next dev` nor `next build` has to reach Google Fonts. Downloading them at compile time
// timed out on slow connections and broke the dev server.
const montserrat = localFont({
  src: "./fonts/montserrat-latin.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light dark",
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
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Sets the saved theme before the first paint, so a visitor who chose dark never sees a white flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: 'try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}',
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar items={navItems} siteName={site.name} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
