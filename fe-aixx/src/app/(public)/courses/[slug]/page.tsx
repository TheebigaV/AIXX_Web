'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchPublicTrainings } from '@/lib/training';
import { storeInquiry } from '@/lib/public/inquiries';
import { courses as fallbackCourses } from '@/components/public/courseCatalogData';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';
import { enrollInCourse } from '@/services/studentService';
import { FaCheckCircle, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

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
  
  // Promo Modal State
  const [showPromoModal, setShowPromoModal] = useState(false);

  useEffect(() => {
    // Show after 1 second delay
    const timer = setTimeout(() => {
      const shown = sessionStorage.getItem('aixx_promo_shown');
      if (!shown) {
        setShowPromoModal(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClosePromo = () => {
    setShowPromoModal(false);
    sessionStorage.setItem('aixx_promo_shown', 'true');
  };

  const handleGetPromoCertificate = () => {
    setShowPromoModal(false);
    sessionStorage.setItem('aixx_promo_shown', 'true');
    window.location.href = '/courses?view=free-certificate';
  };

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

  const closeModal = () => {
    setShowApplyModal(false);
    setSubmitted(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setCountryCode('+65');
    setInquiringFor('myself');
    setExperience('');
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !experience || !course || !companyName) {
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
        message: `Company: ${companyName}\nEnrollment application for course: ${course.title} (ID: ${course.id})`,
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg md:max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
              aria-label="Close form"
            >
              <XIcon />
            </button>

            {/* Check if course is self-enrollable (elearning/free_courses) or requires direct contact */}
            {(course as any).type !== 'elearning' && (course as any).type !== 'free_courses' && !course.domestic?.includes('Free') && !course.international?.includes('Free') ? (
              <div className="text-center space-y-5 py-2 animate-fadeIn max-w-lg mx-auto">
                <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                  <FaEnvelope size={28} />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">Admissions Advisory Notice</span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Direct Admissions Inquiry Required</h3>
                  <p className="text-xs text-slate-500 mt-1">Program: <strong className="text-slate-800">{course.title}</strong></p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs leading-relaxed text-slate-650">
                  <p className="font-semibold text-slate-800">
                    Online self-enrollment via Student Registration ID is available exclusively for <strong className="text-brand-600">E-Learning Modules</strong> and <strong className="text-brand-600">Free AI Certificates</strong>.
                  </p>
                  <p>
                    For executive seminars, specialized certifications, and paid enterprise programs, applications are processed directly through our admissions advisory team.
                  </p>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Contact Admissions Email:</span>
                    <a href={`mailto:info@aixx.com.sg?subject=Enrollment%20Inquiry%20for%20${encodeURIComponent(course.title)}`} className="font-bold text-brand-600 hover:underline">info@aixx.com.sg</a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={`mailto:info@aixx.com.sg?subject=Enrollment%20Inquiry%20for%20${encodeURIComponent(course.title)}`}
                    className="w-full bg-[#43933E] hover:bg-[#387D34] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <FaEnvelope size={14} />
                    <span>Contact via Email</span>
                  </a>
                  <Link
                    href={`/contact?service=AI%20Training%20%26%20Certification&subject=Enrollment%20Inquiry%20for%20${encodeURIComponent(course.title)}`}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <FaPaperPlane size={12} className="text-slate-600" />
                    <span>Submit Inquiry</span>
                  </Link>
                </div>
              </div>
            ) : (
              <CertificatePortalForm
                onClose={() => setShowApplyModal(false)}
                title="Free AI Certificate Portal"
                subtitle="New candidate? Fill in your details to register. Already registered? Just enter your email — we'll recognize you and log you in instantly."
                onSuccess={async (studentData) => {
                  try {
                    await enrollInCourse(studentData.registration_id, {
                      id: course.id,
                      title: course.title,
                      description: course.description,
                    });
                  } catch (err) {
                    console.error('Enrollment error:', err);
                  }
                }}
              />
            )}
          </div>
        </div>
      )}

      {showPromoModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-[90vw] sm:max-w-lg md:max-w-xl rounded-[32px] bg-white text-slate-800 p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col items-center text-center overflow-hidden transition-all duration-300">
            {/* Close Button */}
            <button
              onClick={handleClosePromo}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition duration-200 z-20"
              aria-label="Close promotion"
            >
              <XIcon />
            </button>

            {/* Certificate Preview Image */}
            <div className="relative z-10 w-full aspect-[2/1] mb-6 mt-2 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
              <Image
                src="/images/gallery/certificate.png" 
                alt="AIXX Certificate" 
                width={800}
                height={400}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Badge */}
            <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100 px-4 py-1.5 text-xs sm:text-sm font-bold text-rose-600 uppercase tracking-widest mb-4">
              ⏰ Limited Time Announcement
            </span>

            {/* Content */}
            <h3 className="relative z-10 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-3">
              Free AI Certification Ending!
            </h3>
            <p className="relative z-10 text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Free certificates are going to end on <strong className="text-rose-600 font-extrabold">September 30th</strong>. Get your Free AI Knowledge Certificate now before the deadline!
            </p>

            {/* Buttons */}
            <div className="relative z-10 flex flex-col gap-2.5 w-full">
              <button
                type="button"
                onClick={handleGetPromoCertificate}
                className="w-full relative inline-flex items-center justify-center gap-2.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold py-4 px-8 rounded-2xl text-sm sm:text-base transition-all duration-200 shadow-md shadow-brand-100"
              >
                <span>Get it freely</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <button
                type="button"
                onClick={handleClosePromo}
                className="w-full text-xs sm:text-sm text-slate-400 hover:text-slate-600 py-2 transition duration-200"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
