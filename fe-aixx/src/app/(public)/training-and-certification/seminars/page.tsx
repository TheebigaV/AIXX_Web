import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';

const TrainingSeminarsPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner
        altText="Training Seminars Banner"
        paths={[{ name: 'Home', href: '/' }, { name: 'Seminars', href: '/training-and-certification/seminars' }]}
        title="Training Seminars"
        subtitle="Focused seminar programs for rapid AI insight and strategy adoption."
        bgImage="/images/training_banner.png"
      />
      <TrainingContent defaultTab="seminars" hideTabs={true} />
      <HomeContact />
    </div>
  );
};

export default TrainingSeminarsPage;
