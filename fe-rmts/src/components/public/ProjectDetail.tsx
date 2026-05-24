'use client';

import React, { useEffect } from 'react';
import ProjectCard from '@/components/public/ProjectCard';
import useProjects from '@/hooks/public/useProjects';
import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface ProjectDetailProps {
  project: any;
}

interface ImageType {
  id?: string | number;
  url: string;
  alt?: string;
}

interface ImageCarouselProps {
  allImages: ImageType[];
  projectTitle: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ allImages, projectTitle }) => {
  if (!allImages || allImages.length === 0) return null;

  return (
    <div>
      {/* Grid view for large screens */}
      <div className="hidden xlmid:grid gap-[12px] md:gap-[12px] xlmid-gap:[20px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xlmid:grid-cols-3">
        {allImages.map((img, index) => (
          <img
            key={img.id || index}
            src={img.url}
            alt={img.alt || projectTitle}
            className="w-full sm:h-[306px] md:h-[300px] lg:h-[280px] xl:h-[336px] object-cover shadow"
          />
        ))}
      </div>

      {/* Carousel for mobile/tablet */}
      <div className="block xlmid:hidden">
        <Swiper
          className='h-[250px] w-full'
          modules={[Pagination]}
          pagination={{
            clickable: true,
            renderBullet: (index, className) =>
              `<span class="${className} custom-bullet"></span>`,
          }}
          spaceBetween={12}
          autoHeight={true}
          breakpoints={{
            360: { slidesPerView: 1 }, // ≥360px → 1 image
            600: { slidesPerView: 2 }, // ≥600px → 2 images
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {allImages.map((img, index) => (
            <SwiperSlide key={img.id || index}>
              <img
                src={img.url}
                alt={img.alt || projectTitle}
                className="w-full sm:h-[306px] md:h-[300px] lg:h-[280px] xl:h-[336px] sm:w-[328px] md:w-[270px] lg:w-[354px] xl:w-[413.33px] 2xl:w-[466.67px] object-cover shadow"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const { projects: randomProjects, loadRandomProjects, loading, error } = useProjects();

  useEffect(() => {
    if (project?.id) {
      loadRandomProjects(6, project.id); // ✅ Exclude current project
    }
  }, [project?.id]); // ✅ Add dependency

  if (!project) {
    return (
      <div className="w-full py-8">
        <div className=" text-center p-8">
          <p className="text-red-500">Project details not found.</p>
        </div>
      </div>
    );
  }

  // Combine thumbnail + gallery images
  const allImages = project.images || [];

  // Show only first 3 projects
  const projectsToShow = randomProjects.slice(0, 3);

  return (
    <div className="w-full py-5">
      {/* Main Project Details */}
      <div className="container mx-auto sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px]">
        <h2 className="sm:text-[20px] md:text-[24px] font-semibold mb-4 md:mb-6 text-left">
          {project.title}
        </h2>

        {project.description && (
          <div
            className="text-gray-700 leading-relaxed text-justify sm:text-[14px] md:text-[16px]
               [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        )}

        {/* ✅ Reusable Carousel */}
        <ImageCarousel allImages={allImages} projectTitle={project.title} />
      </div>

      {/* Explore More Projects */}
      <div className="mt-12 container mx-auto px-[16px] sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px]">
        {/* Heading + View More (desktop only) */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold">
            Explore More Projects
          </h3>
          {randomProjects.length > 0 && (
            <Link
              href="/projects"
              className="relative beveled-corner3 hidden md:block px-8 py-3 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors duration-300"
              aria-label="View more projects"
            >
              View More
            </Link>
          )}
        </div>

        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Grid for desktop */}
        <div className="hidden xlmid:grid gap-[20px] sm:grid-cols-1 lg:grid-cols-2 xlmid:grid-cols-3">
          {projectsToShow.map((proj: any, index: number) => (
            <ProjectCard
              key={proj.id || index}
              id={String(proj.id || index)}
              slug={proj.slug} // ✅ Add this
              title={proj.title || "Untitled Project"}
              description={proj.description.replace(/<[^>]+>/g, "")}
              date={proj.date || ""}
              image={proj.images?.[0]?.url || proj.thumbnail_image?.url || ""}
              category={proj.category?.name || ""}
            />
          ))}
        </div>

        {/* Carousel for mobile/tablet */}
        <div className="block xlmid:hidden gap-[20px]">
          <Swiper
            className="w-full h-[250px]"
            modules={[Pagination]}
            pagination={{
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className} custom-bullet"></span>`,
            }}
            autoHeight={true}
            spaceBetween={16}
            breakpoints={{
              360: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              768: { slidesPerView: 2 },

            }}
          >
            {projectsToShow.map((proj: any, index: number) => (
              <SwiperSlide key={proj.id || index}>
                <ProjectCard
                  id={String(proj.id || index)}
                  slug={proj.slug} // ✅ Add this
                  title={proj.title || "Untitled Project"}
                  description={proj.description.replace(/<[^>]+>/g, "")}
                  date={proj.date || ""}
                  image={proj.images?.[0]?.url || proj.thumbnail_image?.url || ""}
                  category={proj.category?.name || ""}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ✅ View More button for mobile (only 360px–550px) */}
          {randomProjects.length > 0 && (
            <div className="flex justify-center mt-6 sm:block md:hidden">
              <Link
                href="/projects"
                className="relative beveled-corner w-full text-center px-8 py-3 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors duration-300 block"
              >
                View More
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProjectDetail;
