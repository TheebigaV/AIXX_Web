import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';

const TrainingCertificationPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner
        altText="Certification Training Banner"
        paths={[{ name: 'Home', href: '/' }, { name: 'Certification', href: '/training-and-certification/certification' }]}
        title="Certification"
        subtitle="Credential preparation and certification pathways for AI professionals."
        bgImage="/images/training_banner.png"
      />
      <TrainingContent defaultTab="certification" />
      <HomeContact />
    </div>
  );
};

export default TrainingCertificationPage;
