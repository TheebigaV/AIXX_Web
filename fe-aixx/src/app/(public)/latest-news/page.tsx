import React from 'react';
import LatestNewsBanner from '@/components/public/LatestNewsBanner';
import LatestNewsContent from '@/components/public/LatestNewsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest News & Free AI Knowledge Certificate | AIXX Academy',
  description: 'Read the latest AIXX news and claim your Free AI Knowledge Certificate 2026. Test your AI literacy across LLMs, RAG, Prompt Engineering, and Ethics.',
};

const LatestNewsPage = () => {
  return (
    <div className="w-full bg-white">
      <LatestNewsBanner />
      <LatestNewsContent />
    </div>
  );
};

export default LatestNewsPage;
