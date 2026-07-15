import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import CourseCatalog from '@/components/public/CourseCatalog';

const CoursesPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner
        altText="Training Courses Banner"
        paths={[{ name: 'Home', href: '/' }, { name: 'Courses', href: '/courses' }]}
        title="Courses"
        subtitle="Structured course pathways for undergraduate and advanced AI programs."
        bgImage="/images/training_banner.png"
      />
      <CourseCatalog />
      <HomeContact />
    </div>
  );
};

export default CoursesPage;
