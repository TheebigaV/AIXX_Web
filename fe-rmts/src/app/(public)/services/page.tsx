import React, { Suspense } from 'react';
import Banner from '@/components/public/Banner';
import HomeServices from '@/components/public/HomeServicesAixx';
import HomeContact from '@/components/public/HomeContactAixx';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner 
        altText="AIXX Services Banner" 
      />
      <Suspense fallback={<div>Loading services...</div>}>
        <HomeServices isHomePage={false} />
      </Suspense>
      <HomeContact />
    </div>
  );
};

export default ServicesPage;