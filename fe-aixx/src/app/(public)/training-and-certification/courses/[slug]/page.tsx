'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { fetchPublicTrainings } from '@/lib/training';
import { courses as fallbackCourses } from '@/components/public/courseCatalogData';

interface CourseDetailItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  subModules: string[];
  domestic: string;
  international: string;
  keyHighlights: string[];
}

const splitList = (value?: string) =>
  (value || '')
    .split(/\r?\n|,\s*/)
    .map((line) => line.trim())
    .filter(Boolean);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const BookOpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M2 6a2 2 0 0 1 2-2h6a3 3 0 0 1 3 3v14H4a2 2 0 0 1-2-2Z" />
    <path d="M22 6a2 2 0 0 0-2-2h-6a3 3 0 0 0-3 3v14h11a2 2 0 0 0 2-2Z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const CoinsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="8" />
    <path d="M14 8a2 2 0 0 0-2-2" />
    <path d="M10 16a2 2 0 0 0 2 2" />
    <path d="M4 12h16" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M12 3 1 7l11 4 11-4-11-4Z" />
    <path d="M5 10v4c0 2.2 3.6 4 7 4s7-1.8 7-4v-4" />
    <path d="M5 14v3" />
  </svg>
);

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<CourseDetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        const response = await fetchPublicTrainings('courses');
        const payload = response?.data?.data || response?.data || [];
        const items = Array.isArray(payload) ? payload : [];

        const matchedCourse = items.find((item: any) => (item.slug || item.id) === slug);

        if (!isMounted) {
          return;
        }

        if (matchedCourse) {
          const fallback = fallbackCourses.find((item) => item.id === slug);
          const subModules = splitList(matchedCourse.sub_modules);
          const highlights = splitList(matchedCourse.highlights);

          setCourse({
            id: matchedCourse.slug || matchedCourse.id,
            title: matchedCourse.name || fallback?.title || 'Course',
            description: matchedCourse.description || fallback?.description || 'More details will be shared soon.',
            duration: matchedCourse.duration || fallback?.duration || 'Contact us for the schedule',
            subModules: subModules.length > 0 ? subModules : fallback?.subModules || ['Course outline shared by the admin team'],
            domestic: matchedCourse.domestic_fee || fallback?.domestic || 'Contact us for pricing',
            international: matchedCourse.international_fee || fallback?.international || 'Contact us for pricing',
            keyHighlights: highlights.length > 0 ? highlights : fallback?.keyHighlights || ['Admin-managed training program'],
          });
        } else {
          const fallback = fallbackCourses.find((item) => item.id === slug);
          setCourse(fallback ? {
            id: fallback.id,
            title: fallback.title,
            description: fallback.description,
            duration: fallback.duration,
            subModules: fallback.subModules,
            domestic: fallback.domestic,
            international: fallback.international,
            keyHighlights: fallback.keyHighlights,
          } : null);
        }
      } catch (error) {
        console.error('Failed to load course details:', error);
        if (isMounted) {
          const fallback = fallbackCourses.find((item) => item.id === slug);
          setCourse(fallback ? {
            id: fallback.id,
            title: fallback.title,
            description: fallback.description,
            duration: fallback.duration,
            subModules: fallback.subModules,
            domestic: fallback.domestic,
            international: fallback.international,
            keyHighlights: fallback.keyHighlights,
          } : null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-600">Loading course details...</p>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Course not found</h1>
          <p className="mt-3 text-slate-600">The requested course details are unavailable.</p>
          <Link href="/training-and-certification/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            <ArrowLeftIcon />
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
        <Link href="/training-and-certification/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <ArrowLeftIcon />
          Back to courses
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <GraduationCapIcon />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Program details</p>
                <h1 className="text-3xl font-semibold text-slate-900">{course.title}</h1>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-sm text-slate-700">
                <ClockIcon />
                Duration: {course.duration}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-sm text-slate-700">
                <BookOpenIcon />
                {course.subModules.length} modules
              </span>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 bg-white px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Course details</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-slate-700">
                  <thead className="bg-slate-100 text-left text-slate-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Course</th>
                      <th className="px-4 py-3 font-semibold">Duration</th>


                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200 align-top">
                      <td className="px-4 py-4 font-medium text-slate-900">{course.title}</td>
                      <td className="px-4 py-4">{course.duration}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Key highlights</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {course.keyHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-600" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Learning modules</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {course.subModules.map((module) => (
                  <li key={module} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-600" />
                    <span>{module}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
