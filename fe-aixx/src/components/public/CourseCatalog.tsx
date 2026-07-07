'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { fetchPublicTrainings } from '@/lib/training';
import { courses as fallbackCourses } from '@/components/public/courseCatalogData';

interface CourseCardItem {
  id: string;
  title: string;
  description: string;
}

const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<CourseCardItem[]>(() =>
    fallbackCourses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
    }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const response = await fetchPublicTrainings('courses');
        const payload = response?.data?.data || response?.data || [];
        const items = Array.isArray(payload) ? payload : [];

        if (!isMounted) {
          return;
        }

        const mappedCourses = items
          .filter((item: any) => item?.type === 'courses' || item?.name)
          .map((item: any) => ({
            id: item.slug || item.id,
            title: item.name || 'Untitled course',
            description: item.description || 'More details will be shared soon.',
          }));

        setCourses(mappedCourses.length > 0 ? mappedCourses : fallbackCourses.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
        })));
      } catch (error) {
        console.error('Failed to load public courses:', error);
        if (isMounted) {
          setCourses(fallbackCourses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
          })));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return courses;
    }

    return courses.filter((course) => {
      const haystack = [course.title, course.description].join(' ').toLowerCase();
      return haystack.includes(normalizedTerm);
    });
  }, [courses, searchTerm]);

  return (
    <section id="courses" className="bg-slate-50 py-16">
      <div className="container mx-auto px-3 sm:px-5 md:px-6 xl:px-10 2xl:px-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Explore programs</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Find the right course for your goals</h2>
          </div>
          <label className="w-full max-w-md rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm md:w-auto">
            <span className="sr-only">Search courses</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search courses"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {loading ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
            Loading courses from the admin catalog...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
            No courses matched your search. Try a different keyword.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredCourses.map((course) => (
              <div key={course.id} className="rounded-[32px] border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl">
                <div className="p-8 sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <FaGraduationCap className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-semibold text-slate-900">{course.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{course.description}</p>
                    </div>
                  </div>

                  <Link
                    href={`/training-and-certification/courses/${course.id}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
                  >
                    More info
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseCatalog;
