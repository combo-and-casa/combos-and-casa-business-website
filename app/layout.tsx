import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { organizationSchema } from "@/lib/structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Combos & Casa | Premium Fitness, Fine Dining & Event Space",
    template: "%s | Combos & Casa"
  },
  description: "Experience the ultimate lifestyle destination combining Fresh & Fit gym, Nankwaase Bar & Restaurant fine dining, and elegant event spaces for weddings, corporate events, and celebrations.",
  keywords: [
    "fitness center",
    "gym",
    "restaurant",
    "bar",
    "event space",
    "wedding venue",
    "corporate events",
    "fine dining",
    "fitness membership",
    "event booking",
    "Fresh & Fit",
    "Nankwaase Bar",
    "luxury venue"
  ],
  authors: [{ name: "Combos & Casa" }],
  creator: "Combos & Casa",
  publisher: "Combos & Casa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Combos & Casa",
    title: "Combos & Casa | Premium Fitness, Fine Dining & Event Space",
    description: "Experience the ultimate lifestyle destination combining Fresh & Fit gym, Nankwaase Bar & Restaurant fine dining, and elegant event spaces.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Combos & Casa - Premium Lifestyle Destination",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Combos & Casa | Premium Fitness, Fine Dining & Event Space",
    description: "Experience the ultimate lifestyle destination combining Fresh & Fit gym, Nankwaase Bar & Restaurant fine dining, and elegant event spaces.",
    images: ["/twitter-image.jpg"],
    creator: "@combosandcasa",
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationSchema} />
      </head>
      <body
        className={`min-h-screen bg-[#0A0A0A] text-white ${inter.variable} ${poppins.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
