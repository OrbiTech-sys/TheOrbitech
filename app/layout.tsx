import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-config";
import "../tokens.css";
import "./globals.css";
import "./portfolio.css";
import "./inner.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090d1b",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
