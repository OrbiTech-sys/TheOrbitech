import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/content/site";
import { DEFAULT_OG_IMAGE, organizationLd, siteUrl } from "@/lib/seo";
import "../tokens.css";
import "./globals.css";
import "./portfolio.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The OrbiTech Solutions | AI, Software & Business Growth",
    template: "%s | The OrbiTech Solutions",
  },
  description:
    "The OrbiTech Solutions delivers AI integration, intelligent automation, software engineering, data analytics, and business growth technology.",
  keywords: [
    "AI development",
    "AI automation",
    "software development",
    "web development",
    "data analytics",
    "business intelligence",
    "CRM automation",
    "SaaS MVP",
  ],
  applicationName: "The OrbiTech Solutions",
  authors: [{ name: "The OrbiTech Solutions" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "The OrbiTech Solutions | AI, Software & Business Growth",
    description:
      "The OrbiTech Solutions delivers AI integration, intelligent automation, software engineering, data analytics, and business growth technology.",
    url: "/",
    siteName: "The OrbiTech Solutions",
    locale: "en_US",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "The OrbiTech Solutions | AI, Software & Business Growth",
    description:
      "The OrbiTech Solutions delivers AI integration, intelligent automation, software engineering, data analytics, and business growth technology.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
