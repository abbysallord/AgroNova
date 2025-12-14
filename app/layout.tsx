import type { Metadata } from "next";
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

export const metadata = {
  title: 'AgroNova | Smart Farming for a Better Future',
  description: 'Empowering Indian farmers with AI-driven insights, pest detection, and real-time market prices.',
  openGraph: {
    title: 'AgroNova | Smart Farming for a Better Future',
    description: 'Empowering Indian farmers with AI-driven insights, pest detection, and real-time market prices.',
    url: 'https://agronova-app.vercel.app',
    siteName: 'AgroNova',
    images: [
      {
        url: 'https://agronova-app.vercel.app/og-image.png', // Must match the file name in your public folder
        width: 1200,
        height: 630,
        alt: 'AgroNova Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider defaultTheme="light">
             {children}
          </ThemeProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
