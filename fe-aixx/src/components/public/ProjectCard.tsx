'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';

interface ProjectCardProps {
  id: string;
  slug?: string; // ✅ Add slug prop
  image: string;
  date: string;
  title: string;
  description: string;
  category?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  slug,
  image,
  date,
  title,
  description,
  category,
}) => {
  const href = `/projects/${slug || id}`;

  return (
    <Link
      href={href} 
      className="group relative block w-full h-[390px] sm:h-[390px] sm:w-full md:h-[348px] lg:h-[448px] xl:h-[420px] xlmid:h-[390px] 2xl:h-[392px] overflow-hidden sm:mb-[20px] md:mb-0"
    >
      {/* Background Image */}
      <Image
        src={image || '/placeholder.jpg'}
        alt={title}
        fill
        className="object-cover object-center angle-corner-btn1 transition-transform duration-300 group-hover:scale-105"
      />

      {/* Content Box */}
      <div
        className="absolute bottom-[20px] left-[16px] right-[20px] z-20 bg-white text-[#191E42] p-[16px]
                   shadow-lg transition-all duration-300 ease-in-out
                   group-hover:-translate-y-2 group-hover:shadow-xl"
      >
        <div className="flex justify-between items-start mb-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-800 font-light">
            <FiCalendar className="w-4 h-4 text-black" />
            <span>{date}</span>
          </div>

          {/* Arrow */}
          <div className="absolute top-0 right-0 bg-brand-500 w-[44px] h-[44px] flex items-center justify-center shadow-md">
            <svg
              className="w-7 h-7 text-white transform -rotate-45"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.95 6.293a1 1 0 00-1.414 1.414L13.586 11H3a1 1 0 100 2h10.586l-2.043 2.043a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4z" />
            </svg>
          </div>
        </div>

        {/* Optional Category */}
        {category && <p className="text-xs text-gray-500 mb-1">{category}</p>}

        {/* Title */}
        <h3 className="text-lg md:text-xl font-semibold line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-800 mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;