'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import useProjects from '@/hooks/public/useProjects';
import { ProjectTableData } from '@/types/project';

const HomeProjects = () => {
  const { projects, loading, error, loadProjects } = useProjects();
  const [projectsPerPage, setProjectsPerPage] = useState(8);
  const [slides, setSlides] = useState<ProjectTableData[][]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Load projects initially
  useEffect(() => {
    loadProjects(1, projectsPerPage);
  }, [projectsPerPage]);

  // Track window width
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prepare slides for 600px and below
  useEffect(() => {
    if (windowWidth <= 600) {
      let perSlide = 1;
      const chunked: ProjectTableData[][] = [];
      for (let i = 0; i < projects.length; i += perSlide) {
        chunked.push(projects.slice(i, i + perSlide));
      }
      setSlides(chunked);
      setActiveSlide(0);
    } else {
      setSlides([]);
    }
  }, [projects, windowWidth]);

  // Auto-advance carousel (optional)
  useEffect(() => {
    if (windowWidth <= 600 && slides.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide(prev => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length, windowWidth]);

  // Handle dot click
  const handleDotClick = (index: number) => {
    setActiveSlide(index);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full text-center py-50">
        <p>Loading projects...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p>No projects found.</p>
      </div>
    );
  }

  return (
    <div className={`w-full container mx-auto px-2 sm:px-[16px] lg:px-[24px] xl:px-[80px] 2xl:px-[240px] bg-[#FAFAFA] 
  ${windowWidth <= 360
        ? '-mt-16 pt-2 pb-16'
        : windowWidth <= 767
          ? '-mt-12 pt-2 pb-16'
          : 'py-18'}
`}>
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 ${windowWidth <= 600 ? 'mb-20' : 'mb-10'}`}>
        <div className="text-left">
          <h2 className="text-base sm:text-lg lg:text-xl font-normal text-brand-500 mb-2 lg:mb-3">
            Projects
          </h2>
          <p className="text-2xl mb-6 text-blue-900 font-semibold">
            Projects That Speak for Our Service
          </p>
          <p className="text-gray-600 text-base max-w-2xl">
            Every AIXX project reflects trust, precision, and transformative impact. From intelligent infrastructure to digital ecosystems, we help organizations build future-ready systems.
          </p>
        </div>
        {/* View More Button for desktop only */}
        <div className="hidden min-[768px]:block">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-500 text-white text-sm font-semibold transition hover:bg-brand-600 beveled-corner w-[160px] h-[49px]"
            aria-label="View all projects"
          >
            <span>View More</span>
          </Link>
        </div>
      </div>

      {/* Projects Cards */}
      {windowWidth <= 600 && slides.length > 0 ? (
        // 600px and below → Carousel with one card
        <div className="overflow-hidden relative mt-16">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                {slide.map(project => (
                  <ProjectCard
                    key={project.id}
                    id={String(project.id)}
                    title={project.title || 'Untitled Project'}
                    description={project.description?.replace(/<[^>]+>/g, '')}
                    date={project.date || ''}
                    image={project.thumbnail_image?.url || ''}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {slides.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${index === activeSlide
                  ? 'bg-[#191E42] w-6 h-3'
                  : 'bg-gray-300 w-3 h-3'
                  } rounded-none`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      ) : windowWidth <= 1023 ? (
        // 768px → Horizontal scroll (1 full card + half of next) - MORE visible half
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {projects.map(project => (
            <div key={project.id} className="snap-start flex-shrink-0 w-[65%]">
              <ProjectCard
                id={String(project.id)}
                title={project.title || 'Untitled Project'}
                description={project.description?.replace(/<[^>]+>/g, '')}
                date={project.date || ''}
                image={project.thumbnail_image?.url || ''}
              />
            </div>
          ))}
        </div>
      ) : windowWidth < 1600 ? (
        // 1400px → Only 3 cards in one row
        <div className="grid grid-cols-3 gap-6">
          {projects.slice(0, 3).map(project => (
            <ProjectCard
              key={project.id}
              id={String(project.id)}
              title={project.title || 'Untitled Project'}
              description={project.description?.replace(/<[^>]+>/g, '')}
              date={project.date || ''}
              image={project.thumbnail_image?.url || ''}
            />
          ))}
        </div>
      ) : (
        // 1920px+ → Only 4 cards in one row
        <div className="grid grid-cols-4 gap-6">
          {projects.slice(0, 4).map(project => (
            <ProjectCard
              key={project.id}
              id={String(project.id)}
              title={project.title || 'Untitled Project'}
              description={project.description?.replace(/<[^>]+>/g, '')}
              date={project.date || ''}
              image={project.thumbnail_image?.url || ''}
            />
          ))}
        </div>
      )}

      {/* View More Button for mobile only (below 768px) - full width */}
      <div className={`block min-[768px]:hidden ${windowWidth <= 600 ? 'mt-12' : 'mt-8'}`}>
        <Link
          href="/projects"
          className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-brand-500 text-white text-sm font-semibold transition hover:bg-brand-600 beveled-corner"
          aria-label="View all projects"
        >
          <span>View More</span>
        </Link>
      </div>
    </div>
  );
};

export default HomeProjects;