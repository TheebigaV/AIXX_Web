'use client';

import React from 'react';
import HomeBanner from '@/components/public/HomeBanner';
import HomeAbout from '@/components/public/HomeAbout';
import HomeServices from '@/components/public/HomeServicesAixx';
import HomeContact from '@/components/public/HomeContactAixx';

const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Full-width banner */}
      <HomeBanner />

      {/* Other sections (content has its own padding) */}
      <div className="w-full">
        <div className=' '>
          <HomeAbout />
        </div>
        
        <div className=''>
            <HomeServices />
        </div>
      
        {/* Projects and Products sections removed */}

        <div className=''>
            <HomeContact />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
