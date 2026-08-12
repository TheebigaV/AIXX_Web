'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  FaGraduationCap, 
  FaStar, 
  FaRegBookmark, 
  FaBookmark, 
  FaSearch, 
  FaTimes,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaVenusMars,
  FaPaperPlane,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaIdCard,
  FaArrowRight,
  FaBookOpen,
  FaLock,
  FaUsers,
  FaBriefcase,
  FaChartPie,
  FaAtom,
  FaFire,
  FaNewspaper,
  FaHandshake
} from 'react-icons/fa';
import { fetchPublicTrainings } from '@/lib/training';
import { storeInquiry } from '@/lib/public/inquiries';
import { courses as fallbackCourses } from '@/components/public/courseCatalogData';
import ELearningModule from '@/components/public/ELearningModule';
import StudyGuide from './StudyGuide';
import { api } from '@/lib/public/api';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';
import { enrollInCourse } from '@/services/studentService';

const countries = [
  "Singapore", "Malaysia", "Indonesia", "Thailand", "Philippines", "Vietnam", "India", "Australia",
  "United Kingdom", "United States", "China", "Japan", "South Korea",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const FreeCertificateTabContent: React.FC = () => {
  const router = useRouter();

  // Detect if already registered via localStorage
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [storedCandidateName, setStoredCandidateName] = useState('');
  const [storedRegId, setStoredRegId] = useState('');

  // Registration ID entry for already-registered users
  const [regIdInput, setRegIdInput] = useState('');
  const [regIdError, setRegIdError] = useState('');
  const [regIdVerified, setRegIdVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // View toggle: 'check' | 'register'
  const [view, setView] = useState<'check' | 'register'>('check');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('aixx_certificate_token');
      const name = localStorage.getItem('aixx_candidate_name') || '';
      const rid = localStorage.getItem('aixx_candidate_reg_id') || '';
      if (token) {
        setIsAlreadyRegistered(true);
        setStoredCandidateName(name);
        setStoredRegId(rid);
        // Pre-fill the reg id input if stored
        if (rid) setRegIdInput(rid);
      }
    }
  }, []);

  const handleVerifyRegId = async () => {
    const id = regIdInput.trim();
    if (!id) {
      setRegIdError('Please enter your Registration ID.');
      return;
    }
    setVerifyLoading(true);
    setRegIdError('');
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('aixx_certificate_token') : null;
      const storedRid = (typeof window !== 'undefined' ? localStorage.getItem('aixx_candidate_reg_id') : null) || '';

      // Primary: verify using the stored token + check reg ID matches
      if (storedToken) {
        try {
          const res = await api.get(`api/certificate/verify-token?token=${storedToken}`);
          // verify-token returns flat response (no .data wrapper): { registration_id, full_name, ... }
          const data = res.data;
          const backendRegId: string = data?.registration_id || storedRid;

          if (backendRegId.toUpperCase() === id.toUpperCase()) {
            // Token is valid and reg ID matches — proceed
            if (data?.full_name) localStorage.setItem('aixx_candidate_name', data.full_name);
            localStorage.setItem('aixx_candidate_reg_id', backendRegId);
            window.dispatchEvent(new Event('aixx-auth-change'));
            setRegIdVerified(true);
            setVerifyLoading(false);
            return;
          } else if (backendRegId && id.toUpperCase() !== backendRegId.toUpperCase()) {
            setRegIdError(`That doesn't match your registered ID (${backendRegId}). Please enter your correct Registration ID.`);
            setVerifyLoading(false);
            return;
          }
        } catch {
          // Token invalid/expired — fall through to login
        }
      }

      // Fallback: login with registration_id only (email is optional on backend)
      const loginRes = await api.post('api/certificate/login', { registration_id: id });
      const loginData = loginRes.data;
      // backend login returns { token, full_name, email, registration_id }
      if (loginData?.token || loginData?.uuid) {
        const tok = loginData.token || loginData.uuid;
        localStorage.setItem('aixx_certificate_token', tok);
        if (loginData.full_name) localStorage.setItem('aixx_candidate_name', loginData.full_name);
        localStorage.setItem('aixx_candidate_reg_id', id);
        if (loginData.email) localStorage.setItem('aixx_candidate_email', loginData.email);
        window.dispatchEvent(new Event('aixx-auth-change'));
        setRegIdVerified(true);
      } else {
        setRegIdError('Registration ID not found. Please check and try again.');
      }
    } catch (err: any) {
      setRegIdError(
        err?.response?.data?.message ||
        'Registration ID not found. Please check and try again.'
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // ── Already registered: ask for reg ID ──────────────────────────────────────
  if (isAlreadyRegistered && view === 'check') {
    const studyVisited = typeof window !== 'undefined' && !!localStorage.getItem('aixx_study_guide_visited');

    if (regIdVerified) {
      // Show success / action screen with study-guide gate
      return (
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-[32px] border border-slate-200/60 shadow-inner">
          <div className="max-w-md mx-auto text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <FaCheckCircle size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#191E42]">Welcome Back!</h3>
              <p className="text-sm text-slate-500 mt-1">
                Identity verified. Your Registration ID is active.
              </p>
              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 inline-block">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Student Registration ID</span>
                <span className="text-lg font-black text-brand-600 font-mono tracking-wider">{regIdInput.trim()}</span>
              </div>
            </div>

            {/* Study first notice */}
            {!studyVisited && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2 text-left">
                <FaLock size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Study Guide required first.</strong> Please complete the Study Guide before taking the test. This ensures you're fully prepared for the assessment.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Study Guide — always active */}
              <button
                onClick={() => router.push(`/ai-certificate/study?token=${localStorage.getItem('aixx_certificate_token') || ''}`)}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaBookOpen size={14} />
                <span>Study Guide</span>
              </button>

              {/* Take the Test — locked until study guide visited */}
              {studyVisited ? (
                <button
                  onClick={() => router.push(`/ai-certificate/test?token=${localStorage.getItem('aixx_certificate_token') || ''}`)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaGraduationCap size={14} />
                  <span>Take the Test</span>
                </button>
              ) : (
                <div className="relative group w-full">
                  <button
                    disabled
                    className="w-full bg-slate-200 text-slate-400 font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-70"
                  >
                    <FaLock size={13} />
                    <span>Take the Test</span>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-52 bg-slate-900 text-white text-[10px] rounded-xl px-3 py-2 text-center shadow-lg z-10 leading-relaxed">
                    Complete the Study Guide first to unlock the test.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-[32px] border border-slate-200/60 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          {/* Left Column — Info */}
          <div className="lg:w-[45%] flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-full px-4 py-1.5 w-fit">
              <FaGraduationCap size={16} className="text-blue-500 animate-bounce" />
              <span className="text-xs font-semibold uppercase tracking-wider">Professional Credential</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Free AI Knowledge Certificate
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Test your general AI literacy and earn a Free AI Knowledge Certificate by completing our 20-question MCQ assessment.
            </p>
            <div className="space-y-4">
              {[
                { title: '20 Question Assessment', desc: 'Comprehensive multiple-choice questions covering generative AI theories and implementations.' },
                { title: 'Passing Grade: 80%', desc: 'Demonstrate competency by scoring at least 80% (16/20 correct answers).' },
                { title: 'Verifiable Digital Certificate', desc: 'Receive a uniquely serialized digital certificate suitable for resume integration and LinkedIn sharing.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm sm:text-base">{item.title}</h4>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Registration ID Entry */}
          <div className="lg:w-[55%] bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 flex flex-col justify-center space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-brand-100">
                <FaIdCard size={26} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100 inline-block">
                Already Registered
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Welcome Back{storedCandidateName ? `, ${storedCandidateName.split(' ')[0]}` : ''}!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                You're already registered. Enter your <strong className="text-slate-800">Student Registration ID</strong> to access the Free Certificate program.
              </p>
            </div>

            <div className="border-t border-slate-100" />

            {/* Reg ID Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white text-[10px] font-black">1</span>
                Enter your Student Registration ID
              </label>
              <div className="relative">
                <FaIdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  id="free-cert-reg-id-input"
                  type="text"
                  value={regIdInput}
                  onChange={(e) => { setRegIdInput(e.target.value); if (regIdError) setRegIdError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyRegId(); }}
                  placeholder="e.g. AIXX-REG-4"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs font-mono tracking-wider"
                />
              </div>
              {regIdError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-xs font-medium flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>{regIdError}</span>
                </div>
              )}
              <button
                id="free-cert-verify-btn"
                onClick={handleVerifyRegId}
                disabled={verifyLoading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {verifyLoading ? (
                  <><FaSpinner className="animate-spin" size={14} /><span>Verifying…</span></>
                ) : (
                  <><span>Verify & Continue</span><FaArrowRight size={12} /></>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">OR</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Switch to register */}
            <div className="space-y-2 text-center">
              <p className="text-xs text-slate-500">Don't have your Registration ID?</p>
              <button
                id="free-cert-register-new-btn"
                onClick={() => setView('register')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaGraduationCap size={14} className="text-brand-600" />
                <span>Register for Free — Get your ID</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not registered (or user clicked "Register" from the ID check view) ───────
  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-[32px] border border-slate-200/60 shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
        {/* Left Column — Info */}
        <div className="lg:w-[45%] flex flex-col justify-center space-y-6">
          {/* Back button if came from ID-check screen */}
          {view === 'register' && isAlreadyRegistered && (
            <button
              onClick={() => setView('check')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors cursor-pointer w-fit"
            >
              ← Back
            </button>
          )}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-full px-4 py-1.5 w-fit">
            <FaGraduationCap size={16} className="text-blue-500 animate-bounce" />
            <span className="text-xs font-semibold uppercase tracking-wider">Professional Credential</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            Free AI Knowledge Certificate
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Test your general AI literacy and earn a Free AI Knowledge Certificate by completing our 20-question MCQ assessment.
          </p>
          <div className="space-y-4">
            {[
              { title: '20 Question Assessment', desc: 'Comprehensive multiple-choice questions covering generative AI theories and implementations.' },
              { title: 'Passing Grade: 80%', desc: 'Demonstrate competency by scoring at least 80% (16/20 correct answers).' },
              { title: 'Verifiable Digital Certificate', desc: 'Receive a uniquely serialized digital certificate suitable for resume integration and LinkedIn sharing.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-sm sm:text-base">{item.title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Registration Form */}
        <div className="lg:w-[55%] bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 flex flex-col justify-between">
          <CertificatePortalForm />
        </div>
      </div>
    </div>
  );
};

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
  type?: string;
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
  const [filterType, setFilterType] = useState<'all' | 'saved' | 'elearning' | 'free-certificate'>('all');
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState<string>('all');

  // Catalog Promo Announcement Modal State
  const [showCatalogPromoModal, setShowCatalogPromoModal] = useState(false);

  useEffect(() => {
    // Show after 500ms delay on mount
    const timer = setTimeout(() => {
      setShowCatalogPromoModal(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseCatalogPromo = () => {
    setShowCatalogPromoModal(false);
  };

  const handleGetCatalogPromoCertificate = () => {
    setShowCatalogPromoModal(false);
    setFilterType('free-certificate');
    // Scroll to the courses section
    setTimeout(() => {
      const element = document.getElementById('courses-list');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Course Application Form States
  const [applyingCourse, setApplyingCourse] = useState<CourseCardItem | null>(null);
  const [enrollSuccessId, setEnrollSuccessId] = useState<string | null>(null);
  const [isContactOnlyCourse, setIsContactOnlyCourse] = useState(false);
  // Enrollment flow: 'reg-id-entry' | 'register-form' | 'success' | 'contact'
  const [enrollStep, setEnrollStep] = useState<'reg-id-entry' | 'register-form' | 'success' | 'contact'>('reg-id-entry');
  const [enrollRegIdInput, setEnrollRegIdInput] = useState('');
  const [enrollRegIdError, setEnrollRegIdError] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);

  const handleApplyClick = (course: CourseCardItem) => {
    const isSelfEnrollable =
      course.type === 'elearning' ||
      course.type === 'free_courses' ||
      course.fullFee?.includes('Free') ||
      course.payableFee?.includes('Free');

    setApplyingCourse(course);
    setEnrollSuccessId(null);
    setEnrollRegIdInput('');
    setEnrollRegIdError('');
    setEnrollLoading(false);

    if (!isSelfEnrollable) {
      setIsContactOnlyCourse(true);
      setEnrollStep('contact');
    } else {
      setIsContactOnlyCourse(false);
      setEnrollStep('reg-id-entry');
    }
  };

  const handleRegIdEnroll = async () => {
    const regId = enrollRegIdInput.trim();
    if (!regId) {
      setEnrollRegIdError('Please enter your Student Registration ID.');
      return;
    }
    setEnrollLoading(true);
    setEnrollRegIdError('');
    try {
      await enrollInCourse(regId, {
        id: applyingCourse!.id,
        title: applyingCourse!.title,
        description: applyingCourse!.description,
      });
      setEnrollSuccessId(regId);
      setEnrollStep('success');
    } catch (err: any) {
      setEnrollRegIdError(
        err?.response?.data?.message ||
        'Enrollment failed. Please check your Registration ID and try again.'
      );
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleCloseEnrollModal = () => {
    setApplyingCourse(null);
    setEnrollSuccessId(null);
    setIsContactOnlyCourse(false);
    setEnrollRegIdInput('');
    setEnrollRegIdError('');
    setEnrollLoading(false);
  };

  // Check URL query parameters for view=saved or free-certificate on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') || params.get('tab');
      if (view === 'saved') {
        setFilterType('saved');
      } else if (view === 'free-certificate') {
        setFilterType('free-certificate');
        // Scroll to the courses section
        setTimeout(() => {
          const element = document.getElementById('courses-list');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
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
        const response = await fetchPublicTrainings();
        const payload = response?.data?.data || response?.data || [];
        const items = Array.isArray(payload) ? payload : [];

        if (!isMounted) {
          return;
        }

        if (items.length > 0) {
          const mappedCourses = items.map((item: any) => {
            const fallback = fallbackCourses.find((c) => c.id === (item.slug || item.id)) || fallbackCourses[0];
            return {
              id: item.slug || item.id,
              title: item.name || 'Untitled course',
              description: item.description || 'More details will be shared soon.',
              domestic: item.domestic_fee || fallback.domestic,
              international: item.international_fee || fallback.international,
              rating: item.rating || 5.0,
              ratingsCount: item.ratings_count || 24,
              attendees: item.attendees || 120,
              startDate: item.start_date || fallback.startDate,
              fullFee: item.domestic_fee || fallback.fullFee,
              payableFee: item.international_fee || fallback.payableFee,
              discount: item.discount_badge || fallback.discount,
              institution: item.institution || 'AIXX Academy',
              deliveryMethod: item.delivery_method || (fallback as any).deliveryMethod || 'Live Virtual',
              type: item.type || 'courses',
            };
          });
          setCourses(mappedCourses);
        } else {
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
            type: 'courses',
          })));
        }
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
            type: 'courses',
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
    
    if (filterType === 'elearning') {
      result = result.filter((course) => course.type === 'elearning');
    }

    if (filterType === 'free-certificate') {
      result = result.filter((course) => course.type === 'free_courses');
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
        <div className="mb-8 flex overflow-x-auto whitespace-nowrap gap-2 border-b border-slate-200 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex-shrink-0 ${
              filterType === 'all'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-100'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            All Courses ({courses.length})
          </button>
          <button
            onClick={() => setFilterType('saved')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 ${
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
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 ${
              filterType === 'elearning'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-100'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>E-Learning {courses.filter(c => c.type === 'elearning').length > 0 ? `(${courses.filter(c => c.type === 'elearning').length})` : ''}</span>
          </button>
          <button
            onClick={() => setFilterType('free-certificate')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 ${
              filterType === 'free-certificate'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-100'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Free Certificate {courses.filter(c => c.type === 'free_courses').length > 0 ? `(${courses.filter(c => c.type === 'free_courses').length})` : ''}</span>
          </button>
        </div>

        {filterType === 'saved' && filteredCourses.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {filteredCourses.map((course, idx) => {
              // Determine card theme
              let color = 'from-[#3A0CA3] to-[#7209B7]';
              let icon = <FaGraduationCap size={56} />;
              
              if (course.type === 'free_courses') { color = 'from-[#1B4332] to-[#2D6A4F]'; icon = <FaBookOpen size={56} />; }
              else if (course.type === 'seminars') { color = 'from-[#023E8A] to-[#0077B6]'; icon = <FaNewspaper size={56} />; }
              else if (course.type === 'workshops') { color = 'from-[#D62828] to-[#F77F00]'; icon = <FaBriefcase size={56} />; }
              else if (course.type === 'certification') { color = 'from-[#006D77] to-[#83C5BE]'; icon = <FaChartPie size={56} />; }
              else if (course.type === 'elearning') { color = 'from-[#240046] to-[#5A189A]'; icon = <FaAtom size={56} />; }
              else if (course.type === 'newsletters') { color = 'from-[#9D0208] to-[#D00000]'; icon = <FaFire size={56} />; }
              else {
                const themes = [
                  { color: 'from-[#1B4332] to-[#2D6A4F]', icon: <FaBookOpen size={56} /> },
                  { color: 'from-[#3A0CA3] to-[#7209B7]', icon: <FaUsers size={56} /> },
                  { color: 'from-[#023E8A] to-[#0077B6]', icon: <FaNewspaper size={56} /> },
                  { color: 'from-[#D62828] to-[#F77F00]', icon: <FaBriefcase size={56} /> },
                  { color: 'from-[#006D77] to-[#83C5BE]', icon: <FaChartPie size={56} /> },
                  { color: 'from-[#9D0208] to-[#D00000]', icon: <FaFire size={56} /> },
                  { color: 'from-[#240046] to-[#5A189A]', icon: <FaAtom size={56} /> },
                  { color: 'from-[#03045E] to-[#0077B6]', icon: <FaHandshake size={56} /> }
                ];
                const theme = themes[idx % themes.length];
                color = theme.color;
                icon = theme.icon;
              }

              return (
                <Link 
                  href={`/courses/${course.id}`}
                  key={course.id} 
                  className={`group block relative overflow-hidden rounded-2xl bg-gradient-to-r ${color} hover:scale-[1.02] transition-transform duration-300 shadow-lg border border-white/10 min-h-[110px]`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-full h-full p-4 sm:p-5 flex items-center gap-4 sm:gap-5 relative z-10">
                    <div className="text-white drop-shadow-md flex-shrink-0 opacity-90 transition-transform group-hover:scale-110">
                      {icon}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-white tracking-wide text-base sm:text-lg leading-snug uppercase drop-shadow-sm truncate">
                        {course.title}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 bg-white/20 p-2.5 rounded-full group-hover:bg-white/30 transition shadow-sm backdrop-blur-sm ml-2">
                      <FaArrowRight size={16} className="text-white drop-shadow-sm group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      </div>

      {applyingCourse && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseEnrollModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
              aria-label="Close form"
            >
              <FaTimes size={18} />
            </button>

            {/* ── Step: Contact Only ── */}
            {enrollStep === 'contact' && (
              <div className="text-center space-y-5 py-2 animate-fadeIn max-w-lg mx-auto">
                <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                  <FaEnvelope size={28} />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">Admissions Advisory Notice</span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Direct Admissions Inquiry Required</h3>
                  <p className="text-xs text-slate-500 mt-1">Program: <strong className="text-slate-800">{applyingCourse.title}</strong></p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs leading-relaxed">
                  <p className="font-semibold text-slate-800">
                    Online self-enrollment via Student Registration ID is available exclusively for <strong className="text-brand-600">E-Learning Modules</strong> and <strong className="text-brand-600">Free AI Certificates</strong>.
                  </p>
                  <p className="text-slate-600">
                    For executive seminars, specialized certifications, and paid enterprise programs, applications are processed directly through our admissions advisory team.
                  </p>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Contact Admissions Email:</span>
                    <a href={`mailto:cs@aixx.com.sg?subject=Enrollment%20Inquiry%20for%20${encodeURIComponent(applyingCourse.title)}`} className="font-bold text-brand-600 hover:underline">cs@aixx.com.sg</a>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={`mailto:cs@aixx.com.sg?subject=Enrollment%20Inquiry%20for%20${encodeURIComponent(applyingCourse.title)}`}
                    className="w-full bg-[#43933E] hover:bg-[#387D34] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaEnvelope size={14} />
                    <span>Contact via Email</span>
                  </a>
                  <Link
                    href={`/contact?service=AI%20Training%20%26%20Certification&subject=Enrollment%20Inquiry%20for%20${encodeURIComponent(applyingCourse.title)}`}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaPaperPlane size={12} className="text-slate-600" />
                    <span>Submit Inquiry</span>
                  </Link>
                </div>
              </div>
            )}

            {/* ── Step: Enter Registration ID ── */}
            {enrollStep === 'reg-id-entry' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto border border-brand-100">
                    <FaIdCard size={26} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                      Course Enrollment
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                      Enroll in this Course
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Program: <strong className="text-slate-800">{applyingCourse.title}</strong>
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Already have a Reg ID */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white text-[10px] font-black">1</span>
                    Already registered? Enter your Student Registration ID
                  </p>
                  <div className="relative">
                    <FaIdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      id="enroll-reg-id-input"
                      type="text"
                      value={enrollRegIdInput}
                      onChange={(e) => { setEnrollRegIdInput(e.target.value); if (enrollRegIdError) setEnrollRegIdError(''); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRegIdEnroll(); }}
                      placeholder="e.g. AIXX-REG-4"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs font-mono tracking-wider"
                    />
                  </div>
                  {enrollRegIdError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-xs font-medium flex items-start gap-2">
                      <span className="mt-0.5">⚠️</span>
                      <span>{enrollRegIdError}</span>
                    </div>
                  )}
                  <button
                    id="enroll-reg-id-submit"
                    onClick={handleRegIdEnroll}
                    disabled={enrollLoading}
                    className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {enrollLoading ? (
                      <><FaSpinner className="animate-spin" size={14} /><span>Enrolling…</span></>
                    ) : (
                      <><span>Enroll with my Registration ID</span><FaArrowRight size={12} /></>
                    )}
                  </button>
                </div>

                {/* Divider with OR */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">OR</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                {/* New student */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-[10px] font-black">2</span>
                    New student? Register first to get your ID
                  </p>
                  <button
                    id="enroll-register-first-btn"
                    onClick={() => setEnrollStep('register-form')}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaGraduationCap size={14} className="text-brand-600" />
                    <span>Register Now — It's Free</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Registration is free and takes under 1 minute. You'll receive a unique Student Registration ID you can use to enroll in any course.
                  </p>
                </div>
              </div>
            )}

            {/* ── Step: Register Form ── */}
            {enrollStep === 'register-form' && (
              <div className="animate-fadeIn">
                {/* Back button */}
                <button
                  onClick={() => { setEnrollStep('reg-id-entry'); setEnrollRegIdError(''); }}
                  className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <CertificatePortalForm
                  onClose={handleCloseEnrollModal}
                  title="Create Your Student Account"
                  subtitle="Register in seconds to get your Student Registration ID, then enroll instantly."
                  onSuccess={async (studentData) => {
                    try {
                      await enrollInCourse(studentData.registration_id, {
                        id: applyingCourse.id,
                        title: applyingCourse.title,
                        description: applyingCourse.description,
                      });
                      setEnrollSuccessId(studentData.registration_id);
                      setEnrollStep('success');
                    } catch (err) {
                      console.error('Enrollment error after registration:', err);
                    }
                  }}
                />
              </div>
            )}

            {/* ── Step: Success ── */}
            {enrollStep === 'success' && (
              <div className="text-center space-y-4 py-4 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <FaCheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#191E42]">Successfully Enrolled!</h3>
                <p className="text-xs text-slate-600">
                  You have been enrolled in <strong className="text-slate-900">{applyingCourse.title}</strong> using your Student Registration ID:
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Student Registration ID</span>
                  <span className="text-xl font-black text-brand-600 font-mono tracking-wider">{enrollSuccessId}</span>
                </div>
                <button
                  onClick={handleCloseEnrollModal}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-xs cursor-pointer"
                >
                  Close &amp; Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCatalogPromoModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-[90vw] sm:max-w-lg md:max-w-xl rounded-[32px] bg-white text-slate-800 p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col items-center text-center overflow-hidden transition-all duration-300">
            {/* Close Button */}
            <button
              onClick={handleCloseCatalogPromo}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition duration-200 z-20"
              aria-label="Close promotion"
            >
              <FaTimes className="h-4 w-4" />
            </button>

            {/* Certificate Preview Image */}
            <div className="relative z-10 w-full aspect-[2/1] mb-6 mt-2 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
              <img 
                src="/images/gallery/certificate.png" 
                alt="AIXX Certificate" 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" 
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
                onClick={handleGetCatalogPromoCertificate}
                className="w-full relative inline-flex items-center justify-center gap-2.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold py-4 px-8 rounded-2xl text-sm sm:text-base transition-all duration-200 shadow-md shadow-brand-100"
              >
                <span>Get it freely</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <button
                type="button"
                onClick={handleCloseCatalogPromo}
                className="w-full text-xs sm:text-sm text-slate-400 hover:text-slate-600 py-2 transition duration-200"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseCatalog;
