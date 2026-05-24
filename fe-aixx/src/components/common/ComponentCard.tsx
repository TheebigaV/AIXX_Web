import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Can from "@/components/permissions/Can";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  permission?: string;
  buttonName?: string;
  link?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
                                                       title,
                                                       children,
                                                       className = "",
                                                       desc = "",
                                                       permission,
                                                       buttonName,
                                                       link,
                                                     }) => {

  const showButton = permission && buttonName && link;

  return (
      <div
          className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
      >
        {/* Card Header */}
        <div className=" flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-6 py-5">
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
            {desc && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {desc}
                </p>
            )}
          </div>
          {showButton && (
              <Can permission={ permission as string}>
                <Link href={link as string}>
                  <Button>{buttonName}</Button>
                </Link>
              </Can>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
  );
};

export default ComponentCard;
