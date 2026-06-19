'use client';

import React from 'react';
import Link from 'next/link';
import { FaLightbulb, FaLaptopCode, FaUsers, FaCertificate, FaChartLine, FaClock } from 'react-icons/fa';

const overviewItems = [
  {
    title: 'Programs for Every Role',
    description: 'Executive, developer, and team training tracks with clear program outcomes.',
    icon: FaUsers,
  },
  {
    title: 'Hands-On Lab Experience',
    description: 'Real project work, AI tool practice, and guided deployment sessions.',
    icon: FaLaptopCode,
  },
  {
    title: 'Corporate Training Packages',
    description: 'Group programs, workshops, and team-based learning plans for enterprises.',
    icon: FaChartLine,
  },
  {
    title: 'Fast Certification Path',
    description: 'Build skills with certification-ready curricula designed for immediate impact.',
    icon: FaCertificate,
  },
  {
    title: 'Flexible Delivery',
    description: 'Self-paced, remote instructor-led, and classroom options in Singapore.',
    icon: FaClock,
  },
  {
    title: 'AI Strategy Guidance',
    description: 'Learn the practical steps to adopt AI, mitigate risk, and unlock business value.',
    icon: FaLightbulb,
  },
];

const TrainingOverview = () => (
  <section className="w-full bg-[#F7FAFC] py-20">
    <div className="container mx-auto px-4 sm:px-6 md:px-8 xl:px-16 2xl:px-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600 font-semibold mb-4">
          Training + Certification
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
          Build AI capability with practical programs.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          AIXX combines technical training, business strategy, and implementation support into learning journeys that deliver measurable results.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {overviewItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-brand-50 text-brand-600 mb-5">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#111827] mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-700 transition-colors duration-300"
        >
          Request a Training Proposal
        </Link>
      </div>
    </div>
  </section>
);

export default TrainingOverview;
