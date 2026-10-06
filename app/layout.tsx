import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "OrbiTech | Elite Software Engineering, High-Scale SaaS & AI Solutions",
  description:
    "OrbiTech architects and delivers mission-critical web applications, high-scale SaaS platforms, autonomous AI agents, and secure cloud systems with zero technical debt.",
  keywords: [
    "software engineering startup",
    "custom web apps",
    "SaaS development",
    "AI automation",
    "autonomous AI agents",
    "enterprise cybersecurity",
    "Next.js engineering",
    "backend systems",
    "cloud devops",
  ],
  authors: [{ name: "OrbiTech Engineering Team" }],
  openGraph: {
    title: "OrbiTech | Elite Software Engineering & AI Solutions",
    description:
      "We partner with visionary founders and enterprises to engineer scalable SaaS, custom web apps, and autonomous AI systems built with security-first architecture.",
    url: "https://orbitech.dev",
    siteName: "OrbiTech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrbiTech | Elite Software Engineering & AI Solutions",
    description:
      "Mission-critical web applications, AI automation, and secure high-scale architectures.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
