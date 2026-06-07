import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Unauthorized Access</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          You do not have the required permissions to view this page or perform this action.
        </p>
        <Link href="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
