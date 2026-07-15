'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchPublicTrainings } from '@/lib/training';
import { storeInquiry } from '@/lib/public/inquiries';
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
    .split(/\r?\n/)
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

const GraduationCapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M12 3 1 7l11 4 11-4-11-4Z" />
    <path d="M5 10v4c0 2.2 3.6 4 7 4s7-1.8 7-4v-4" />
    <path d="M5 14v3" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<CourseDetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Apply Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiringFor, setInquiringFor] = useState<'myself' | 'team'>('myself');
  const [experience, setExperience] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const closeModal = () => {
    setShowApplyModal(false);
    setSubmitted(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setInquiringFor('myself');
    setExperience('');
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !experience || !course) {
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
        message: `Enrollment application for course: ${course.title} (ID: ${course.id})`,
      });
      setSubmitted(true);
      setTimeout(() => closeModal(), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoadingForm(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        const response = await fetchPublicTrainings('courses');
        const payload = response?.data?.data || response?.data || [];
        const items = Array.isArray(payload) ? payload : [];
        const matchedCourse = items.find((item: any) => (item.slug || item.id) === slug);

        if (!isMounted) return;

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
        if (isMounted) setLoading(false);
      }
    };

    loadCourse();
    return () => { isMounted = false; };
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
          <Link href="/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            <ArrowLeftIcon />
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-4 sm:p-8 lg:p-12 shadow-sm">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
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

            {/* Enrolment / Call To Action */}
            <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>Enrol in this Course</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    25% PROMO ACTIVE
                  </span>
                </h3>
                <p className="text-sm text-slate-600">
                  Secure your seat at the promotional rate of <strong className="text-emerald-700">{course.international}</strong> (originally <span className="line-through text-slate-400 font-medium">{course.domestic}</span>).
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="inline-flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto text-center"
                >
                  Apply Now
                </button>
                <Link
                  href={`/contact?service=AI%20Training%20%26%20Certification&subject=Enquiry%20for%20${encodeURIComponent(course.title)}`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 text-sm font-semibold transition-colors w-full sm:w-auto text-center"
                >
                  Inquire
                </Link>
              </div>
            </div>

            {/* Course Details Table */}
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
                      <th className="px-4 py-3 font-semibold">Original Price</th>
                      <th className="px-4 py-3 font-semibold text-emerald-700">Promo Price (25% Off)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-200 align-top">
                      <td className="px-4 py-4 font-medium text-slate-900">{course.title}</td>
                      <td className="px-4 py-4">{course.duration}</td>
                      <td className="px-4 py-4 line-through text-slate-400 font-medium">{course.domestic}</td>
                      <td className="px-4 py-4 font-bold text-emerald-600">{course.international}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Highlights */}
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

          {/* Learning Modules */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5">Learning modules</h2>
              <ol className="space-y-3">
                {course.subModules.map((module, index) => (
                  <li key={module} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 hover:border-brand-200 hover:bg-brand-50/40 transition-colors duration-200">
                    <span className="flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{module}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* ── Apply Now Modal ── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
              aria-label="Close form"
            >
              <XIcon />
            </button>

            {submitted ? (
              <div className="my-auto py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                  <svg className="h-8 w-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Application Received!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Thank you for applying to <strong>{course.title}</strong>.<br />
                  Your inquiry has been stored in our admin panel. An email confirmation has been sent to your address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">Course Application</h3>
                  <p className="text-xs text-slate-400 mt-1">Please fill in your details below to apply.</p>
                </div>

                {/* Course Badge */}
                <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 block mb-1">Applying for Course</span>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{course.title}</p>
                </div>

                {/* Name Row */}
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

                {/* Email */}
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

                {/* Phone */}
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

                {/* Inquiring For */}
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
                        className="h-4 w-4 accent-brand-600"
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
                        className="h-4 w-4 accent-brand-600"
                      />
                      <span>Team / Group</span>
                    </label>
                  </div>
                </div>

                {/* Work Experience */}
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

                {/* Privacy */}
                <div className="text-[10px] leading-relaxed text-slate-400">
                  By clicking the button below, you agree to receive communications via Email/Call/WhatsApp/SMS from AIXX Academy and partners about this program and other relevant programs.{' '}
                  <Link href="/privacy-policy" className="text-slate-500 underline hover:text-slate-650">Privacy Policy</Link>.
                </div>

                {/* Submit Button */}
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
    </main>
  );
}
