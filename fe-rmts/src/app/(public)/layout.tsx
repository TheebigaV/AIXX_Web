'use client'; 
import { Lato } from 'next/font/google';
import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
});

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <link rel="stylesheet" href="/css/style.css" />

    <div className={`${lato.variable} flex flex-col font-lato`}>
        <Header />
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="flex-1 pt-[67px] sm:pt-[67px] md:pt-[90px]">{children}</main>
        <Footer />
      </div>
      </div>
  );
};

export default PublicLayout;