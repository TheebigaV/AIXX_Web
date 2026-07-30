import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';

const TrainingWorkshopsPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner
        altText="Training Workshops Banner"
        paths={[{ name: 'Home', href: '/' }, { name: 'Workshops', href: '/training-and-certification/workshops' }]}
        title="Training Workshops"
        subtitle="Hands-on workshops designed for practical AI capability building."
        bgImage="/images/training_banner.png"
      />
      <TrainingContent defaultTab="workshops" hideTabs={true} />
      <HomeContact />
    </div>
  );
};

export default TrainingWorkshopsPage;
