import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import {ThemeProvider} from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {AuthProvider} from "@/context/AuthContext";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="relative bg-white z-1 dark:bg-gray-900">
                <ThemeProvider>
                    <div className="relative flex w-full h-screen dark:bg-gray-900">
                        {/* Left Side Branding */}
                        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-brand-50 relative overflow-hidden">
                            <div className="absolute inset-0 bg-brand-500/5 mix-blend-multiply pointer-events-none" />
                            <div className="relative z-10 text-center px-10 flex flex-col items-center">
                                <Link href="/" className="inline-block mb-10">
                                    <Image src="/images/logo.png" width={220} height={70} alt="AIXX Logo" className="mx-auto drop-shadow-sm" />
                                </Link>
                                <h2 className="text-3xl font-bold text-gray-900 mb-5">Welcome to AIXX</h2>
                                <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                                    Pioneering the future of AI. Log in or register to access exclusive features, training programs, and your personalized dashboard.
                                </p>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                            <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
                        </div>
                        
                        {/* Right Side Content */}
                        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full overflow-y-auto bg-white dark:bg-gray-950">
                            {children}
                        </div>
                    </div>
                </ThemeProvider>
            </div>
        </AuthProvider>
    );
}