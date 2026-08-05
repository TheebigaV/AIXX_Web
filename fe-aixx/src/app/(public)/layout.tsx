'use client'; 
import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { AuthProvider } from '@/context/AuthContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <link rel="stylesheet" href="/css/style.css" />

      <div className="flex flex-col font-lato">
        <AuthProvider>
          <Header />
          <ToastContainer position="top-right" autoClose={3000} />
          <main className="flex-1 pt-[72px]">{children}</main>
          <Footer />
        </AuthProvider>
      </div>
    </div>
  );
};

export default PublicLayout;