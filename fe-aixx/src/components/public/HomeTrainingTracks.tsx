'use client';

import React from 'react';
import Link from 'next/link';
import { FaBrain, FaLightbulb, FaLaptopCode, FaUsers, FaRobot, FaAtom } from 'react-icons/fa';

const tracks = [
  {
    title: 'Generative AI',
    description: 'Practical LLM workflows, prompt design, and business use cases for modern teams.',
    icon: FaBrain,
    href: '/training-and-certification',
  },
  {
    title: 'Prompt Engineering',
    description: 'Design reliable prompts for marketing, operations, and AI automation.',
    icon: FaLightbulb,
    href: '/training-and-certification',
  },
  {
    title: 'AI for Developers',
    description: 'Hands-on coding, model deployment, and AI application development.',
    icon: FaLaptopCode,
    href: '/training-and-certification',
  },
  {
    title: 'AI Leadership',
    description: 'Executive programs for strategy, governance, and AI transformation.',
    icon: FaUsers,
    href: '/training-and-certification',
  },
  {
    title: 'Agentic AI Systems',
    description: 'Build intelligent agent workflows for automation and decision support.',
    icon: FaRobot,
    href: '/training-and-certification',
  },
  {
    title: 'Quantum AI Fundamentals',
    description: 'Foundations of quantum computing for advanced AI research and strategy.',
    icon: FaAtom,
    href: '/training-and-certification',
  },
];

const HomeTrainingTracks = () => {
  return (
    <section className="w-full bg-[#F8FBFF] py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 xl:px-16 2xl:px-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600 font-semibold mb-4">
            AI Training Tracks
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
            Learning pathways built for professionals and teams.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Start with the right program for your role and objectives — training designed to move your organisation from strategy to execution.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <Link
                key={track.title}
                href={track.href}
                className="group block rounded-[30px] bg-white border border-slate-200 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-6 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827] mb-3">
                    {track.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                    {track.description}
                  </p>
                  <span className="text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                    Learn more →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeTrainingTracks;
