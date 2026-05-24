"use client";

import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-700">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-2" />
            <p className="text-base text-blue-600">{message}</p>
        </div>
    );
};

export default LoadingSpinner;

