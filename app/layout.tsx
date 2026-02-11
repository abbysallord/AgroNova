import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AgroNova | AI-Powered Smart Farming Assistant",
    template: "%s | AgroNova",
  },
  description: "Empowering Indian farmers with AI-driven insights, pest detection, real-time market prices, and weather updates. Join the smart farming revolution.",
  keywords: [
    "AgroNova",
    "Agronova",
    "agronova",
    "Smart Farming",
    "Agriculture AI",
    "Kisan App",
    "Market Prices",
    "Crop Doctor",
    "Weather Forecast",
    "Indian Agriculture",
    "AgriTech",
    "Pest Detection",
    "Farming Community"
  ],
  authors: [{ name: "AgroNova Team" }],
  creator: "AgroNova",
  publisher: "AgroNova",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://agronova-app.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AgroNova | AI-Powered Smart Farming Assistant",
    description: "Empowering Indian farmers with AI-driven insights, pest detection, and real-time market prices.",
    url: "https://agronova-app.vercel.app",
    siteName: "AgroNova",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgroNova Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgroNova | AI-Powered Smart Farming Assistant",
    description: "Empowering Indian farmers with AI-driven insights, pest detection, and real-time market prices.",
    images: ["/og-image.png"],
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/landing/ChatWidget";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${montserrat.className} antialiased font-sans`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="agronova-dark-theme"
          >
            {children}
          </ThemeProvider>
          <Toaster />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
