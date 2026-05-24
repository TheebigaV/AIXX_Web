import { Outfit, Lato } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
// import { AuthProvider } from '@/context/AuthContext';

import Script from "next/script";

const outfit = Outfit({
  subsets: ['latin'],
});

import type { Metadata } from 'next';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'AIXX',
  description: 'AIXX Platform',
  icons: {
    icon: '/images/logo/logo-icon.svg',
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
            <Script
                src="https://cdn.ckeditor.com/ckeditor5/41.0.0/classic/ckeditor.js"
                strategy="beforeInteractive"
            />
        </head>

        <body className={`${lato.className} dark:bg-gray-900`}>
        <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
