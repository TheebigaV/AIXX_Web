import React from 'react';
import AiHotNewsBanner from '@/components/public/AiHotNewsBanner';
import AiHotNewsContent from '@/components/public/AiHotNewsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI-Hot News & Free AI Knowledge Certificate | AIXX Academy',
  description: 'Read the latest AI-Hot News and claim your Free AI Knowledge Certificate 2026. Test your AI literacy across LLMs, RAG, Prompt Engineering, and Ethics.',
};

const AiHotNewsPage = () => {
  return (
    <div className="w-full bg-white">
      <AiHotNewsBanner />
      <AiHotNewsContent />
    </div>
  );
};

export default AiHotNewsPage;
