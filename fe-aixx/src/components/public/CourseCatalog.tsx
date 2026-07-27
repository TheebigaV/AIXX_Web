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
  const [phone, setPhone] = useState('');
  const [inquiringFor, setInquiringFor] = useState<'myself' | 'team'>('myself');
  const [experience, setExperience] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !experience || !applyingCourse) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    setLoadingForm(true);

    try {
      await storeInquiry({
        customer_name: `${firstName} ${lastName}`,
        customer_email: email,
        customer_phone: `+65 ${phone}`,
        service_interest: 'AI Training & Certification',
        industry_type: `Inquiring For: ${inquiringFor === 'myself' ? 'Myself' : 'Team / Group'}`,
        budget_timeline: `Work Experience: ${experience === 'none' ? 'Less than 1 year' : experience + ' years'}`,
        message: `Enrollment application for course: ${applyingCourse.title} (ID: ${applyingCourse.id})`,
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
    <section id="courses" className="bg-slate-50 py-8 min-h-screen">
      <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Explore programs</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Find the right course for your goals</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full max-w-xl md:w-auto">
            <div className="relative w-full md:w-56">
              <select
                value={deliveryMethodFilter}
                onChange={(e) => setDeliveryMethodFilter(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer appearance-none pr-10"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
              >
                <option value="all">All Delivery Methods</option>
                <option value="Self-Paced E-Learning">Self-Paced E-Learning</option>
                <option value="Live Virtual">Live Virtual</option>
                <option value="In-Person Campus">In-Person Campus</option>
              </select>
            </div>
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
            <span>Interactive E-Learning</span>
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
                        {course.deliveryMethod && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full border border-brand-100">
                            {course.deliveryMethod}
                          </span>
                        )}
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
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-6">
                      {/* Full course fee */}
                      <div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Full course fee</span>
                          <span className="text-slate-400 cursor-pointer text-[10px]" title="Excludes applicable taxes">ⓘ</span>
                        </div>
                        <p className="text-sm text-slate-700 font-semibold">{course.fullFee}</p>
                      </div>

                      {/* AIXX Alumni Member Fee */}
                      <div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>AIXX Alumni Member Fee</span>
                          <span className="text-slate-400 cursor-pointer text-[10px]" title="Promo rate details">ⓘ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-500">
                            From <span className="text-lg font-black text-emerald-600">{course.payableFee}*</span>
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100">
                            {course.discount} OFF
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-200 text-center"
                      >
                        More info
                      </Link>
                      <button
                        onClick={() => setApplyingCourse(course)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 group/btn text-center"
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
                  <label className="sr-only">Phone Number</label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
                    <div className="flex items-center gap-1 bg-slate-50 px-3 border-r border-slate-200">
                      <span className="text-sm font-semibold text-slate-700">+65</span>
                    </div>
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
