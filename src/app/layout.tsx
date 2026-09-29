import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { getCurrentUser } from "@/lib/auth";
import { Toaster } from "@/components/ui/toast";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import StructuredData from "@/components/structured-data";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://altitude.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Altitude - AI Candidate Search & Resume Intelligence",
    template: "%s | Altitude",
  },
  description:
    "Find top candidate talent in seconds. Altitude gives recruiters and hiring managers an AI-powered platform to search, score, and rank PDF resumes using natural language vector search.",
  keywords: [
    "AI candidate search",
    "resume parser",
    "vector resume matching",
    "talent acquisition AI",
    "semantic candidate search",
    "AI recruitment software",
    "smart resume filter",
    "HR intelligence platform",
  ],
  authors: [{ name: "Altitude AI Team" }],
  creator: "Altitude",
  publisher: "Altitude",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Altitude - AI Candidate Search & Resume Intelligence",
    description:
      "Find top candidates in seconds. Search, score, and rank PDF resumes with conversational natural language intelligence.",
    url: siteUrl,
    siteName: "Altitude",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Altitude - AI Candidate Search & Resume Intelligence",
    description:
      "Find top candidates in seconds. Search, score, and rank PDF resumes with conversational natural language intelligence.",
    creator: "@altitude_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const currentUser = await getCurrentUser();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <head>
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XN4Y8B2P2H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XN4Y8B2P2H');
          `}
        </Script>
        <Toaster />
        <Providers
          currentUser={currentUser ? {
            id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image,
          } : null}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
