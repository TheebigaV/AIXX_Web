'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { FaGraduationCap, FaStar, FaRegBookmark, FaBookmark, FaSearch, FaTimes } from 'react-icons/fa';
import { fetchPublicTrainings } from '@/lib/training';
import { storeInquiry } from '@/lib/public/inquiries';
import { courses as fallbackCourses } from '@/components/public/courseCatalogData';
import ELearningModule from '@/components/public/ELearningModule';

interface CourseCardItem {
  id: string;
  title: string;
  description: string;
  domestic: string;
  international: string;
  rating: number;
  ratingsCount: number;
  attendees: number;
  startDate: string;
  fullFee: string;
  payableFee: string;
  discount: string;
  institution: string;
  deliveryMethod?: string;
}
interface CourseCatalogProps {
  onFilterChange?: (filter: string) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<CourseCardItem[]>(() =>
    fallbackCourses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      domestic: course.domestic,
      international: course.international,
      rating: course.rating,
      ratingsCount: course.ratingsCount,
      attendees: course.attendees,
      startDate: course.startDate,
      fullFee: course.fullFee,
      payableFee: course.payableFee,
      discount: course.discount,
      institution: course.institution,
      deliveryMethod: (course as any).deliveryMethod || 'Live Virtual',
    }))
  );
  const [loading, setLoading] = useState(true);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'saved' | 'elearning'>('all');
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState<string>('all');

  // Course Application Form States
  const [applyingCourse, setApplyingCourse] = useState<CourseCardItem | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [countryCode, setCountryCode] = useState('+65');
  const [phone, setPhone] = useState('');
  const [inquiringFor, setInquiringFor] = useState<'myself' | 'team'>('myself');
  const [experience, setExperience] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !experience || !applyingCourse || !companyName) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    setLoadingForm(true);

    try {
      await storeInquiry({
        customer_name: `${firstName} ${lastName}`,
        customer_email: email,
        customer_phone: `${countryCode} ${phone}`,
        service_interest: 'AI Training & Certification',
        industry_type: `Inquiring For: ${inquiringFor === 'myself' ? 'Myself' : 'Team / Group'}`,
        budget_timeline: `Work Experience: ${experience === 'none' ? 'Less than 1 year' : experience + ' years'}`,
        message: `Company: ${companyName}\nEnrollment application for course: ${applyingCourse.title} (ID: ${applyingCourse.id})`,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setApplyingCourse(null);
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setCompanyName('');
        setCountryCode('+65');
        setInquiringFor('myself');
        setExperience('');
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoadingForm(false);
    }
  };

  // Check URL query parameters for view=saved on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'saved') {
        setFilterType('saved');
      }
    }
  }, []);

  // Load saved courses on mount
  useEffect(() => {
    const saved = localStorage.getItem('aixx_saved_courses');
    if (saved) {
      try {
        setSavedCourseIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved courses', e);
      }
    }
  }, []);

  // Toggle bookmarking
  const toggleSaveCourse = (courseId: string) => {
    setSavedCourseIds((prev) => {
      const updated = prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
      localStorage.setItem('aixx_saved_courses', JSON.stringify(updated));
      return updated;
    });
  };

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
          .map((item: any) => {
            // Find fallback course to match defaults for any missing API fields
            const fallback = fallbackCourses.find((c) => c.id === (item.slug || item.id)) || fallbackCourses[0];
            return {
              id: item.slug || item.id,
              title: item.name || 'Untitled course',
              description: item.description || 'More details will be shared soon.',
              domestic: item.domestic_fee || fallback.domestic,
              international: item.international_fee || fallback.international,
              rating: item.rating || fallback.rating,
              ratingsCount: item.ratings_count || fallback.ratingsCount,
              attendees: item.attendees || fallback.attendees,
              startDate: item.start_date || fallback.startDate,
              fullFee: item.domestic_fee || fallback.fullFee,
              payableFee: item.international_fee || fallback.payableFee,
              discount: item.discount_badge || fallback.discount,
              institution: item.institution || fallback.institution,
              deliveryMethod: item.delivery_method || (fallback as any).deliveryMethod || 'Live Virtual',
            };
          });

        setCourses(mappedCourses.length > 0 ? mappedCourses : fallbackCourses.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          domestic: course.domestic,
          international: course.international,
          rating: course.rating,
          ratingsCount: course.ratingsCount,
          attendees: course.attendees,
          startDate: course.startDate,
          fullFee: course.fullFee,
          payableFee: course.payableFee,
          discount: course.discount,
          institution: course.institution,
          deliveryMethod: (course as any).deliveryMethod || 'Live Virtual',
        })));
      } catch (error) {
        console.error('Failed to load public courses:', error);
        if (isMounted) {
          setCourses(fallbackCourses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            domestic: course.domestic,
            international: course.international,
            rating: course.rating,
            ratingsCount: course.ratingsCount,
            attendees: course.attendees,
            startDate: course.startDate,
            fullFee: course.fullFee,
            payableFee: course.payableFee,
            discount: course.discount,
            institution: course.institution,
            deliveryMethod: (course as any).deliveryMethod || 'Live Virtual',
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

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filterType);
    }
  }, [filterType, onFilterChange]);

  const filteredCourses = useMemo(() => {
    let result = courses;

    if (filterType === 'saved') {
      result = result.filter((course) => savedCourseIds.includes(course.id));
    }

    if (deliveryMethodFilter !== 'all') {
      result = result.filter((course) => course.deliveryMethod === deliveryMethodFilter);
    }

    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return result;
    }

    return result.filter((course) => {
      // Find fallback course keyHighlights & subModules if they aren't on API response
      const fallback = fallbackCourses.find((c) => c.id === course.id) || fallbackCourses[0];
      const subModulesStr = (fallback?.subModules || []).join(' ');
      const highlightsStr = (fallback?.keyHighlights || []).join(' ');
      const haystack = [course.title, course.description, subModulesStr, highlightsStr].join(' ').toLowerCase();
      return haystack.includes(normalizedTerm);
    });
  }, [courses, searchTerm, filterType, savedCourseIds, deliveryMethodFilter]);

  return (
    <section id="courses" className="bg-slate-50 min-h-screen">

      {/* ── Hero / Promo Banner ── */}
      <div className="relative overflow-hidden bg-[#00062A]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-60"
          style={{ backgroundImage: 'url("/images/courses_banner_bg.png")' }}
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#00062A]/80 to-[#00062A]/40 z-10" />

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-brand-500/20 blur-3xl z-10" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full bg-[#58b347]/10 blur-3xl z-10" />

        {/* Grid texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] z-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-16 sm:py-20 lg:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/30 rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              <span className="text-brand-300 text-xs font-semibold uppercase tracking-widest">AIXX Academy — Now Enrolling</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-4">
              Accelerate Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
                AI Career
              </span>{' '}
              Today
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Industry-certified AI training, workshops, and live bootcamps designed for professionals, teams, and executives across Southeast Asia.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#courses-list"
                className="relative inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 text-sm group overflow-hidden"
              >
                <span className="relative z-10">Browse All Courses</span>
                <svg className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/10 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-sm backdrop-blur-sm"
              >
                Talk to an Advisor
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Course Catalog ── */}
      <div id="courses-list" className="py-8">
      <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Explore programs</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Find the right course for your goals</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full max-w-xl md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Saved Items / All Courses Toggle Navigation */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
              filterType === 'all'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-100'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setFilterType('saved')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              filterType === 'saved'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-100'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            {filterType === 'saved' ? (
              <FaBookmark className="h-3.5 w-3.5" />
            ) : (
              <FaRegBookmark className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>Saved Courses ({savedCourseIds.length})</span>
          </button>
          <button
            onClick={() => setFilterType('elearning')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              filterType === 'elearning'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-100'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>E-Learning</span>
          </button>
        </div>

        {filterType === 'elearning' ? (
          <ELearningModule />
        ) : filterType === 'saved' && filteredCourses.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mx-auto mb-4">
              <FaRegBookmark className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No saved courses</h3>
            <p className="mt-2 text-sm text-slate-500">
              Click the bookmark icon on any course to save it here for quick access.
            </p>
            <button
              onClick={() => setFilterType('all')}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition"
            >
              Browse all courses
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
            No courses matched your search. Try a different keyword.
          </div>
        ) : (
          <div className="grid gap-6 w-full">
            {filteredCourses.map((course) => {
              const isSaved = savedCourseIds.includes(course.id);
              return (
                <div 
                  key={course.id} 
                  className="group relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Header Row: Institution & Save Bookmark Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {course.institution}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleSaveCourse(course.id)}
                        className="p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                        aria-label={isSaved ? "Unsave course" : "Save course"}
                      >
                        {isSaved ? (
                          <FaBookmark className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FaRegBookmark className="h-4 w-4 text-slate-400 hover:text-blue-500" />
                        )}
                      </button>
                    </div>

                    {/* Course Content */}
                    <div className="mt-2.5">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* No ratings or start date rendered per user instruction */}
                  </div>

                  {/* Estimated Payable section (Single white card style) */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap">
                      {/* Full course fee */}
                      <div className="shrink-0">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Full course fee</span>
                          <span className="text-slate-400 cursor-pointer text-[10px]" title="Excludes applicable taxes">ⓘ</span>
                        </div>
                        <p className="text-sm text-slate-700 font-semibold">{course.fullFee}</p>
                      </div>

                      {/* AIXX Alumni Member Fee */}
                      <div className="shrink-0">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>AIXX Alumni Member Fee</span>
                          <span className="text-slate-400 cursor-pointer text-[10px]" title="Promo rate details">ⓘ</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-slate-500">
                            From <span className="text-lg font-black text-emerald-600">{course.payableFee}*</span>
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100 shrink-0">
                            {course.discount} OFF
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-200 text-center whitespace-nowrap"
                      >
                        More info
                      </Link>
                      <button
                        onClick={() => setApplyingCourse(course)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 group/btn text-center whitespace-nowrap"
                      >
                        <span>Apply</span>
                        <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>

      {applyingCourse && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setApplyingCourse(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
              aria-label="Close form"
            >
              <FaTimes className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="my-auto py-10 text-center animate-fadeIn">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                  <svg className="h-8 w-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Application Received!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Thank you for applying to <strong>{applyingCourse.title}</strong>.<br />
                  Your inquiry has been stored in our admin panel. An email confirmation has been sent to your address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    Course Application
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Please fill in your details below to apply.</p>
                </div>

                {/* Selected Course Card Details inside Form */}
                <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 block mb-1">Applying for Course</span>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{applyingCourse.title}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="sr-only">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="sr-only">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="sr-only">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="sr-only">Phone Number</label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-slate-50 px-3 border-r border-slate-200 text-sm font-semibold text-slate-700 outline-none cursor-pointer max-w-[120px]"
                    >
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+63">🇵🇭 +63</option>
                      <option value="+84">🇻🇳 +84</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+95">🇲🇲 +95</option>
                      <option value="+855">🇰🇭 +855</option>
                      <option value="+673">🇧🇳 +673</option>
                      <option value="+856">🇱🇦 +856</option>
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Inquiring For</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="inquiringFor"
                        value="myself"
                        checked={inquiringFor === 'myself'}
                        onChange={() => setInquiringFor('myself')}
                        className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500 accent-brand-600"
                      />
                      <span>Myself</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="inquiringFor"
                        value="team"
                        checked={inquiringFor === 'team'}
                        onChange={() => setInquiringFor('team')}
                        className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500 accent-brand-600"
                      />
                      <span>Team / Group</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="sr-only">Total Work Experience</label>
                  <select
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer"
                  >
                    <option value="" disabled>Total Work Experience</option>
                    <option value="none">Less than 1 year</option>
                    <option value="1-3">1 to 3 years</option>
                    <option value="3-5">3 to 5 years</option>
                    <option value="5-10">5 to 10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div className="text-[10px] leading-relaxed text-slate-400">
                  By clicking the button below, you agree to receive communications via Email/Call/WhatsApp/SMS from AIXX Academy and partners about this program and other relevant programs. <Link href="/privacy-policy" className="text-slate-500 underline hover:text-slate-650">Privacy Policy</Link>.
                </div>

                <button
                  type="submit"
                  disabled={loadingForm}
                  className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md shadow-brand-100 transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {loadingForm ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseCatalog;
