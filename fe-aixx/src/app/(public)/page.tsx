'use client';

import React from 'react';
import HomeBanner from '@/components/public/HomeBanner';
import StatsSection from '@/components/dashboard/StatsSection';
import HomeAbout from '@/components/public/HomeAbout';
import HomeServices from '@/components/public/HomeServicesAixx';
import HomeContact from '@/components/public/HomeContactAixx';
import HomeTrainingTracks from '@/components/public/HomeTrainingTracks';
import TrainingHighlights from '@/components/public/TrainingHighlights';

const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Full-width banner */}
      <HomeBanner />
        <StatsSection />

      {/* Other sections (content has its own padding) */}
      <div className="w-full">
        <HomeAbout />
        <HomeTrainingTracks />
        <TrainingHighlights />
        <HomeServices />
        <HomeContact />
      </div>
    </div>
  );
};

export default HomePage;
