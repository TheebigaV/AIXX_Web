'use client';

import React from 'react';
import { FaCheckCircle, FaUsers, FaClock, FaCertificate } from 'react-icons/fa';

const highlights = [
  {
    title: 'Hands-on Learning',
    description: 'Interactive sessions, real use cases, and live technical labs for faster skill adoption.',
    icon: FaCheckCircle,
  },
  {
    title: 'Enterprise Ready',
    description: 'Curriculum built for teams, HR, and leadership with practical outcomes and measurable value.',
    icon: FaUsers,
  },
  {
    title: 'Flexible Delivery',
    description: 'Online, live remote, and classroom options for Singapore, SEA and remote corporate learners.',
    icon: FaClock,
  },
  {
    title: 'Certification Focused',
    description: 'Program tracks designed to deliver certification readiness and AI capability confidence.',
    icon: FaCertificate,
  },
];

const TrainingHighlights = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 xl:px-16 2xl:px-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600 font-semibold mb-4">
            Why AIXX Training
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
            The smart way to build AI capability.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            The AIXX learning experience is designed to make your team confident with modern AI tools, frameworks, and business applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xlmid:grid-cols-4 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl sm:rounded-[28px] border border-slate-200 bg-[#FAFAFA] p-6 sm:p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="mx-auto inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-4 sm:mb-5">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrainingHighlights;
