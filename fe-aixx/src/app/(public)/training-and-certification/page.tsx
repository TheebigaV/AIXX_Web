import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';
import TrainingOverview from '@/components/public/TrainingOverview';

const TrainingAndCertificationPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner 
        altText="Training & Certification Banner" 
        paths={[{ name: 'Home', href: '/' }, { name: 'Training & Certification' }]}
        title="AI Training & Certification"
        subtitle="Practical learning tracks for executives, developers, and corporate teams."
        bgImage="/images/training_banner.png"
      />
      
      <TrainingOverview />
      <TrainingContent />

      <HomeContact />
    </div>
  );
};

export default TrainingAndCertificationPage;
