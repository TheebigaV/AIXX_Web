import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';

const TrainingAndCertificationPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner 
        altText="Training & Certification Banner" 
        paths={[{ name: 'Home', href: '/' }, { name: 'Training & Certification' }]}
        title="Training & Certification"
        subtitle="Empowering your workforce with the skills needed for tomorrow's technology."
      />
      
      <TrainingContent />

      <HomeContact />
    </div>
  );
};

export default TrainingAndCertificationPage;
