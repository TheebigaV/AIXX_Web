'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/public/api';
import { persistStudentSession } from '@/services/studentService';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaBuilding,
  FaSpinner,
  FaArrowRight,
  FaUniversity,
  FaShieldAlt,
  FaCheckCircle,
  FaCopy,
  FaBookOpen,
  FaGraduationCap,
  FaLock,
  FaChevronDown
} from 'react-icons/fa';

// ─── Country data with ISO codes + dial codes ────────────────────────────────
const COUNTRIES = [
  { name: 'Afghanistan', code: 'AF', dial: '+93' },
  { name: 'Albania', code: 'AL', dial: '+355' },
  { name: 'Algeria', code: 'DZ', dial: '+213' },
  { name: 'Andorra', code: 'AD', dial: '+376' },
  { name: 'Angola', code: 'AO', dial: '+244' },
  { name: 'Argentina', code: 'AR', dial: '+54' },
  { name: 'Armenia', code: 'AM', dial: '+374' },
  { name: 'Australia', code: 'AU', dial: '+61' },
  { name: 'Austria', code: 'AT', dial: '+43' },
  { name: 'Azerbaijan', code: 'AZ', dial: '+994' },
  { name: 'Bahrain', code: 'BH', dial: '+973' },
  { name: 'Bangladesh', code: 'BD', dial: '+880' },
  { name: 'Belarus', code: 'BY', dial: '+375' },
  { name: 'Belgium', code: 'BE', dial: '+32' },
  { name: 'Bolivia', code: 'BO', dial: '+591' },
  { name: 'Bosnia and Herzegovina', code: 'BA', dial: '+387' },
  { name: 'Brazil', code: 'BR', dial: '+55' },
  { name: 'Brunei', code: 'BN', dial: '+673' },
  { name: 'Bulgaria', code: 'BG', dial: '+359' },
  { name: 'Cambodia', code: 'KH', dial: '+855' },
  { name: 'Cameroon', code: 'CM', dial: '+237' },
  { name: 'Canada', code: 'CA', dial: '+1' },
  { name: 'Chile', code: 'CL', dial: '+56' },
  { name: 'China', code: 'CN', dial: '+86' },
  { name: 'Colombia', code: 'CO', dial: '+57' },
  { name: 'Costa Rica', code: 'CR', dial: '+506' },
  { name: 'Croatia', code: 'HR', dial: '+385' },
  { name: 'Cuba', code: 'CU', dial: '+53' },
  { name: 'Cyprus', code: 'CY', dial: '+357' },
  { name: 'Czech Republic', code: 'CZ', dial: '+420' },
  { name: 'Denmark', code: 'DK', dial: '+45' },
  { name: 'Dominican Republic', code: 'DO', dial: '+1-809' },
  { name: 'Ecuador', code: 'EC', dial: '+593' },
  { name: 'Egypt', code: 'EG', dial: '+20' },
  { name: 'El Salvador', code: 'SV', dial: '+503' },
  { name: 'Estonia', code: 'EE', dial: '+372' },
  { name: 'Ethiopia', code: 'ET', dial: '+251' },
  { name: 'Finland', code: 'FI', dial: '+358' },
  { name: 'France', code: 'FR', dial: '+33' },
  { name: 'Georgia', code: 'GE', dial: '+995' },
  { name: 'Germany', code: 'DE', dial: '+49' },
  { name: 'Ghana', code: 'GH', dial: '+233' },
  { name: 'Greece', code: 'GR', dial: '+30' },
  { name: 'Guatemala', code: 'GT', dial: '+502' },
  { name: 'Honduras', code: 'HN', dial: '+504' },
  { name: 'Hong Kong', code: 'HK', dial: '+852' },
  { name: 'Hungary', code: 'HU', dial: '+36' },
  { name: 'Iceland', code: 'IS', dial: '+354' },
  { name: 'India', code: 'IN', dial: '+91' },
  { name: 'Indonesia', code: 'ID', dial: '+62' },
  { name: 'Iran', code: 'IR', dial: '+98' },
  { name: 'Iraq', code: 'IQ', dial: '+964' },
  { name: 'Ireland', code: 'IE', dial: '+353' },
  { name: 'Israel', code: 'IL', dial: '+972' },
  { name: 'Italy', code: 'IT', dial: '+39' },
  { name: 'Jamaica', code: 'JM', dial: '+1-876' },
  { name: 'Japan', code: 'JP', dial: '+81' },
  { name: 'Jordan', code: 'JO', dial: '+962' },
  { name: 'Kazakhstan', code: 'KZ', dial: '+7' },
  { name: 'Kenya', code: 'KE', dial: '+254' },
  { name: 'Kuwait', code: 'KW', dial: '+965' },
  { name: 'Kyrgyzstan', code: 'KG', dial: '+996' },
  { name: 'Laos', code: 'LA', dial: '+856' },
  { name: 'Latvia', code: 'LV', dial: '+371' },
  { name: 'Lebanon', code: 'LB', dial: '+961' },
  { name: 'Libya', code: 'LY', dial: '+218' },
  { name: 'Lithuania', code: 'LT', dial: '+370' },
  { name: 'Luxembourg', code: 'LU', dial: '+352' },
  { name: 'Macau', code: 'MO', dial: '+853' },
  { name: 'Malaysia', code: 'MY', dial: '+60' },
  { name: 'Maldives', code: 'MV', dial: '+960' },
  { name: 'Malta', code: 'MT', dial: '+356' },
  { name: 'Mexico', code: 'MX', dial: '+52' },
  { name: 'Moldova', code: 'MD', dial: '+373' },
  { name: 'Mongolia', code: 'MN', dial: '+976' },
  { name: 'Morocco', code: 'MA', dial: '+212' },
  { name: 'Mozambique', code: 'MZ', dial: '+258' },
  { name: 'Myanmar', code: 'MM', dial: '+95' },
  { name: 'Namibia', code: 'NA', dial: '+264' },
  { name: 'Nepal', code: 'NP', dial: '+977' },
  { name: 'Netherlands', code: 'NL', dial: '+31' },
  { name: 'New Zealand', code: 'NZ', dial: '+64' },
  { name: 'Nicaragua', code: 'NI', dial: '+505' },
  { name: 'Nigeria', code: 'NG', dial: '+234' },
  { name: 'Norway', code: 'NO', dial: '+47' },
  { name: 'Oman', code: 'OM', dial: '+968' },
  { name: 'Pakistan', code: 'PK', dial: '+92' },
  { name: 'Palestine', code: 'PS', dial: '+970' },
  { name: 'Panama', code: 'PA', dial: '+507' },
  { name: 'Paraguay', code: 'PY', dial: '+595' },
  { name: 'Peru', code: 'PE', dial: '+51' },
  { name: 'Philippines', code: 'PH', dial: '+63' },
  { name: 'Poland', code: 'PL', dial: '+48' },
  { name: 'Portugal', code: 'PT', dial: '+351' },
  { name: 'Puerto Rico', code: 'PR', dial: '+1-787' },
  { name: 'Qatar', code: 'QA', dial: '+974' },
  { name: 'Romania', code: 'RO', dial: '+40' },
  { name: 'Russia', code: 'RU', dial: '+7' },
  { name: 'Rwanda', code: 'RW', dial: '+250' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966' },
  { name: 'Senegal', code: 'SN', dial: '+221' },
  { name: 'Serbia', code: 'RS', dial: '+381' },
  { name: 'Singapore', code: 'SG', dial: '+65' },
  { name: 'Slovakia', code: 'SK', dial: '+421' },
  { name: 'Slovenia', code: 'SI', dial: '+386' },
  { name: 'Somalia', code: 'SO', dial: '+252' },
  { name: 'South Africa', code: 'ZA', dial: '+27' },
  { name: 'South Korea', code: 'KR', dial: '+82' },
  { name: 'Spain', code: 'ES', dial: '+34' },
  { name: 'Sri Lanka', code: 'LK', dial: '+94' },
  { name: 'Sudan', code: 'SD', dial: '+249' },
  { name: 'Sweden', code: 'SE', dial: '+46' },
  { name: 'Switzerland', code: 'CH', dial: '+41' },
  { name: 'Syria', code: 'SY', dial: '+963' },
  { name: 'Taiwan', code: 'TW', dial: '+886' },
  { name: 'Tajikistan', code: 'TJ', dial: '+992' },
  { name: 'Tanzania', code: 'TZ', dial: '+255' },
  { name: 'Thailand', code: 'TH', dial: '+66' },
  { name: 'Trinidad and Tobago', code: 'TT', dial: '+1-868' },
  { name: 'Tunisia', code: 'TN', dial: '+216' },
  { name: 'Turkey', code: 'TR', dial: '+90' },
  { name: 'Turkmenistan', code: 'TM', dial: '+993' },
  { name: 'Uganda', code: 'UG', dial: '+256' },
  { name: 'Ukraine', code: 'UA', dial: '+380' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971' },
  { name: 'United Kingdom', code: 'GB', dial: '+44' },
  { name: 'United States', code: 'US', dial: '+1' },
  { name: 'Uruguay', code: 'UY', dial: '+598' },
  { name: 'Uzbekistan', code: 'UZ', dial: '+998' },
  { name: 'Venezuela', code: 'VE', dial: '+58' },
  { name: 'Vietnam', code: 'VN', dial: '+84' },
  { name: 'Yemen', code: 'YE', dial: '+967' },
  { name: 'Zambia', code: 'ZM', dial: '+260' },
  { name: 'Zimbabwe', code: 'ZW', dial: '+263' },
];

// ─── Country Autocomplete Component ─────────────────────────────────────────
interface CountryOption {
  name: string;
  code: string;
  dial: string;
}

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const CountryAutocomplete: React.FC<CountryAutocompleteProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query.trim().length === 0
    ? COUNTRIES
    : COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.dial.includes(query) ||
        c.code.toLowerCase().startsWith(query.toLowerCase())
      );

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement;
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted, open]);

  const select = (country: CountryOption) => {
    setQuery(country.name);
    onChange(country.name);
    setOpen(false);
    setHighlighted(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[highlighted]) select(filtered[highlighted]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  const selectedCountry = COUNTRIES.find(c => c.name === value);

  return (
    <div ref={wrapperRef} className="relative text-left">
      <div className="relative">
        <FaGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={12} />
        {selectedCountry && (
          <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded z-10 pointer-events-none leading-none">
            {selectedCountry.dial}
          </span>
        )}
        <input
          type="text"
          required
          value={query}
          autoComplete="off"
          placeholder="Type country or +dial code…"
          onFocus={() => { setOpen(true); setHighlighted(0); }}
          onChange={e => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pr-8 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs ${selectedCountry ? 'pl-[72px]' : 'pl-10'}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen(o => !o)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <FaChevronDown size={10} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto text-xs"
        >
          {filtered.map((country, idx) => (
            <li
              key={`${country.code}-${country.dial}`}
              onMouseDown={() => select(country)}
              onMouseEnter={() => setHighlighted(idx)}
              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                idx === highlighted ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="font-medium">{country.name}</span>
              <span className="text-[10px] font-bold text-slate-400 ml-2 flex-shrink-0 flex items-center gap-1">
                <span className="bg-slate-100 rounded px-1.5 py-0.5">{country.code}</span>
                <span className="text-brand-600">{country.dial}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── Shared Portal Form Component ──────────────────────────────────────────
interface CertificatePortalFormProps {
  onClose?: () => void;
  onSuccess?: (studentData: { registration_id: string; full_name: string; token: string }) => void;
  title?: string;
  subtitle?: string;
}

export const CertificatePortalForm: React.FC<CertificatePortalFormProps> = ({
  onClose,
  onSuccess,
  title = "Free AI Certificate Portal",
  subtitle = "New candidate? Fill in your details to register. Already registered? Just enter your email — we'll recognize you and log you in instantly."
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    company_name: '',
    academic_institution: '',
    phone: '',
    email: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const [registrationResult, setRegistrationResult] = useState<{
    token: string;
    registration_id: string;
    full_name: string;
    is_new: boolean;
  } | null>(null);

  // ── On mount: if already logged in, skip the form and show the portal ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedToken = localStorage.getItem('aixx_certificate_token');
    const storedRegId = localStorage.getItem('aixx_candidate_reg_id');
    const storedName  = localStorage.getItem('aixx_candidate_name');
    if (storedToken && storedRegId) {
      setRegistrationResult({
        token: storedToken,
        registration_id: storedRegId,
        full_name: storedName || 'Student',
        is_new: false,
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
    if (errorMsg) setErrorMsg('');
  };

  const copyRegId = async () => {
    if (registrationResult?.registration_id) {
      await navigator.clipboard.writeText(registrationResult.registration_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('api/certificate/register-or-login', formData);
        const token = response.data?.token || '';
        const registration_id = response.data?.registration_id || '';
        const full_name = response.data?.full_name || formData.full_name;
        const is_new = response.data?.is_new ?? true;
        const message = response.data?.message || '';

        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('aixx_certificate_token', token);
          // Persist candidate session using shared helper
          persistStudentSession({
            message,
            token,
            registration_id: registration_id,
            full_name: full_name,
            email: formData.email,
          });
        }

      setRegistrationResult({ token, registration_id, full_name, is_new });
      if (onSuccess) {
        onSuccess({ registration_id, full_name, token });
      }
    } catch (err: any) {
      console.error('Certificate portal error:', err);
      const apiMessage = err.response?.data?.message || err.response?.data?.errors;
      if (typeof apiMessage === 'object') {
        const firstKey = Object.keys(apiMessage)[0];
        setErrorMsg(apiMessage[firstKey]?.[0] || 'Please check your details and try again.');
      } else {
        setErrorMsg(apiMessage || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left space-y-6">
      {!registrationResult ? (
        <>
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#E6F0FA] text-[#00245A] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <FaGraduationCap size={24} />
            </div>
            <h3 className="text-2xl font-black text-[#191E42] tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {subtitle}
              </p>
            )}
          </div>


          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Single unified form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  Email <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Already registered? Your email will log you in automatically.</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name <span className="text-brand-600">*</span></label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Gender <span className="text-brand-600">*</span></label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-3.5 text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs"
                >
                  <option value="" disabled hidden>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Country of Residence <span className="text-brand-600">*</span></label>
                <CountryAutocomplete
                  value={formData.country}
                  onChange={handleCountryChange}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone <span className="text-brand-600">*</span></label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+65 9123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <FaBuilding size={11} className="text-slate-400" />
                    Company Name <span className="text-brand-600">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  required
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs"
                />
              </div>

              {/* Academic Institution */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <FaUniversity size={11} className="text-slate-400" />
                    Academic Institution <span className="text-brand-600">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="academic_institution"
                  required
                  value={formData.academic_institution}
                  onChange={handleInputChange}
                  placeholder="e.g. National University of Singapore"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none transition-colors text-xs"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#43933E] hover:bg-[#387D34] text-white font-extrabold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base tracking-wide"
                >
                  {loading ? (
                    <><FaSpinner className="animate-spin" size={16} /><span>Processing…</span></>
                  ) : (
                    <><span>Register &amp; Access Certificate Portal</span><FaArrowRight size={14} /></>
                  )}
                </button>
              </div>

            </div>
          </form>
        </>
      ) : (
        /* Success State */
        <div className="max-w-lg mx-auto w-full text-center space-y-6 py-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${registrationResult.is_new ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-brand-50 text-brand-600 border-brand-200'}`}>
            {registrationResult.is_new ? <FaCheckCircle size={32} /> : <FaLock size={28} />}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#191E42]">
              {registrationResult.is_new ? 'Registration Successful!' : 'Welcome Back!'}
            </h3>
            <p className="text-xs text-slate-600">
              {registrationResult.is_new
                ? <>Welcome, <span className="font-bold text-slate-900">{registrationResult.full_name}</span>! Your candidate ID has been generated.</>
                : <>Welcome back, <span className="font-bold text-slate-900">{registrationResult.full_name}</span>! You've been logged in with your existing account.</>
              }
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Your Official Registration ID</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg font-black text-brand-600 font-mono tracking-wider">{registrationResult.registration_id}</span>
              <button
                onClick={copyRegId}
                className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy Registration ID"
              >
                <FaCopy size={14} />
              </button>
            </div>
            {copied && <span className="text-[10px] text-emerald-600 font-semibold block">Copied to clipboard!</span>}
            <p className="text-[10px] text-slate-400 mt-1">Save this ID — you can use it to access your portal anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => { if (onClose) onClose(); router.push(`/ai-certificate/study?token=${registrationResult.token}`); }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaBookOpen size={14} className="text-brand-600" />
              <span>Start Free Study Guide</span>
            </button>
            <button
              onClick={() => { if (onClose) onClose(); router.push(`/ai-certificate/test?token=${registrationResult.token}`); }}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-600/20"
            >
              <FaGraduationCap size={16} />
              <span>Take 20-MCQ Test</span>
            </button>
          </div>
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('aixx_certificate_token');
                  localStorage.removeItem('aixx_candidate_reg_id');
                  localStorage.removeItem('aixx_candidate_name');
                  localStorage.removeItem('aixx_candidate_email');
                }
                setRegistrationResult(null);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer transition-colors"
            >
              Not you? Register a new account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
