import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
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
