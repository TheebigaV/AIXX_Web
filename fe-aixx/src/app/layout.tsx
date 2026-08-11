import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
// import { AuthProvider } from '@/context/AuthContext';

import Script from "next/script";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'AIXX | Enterprise AI & Productivity Academy',
    template: '%s | AIXX',
  },
  description: 'AIXX Academy — Master enterprise-grade AI tools, generative AI, machine learning, and quantum computing to optimize workflows and drive organizational efficiency.',
  icons: {
    icon: '/images/logo/logo.png',
    shortcut: '/images/logo/logo.png',
    apple: '/images/logo/logo.png',
  },
  openGraph: {
    title: 'AIXX | Enterprise AI & Productivity Academy',
    description: 'Master enterprise-grade AI tools, generative AI, machine learning, and quantum computing with AIXX Academy.',
    images: [
      {
        url: '/images/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'AIXX Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIXX | Enterprise AI & Productivity Academy',
    description: 'Master enterprise-grade AI tools, generative AI, machine learning, and quantum computing with AIXX Academy.',
    images: ['/images/logo/logo.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <link rel="icon" href="/images/logo/logo.png" type="image/png" />
            <link rel="shortcut icon" href="/images/logo/logo.png" />
            <link rel="apple-touch-icon" href="/images/logo/logo.png" />
            {/* CKEditor loaded lazily — does not block page render */}
            <Script
                src="https://cdn.ckeditor.com/ckeditor5/41.0.0/classic/ckeditor.js"
                strategy="lazyOnload"
            />
        </head>

        <body className="dark:bg-gray-900">
        <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
