'use client';
import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { Pagination } from './Pagination';
import useProjects from '@/hooks/public/useProjects'; // ✅ use correct path
import { ProjectTableData } from '@/types/project';

const ProjectList: React.FC = () => {
  const { projects, loading, error, pagination, loadProjects } = useProjects();
  const [projectsPerPage, setProjectsPerPage] = useState(16);

  // ✅ load projects initially
  useEffect(() => {
    loadProjects(1, projectsPerPage);
  }, [projectsPerPage]);

  // ✅ handle responsive per-page setting
  useEffect(() => {
    const updateProjectsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1536) setProjectsPerPage(12);
      else if (width >= 1280) setProjectsPerPage(9);
      else if (width >= 768) setProjectsPerPage(6);
      else setProjectsPerPage(4);
    };
    updateProjectsPerPage();
    window.addEventListener('resize', updateProjectsPerPage);
    return () => window.removeEventListener('resize', updateProjectsPerPage);
  }, []);

  // ✅ Fix: accept both args from Pagination
  const handlePageClick = (page: number, _isPageNumberClick?: boolean) => {
    loadProjects(page, projectsPerPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="w-full">
        <p className="text-center py-60">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => loadProjects(1, projectsPerPage)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p>No projects found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className='container mx-auto px-[16px] sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] py-[40px]'>
        <div className="grid gap-[16px] md:gap-[16px] lg:gap-[20px] sm:grid-cols-1 md:grid-cols-2 xlmid:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project: ProjectTableData, index) => (
            <ProjectCard
              key={project.id || index}
              id={String(project.id || index)}
              slug={project.slug} // ✅ Add this
              title={project.title || 'Untitled Project'}
              description={project.description.replace(/<[^>]+>/g, '')}
              date={project.date || ''}
              image={project.thumbnail_image?.url || ''}
            />
          ))}
        </div>

        {/* ✅ Pagination (always render if pages ≥ 1) */}
        {pagination.last_page >= 1 && (
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={handlePageClick}
            totalCount={pagination.total}
            selectedItemsPerPage={projectsPerPage}
            handleItemsPerPageChange={(value) => {
              setProjectsPerPage(Number(value));
              loadProjects(1, Number(value)); // reset to first page
            }}
            isScrolling={false}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectList;
