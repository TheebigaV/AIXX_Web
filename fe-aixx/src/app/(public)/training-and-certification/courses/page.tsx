import React from 'react';
import Banner from '@/components/public/Banner';
import HomeContact from '@/components/public/HomeContactAixx';
import TrainingContent from '@/components/public/TrainingContent';

const TrainingCoursesPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Banner
        altText="Training Courses Banner"
        paths={[{ name: 'Home', href: '/' }, { name: 'Courses', href: '/training-and-certification/courses' }]}
        title="Courses"
        subtitle="Structured course pathways for undergraduate and advanced AI programs."
        bgImage="/images/training_banner.png"
      />
      <TrainingContent defaultTab="courses" />
      <HomeContact />
    </div>
  );
};

export default TrainingCoursesPage;
