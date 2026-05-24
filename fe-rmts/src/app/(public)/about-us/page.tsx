import AboutContent from '@/components/public/AboutContent';
import AboutContents from '@/components/public/AboutContents';
import AboutUsBanner from '@/components/public/AboutUsBanner';
import ChooseUs from '@/components/public/ChooseUs';
import Journey from '@/components/public/Journey';
import React from 'react';

const AboutUsPage = () => {
  return (
    <div>
    <div className='bg-white'>
      <AboutUsBanner/>
      <div >
        <AboutContent/>
      </div>
      <div>
        <AboutContents/>
      </div>
      <div>
        <ChooseUs/>
      </div>
      <div>
        <Journey/>
      </div>
    </div>
    </div>
  );
};

export default AboutUsPage; 