'use client';

import React from 'react';
import Image from 'next/image';

interface StatCardProps {
  iconSrc: string;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ iconSrc, value, label }) => {
  return (
    <div className="flex items-center gap-4 w-full px-2 sm:px-[32px] py-[22px]">
      {/* Icon inside a white circle */}
      <div className="w-[84px] h-[84px] sm:w-[84px] sm:h-[84px] bg-white flex items-center justify-center shadow-md shrink-0">
        <Image
          src={iconSrc}
          alt={label}
          width={52}
          height={52}
          className="object-contain"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = 'https://placehold.co/52x52/ffffff/000000?text=Icon';
          }}
        />
      </div>

      {/* Stat text */}
      <div className="text-left">
        <p className="text-xl sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold text-white leading-snug">
          {value}
        </p>
        <p className="text-[16px] sm:text-[16px] md:text-[18px] font-medium text-gray-300">
          {label}
        </p>
      </div>
    </div>
  );
};

const AboutContents: React.FC = () => {
  return (
    <section className="bg-[#00062A] w-full">
      <div className="mx-auto container  py-10 px-[36px] sm:px-[24px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px]">
        <div className="grid grid-cols-1 xlmid:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                    {/* Card 1 */}
          <div className="flex justify-center xlmid:border-r xlmid:border-white/20 ">
            <StatCard
              iconSrc="/images/aboutus/experience.svg"
              value="Next-Gen"
              label="AI & Quantum"
            />
          </div>

          {/* Card 2 */}
          <div className="flex justify-center xlmid:border-r xlmid:border-white/20">
            <StatCard
              iconSrc="/images/aboutus/project3.svg"
              value="Global"
              label="Tech Ecosystems"
            />
          </div>

          {/* Card 3 */}
          <div className="flex justify-center xlmid:border-r xlmid:border-white/20">
            <StatCard
              iconSrc="/images/aboutus/product.svg"
              value="13"
              label="Specialized Sectors"
            />
          </div>

          {/* Card 4 */}
          <div className="flex justify-center">
            <StatCard
              iconSrc="/images/aboutus/client.svg"
              value="Scalable"
              label="Digital Solutions"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContents;
