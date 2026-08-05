import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
// import { AuthProvider } from '@/context/AuthContext';

import Script from "next/script";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIXX',
  description: 'AIXX Platform',
  icons: {
    icon: '/images/logo/logo.png',
  },
  openGraph: {
    title: 'AIXX',
    description: 'AIXX Platform',
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
    title: 'AIXX',
    description: 'AIXX Platform',
    images: ['/images/logo/logo.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <Script
                src="https://cdn.ckeditor.com/ckeditor5/41.0.0/classic/ckeditor.js"
                strategy="beforeInteractive"
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
