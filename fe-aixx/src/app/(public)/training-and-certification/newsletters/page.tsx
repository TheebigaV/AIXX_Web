import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';

const NewslettersPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner
        altText="Latest Technology News"
        paths={[{ name: 'Home', href: '/' }, { name: 'Latest Technology News', href: '/training-and-certification/newsletters' }]}
        title="Latest Technology News"
        subtitle="Curated news and insights on AI, ML, and emerging tech."
        bgImage="/images/training_banner.png"
      />
      <TrainingContent defaultTab="newsletters" />
      <HomeContact />
    </div>
  );
};

export default NewslettersPage;
