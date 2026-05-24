'use client';

import Link from 'next/link';

interface BreadcrumbProps {
  paths: { name: string; href?: string }[]; 
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <div className="w-full text-white text-sm sm:text-base font-medium flex items-center gap-[8px] pb-[8px]">
      {paths.map((path, index) => (
        <span key={index} className="flex items-center">
          {path.href ? (
            <Link
              href={path.href}
              className="hover:underline text-white/80"
            >
              {path.name}
            </Link>
          ) : (
            <span className="flex items-center text-white bg-gray-700 pl-2 pr-3 py-0.5 gap-2 font-medium border-l-4 border-brand-500">
              {path.name}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
