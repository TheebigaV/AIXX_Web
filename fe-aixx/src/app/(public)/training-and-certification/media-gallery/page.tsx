import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';

const MediaGalleryPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner
        altText="Training Media Gallery"
        paths={[{ name: 'Home', href: '/' }, { name: 'Training Media Gallery', href: '/training-and-certification/media-gallery' }]}
        title="Training Media Gallery"
        subtitle="Photos, certificates and event highlights from our programs."
        bgImage="/images/training_banner.png"
      />
      <TrainingContent defaultTab="media_gallery" hideTabs={true} />
      <HomeContact />
    </div>
  );
};

export default MediaGalleryPage;
