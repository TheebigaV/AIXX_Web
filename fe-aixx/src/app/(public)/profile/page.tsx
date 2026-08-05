'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import adminApi from '@/lib/api';
import publicApi from '@/lib/public/api';
import { toast } from 'react-toastify';

type ProfileData = {
  full_name: string;
  email: string;
  gender?: string;
  phone?: string;
  country?: string;
  company_name?: string;
  academic_institution?: string;
  registration_id?: string;
  isCandidate: boolean;
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editAcademicInstitution, setEditAcademicInstitution] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchProfile = async () => {
      setLoading(true);
      const storedToken = window.localStorage.getItem('aixx_certificate_token');

      if (storedToken) {
        // Fetch candidate details from backend
        try {
          const res = await publicApi.get(`api/certificate/profile?token=${storedToken}`);
          const data = res.data;
          const profile = {
            full_name: data.full_name || '',
            email: data.email || '',
            gender: data.gender || '',
            phone: data.phone || '',
            country: data.country || '',
            company_name: data.company_name || '',
            academic_institution: data.academic_institution || '',
            registration_id: data.registration_id || '',
            isCandidate: true,
          };
          setProfileData(profile);
          setEditName(profile.full_name);
          setEditEmail(profile.email);
          setEditGender(profile.gender);
          setEditPhone(profile.phone);
          setEditCountry(profile.country);
          setEditCompanyName(profile.company_name);
          setEditAcademicInstitution(profile.academic_institution);
        } catch (err) {
          console.error('Failed to load candidate profile:', err);
          // Fallback to localStorage if backend fetch fails
          const fallback: ProfileData = {
            full_name: window.localStorage.getItem('aixx_candidate_name') || 'User',
            email: window.localStorage.getItem('aixx_candidate_email') || '',
            registration_id: window.localStorage.getItem('aixx_candidate_reg_id') || undefined,
            isCandidate: true,
          };
          setProfileData(fallback);
          setEditName(fallback.full_name);
          setEditEmail(fallback.email);
        } finally {
          setLoading(false);
        }
        return;
      }

      // If standard admin user
      if (user) {
        const profile: ProfileData = {
          full_name: user.name || 'User',
          email: user.email || '',
          isCandidate: false,
        };
        setProfileData(profile);
        setEditName(profile.full_name);
        setEditEmail(profile.email);
        setLoading(false);
        return;
      }

      setProfileData(null);
      setLoading(false);
    };

    fetchProfile();
    window.addEventListener('aixx-auth-change', fetchProfile as EventListener);
    return () => window.removeEventListener('aixx-auth-change', fetchProfile as EventListener);
  }, [user]);

  const handleSave = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      setSaveError('Name and email are required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('aixx_certificate_token') : null;

      if (profileData?.isCandidate && storedToken) {
        // Save candidate details via candidate API
        const payload = {
          token: storedToken,
          full_name: editName.trim(),
          email: editEmail.trim(),
          gender: editGender,
          phone: editPhone.trim(),
          country: editCountry.trim(),
          company_name: editCompanyName.trim(),
          academic_institution: editAcademicInstitution.trim(),
        };

        const res = await publicApi.put('api/certificate/profile', payload);
        const data = res.data;

        setProfileData({
          full_name: data.full_name,
          email: data.email,
          gender: data.gender,
          phone: data.phone,
          country: data.country,
          company_name: data.company_name,
          academic_institution: data.academic_institution,
          registration_id: data.registration_id,
          isCandidate: true,
        });

        // Update localStorage name to update header and elsewhere immediately
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('aixx_candidate_name', data.full_name);
          window.localStorage.setItem('aixx_candidate_email', data.email);
          window.dispatchEvent(new Event('aixx-auth-change'));
        }
      } else {
        // Save admin details via admin API
        const res = await adminApi.put('/api/profile', { name: editName.trim(), email: editEmail.trim() });
        const updatedUser = res.data?.user;
        if (updatedUser) {
          setProfileData({
            full_name: updatedUser.name,
            email: updatedUser.email,
            isCandidate: false,
          });
          if (typeof setUser === 'function') {
            setUser((prev: any) => prev ? { ...prev, name: updatedUser.name, email: updatedUser.email } : prev);
          }
        }
      }

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      const apiMessage = err.response?.data?.message || err.response?.data?.errors;
      if (typeof apiMessage === 'object') {
        const firstKey = Object.keys(apiMessage)[0];
        setSaveError(apiMessage[firstKey]?.[0] || 'Validation error occurred.');
      } else {
        setSaveError(apiMessage || 'Failed to update profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setEditName(profileData.full_name);
      setEditEmail(profileData.email);
      setEditGender(profileData.gender || '');
      setEditPhone(profileData.phone || '');
      setEditCountry(profileData.country || '');
      setEditCompanyName(profileData.company_name || '');
      setEditAcademicInstitution(profileData.academic_institution || '');
    }
    setSaveError('');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile details...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-lg text-gray-700 dark:text-gray-300">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Header Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        {/* Top hero strip */}
        <div className="h-24 bg-gradient-to-r from-[#00245A] to-[#1E4DB7]" />

        {/* Avatar + header */}
        <div className="px-6 pb-6 -mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#00245A] text-3xl font-bold text-white shadow-md dark:border-gray-900">
                {profileData.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {profileData.full_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Personal Information Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Personal Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                <svg className="fill-current w-3.5 h-3.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z" fill="" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {saveError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={e => { setEditName(e.target.value); setSaveError(''); }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-[#00245A] focus:ring-2 focus:ring-[#00245A]/20 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white text-xs font-semibold"
                  placeholder="Full Name"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{profileData.full_name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</p>
              {isEditing ? (
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => { setEditEmail(e.target.value); setSaveError(''); }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-[#00245A] focus:ring-2 focus:ring-[#00245A]/20 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white text-xs font-semibold"
                  placeholder="Email Address"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{profileData.email}</p>
              )}
            </div>

            {/* If it's a Candidate, show course details */}
            {profileData.isCandidate && (
              <>
                {/* Registration ID — Read only, not editable */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registration ID</p>
                  <p className="text-sm font-mono font-bold text-[#00245A] dark:text-blue-400 select-all">
                    {profileData.registration_id || 'Not assigned'}
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</p>
                  {isEditing ? (
                    <select
                      value={editGender}
                      onChange={e => { setEditGender(e.target.value); setSaveError(''); }}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-[#00245A] focus:ring-2 focus:ring-[#00245A]/20 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white text-xs font-semibold"
                    >
                      <option value="" disabled hidden>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">{profileData.gender || 'N/A'}</p>
                  )}
                </div>

                {/* Country of Residence */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country of Residence</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editCountry}
                      onChange={e => { setEditCountry(e.target.value); setSaveError(''); }}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-[#00245A] focus:ring-2 focus:ring-[#00245A]/20 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white text-xs font-semibold"
                      placeholder="Country of Residence"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">{profileData.country || 'N/A'}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editPhone}
                      onChange={e => { setEditPhone(e.target.value); setSaveError(''); }}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-[#00245A] focus:ring-2 focus:ring-[#00245A]/20 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white text-xs font-semibold"
                      placeholder="Phone"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">{profileData.phone || 'N/A'}</p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editCompanyName}
                      onChange={e => { setEditCompanyName(e.target.value); setSaveError(''); }}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-[#00245A] focus:ring-2 focus:ring-[#00245A]/20 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white text-xs font-semibold"
                      placeholder="Company Name"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">{profileData.company_name || 'N/A'}</p>
                  )}
                </div>

                {/* Academic Institution */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Academic Institution</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editAcademicInstitution}
                      onChange={e => { setEditAcademicInstitution(e.target.value); setSaveError(''); }}
                      className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-[#00245A] focus:ring-2 focus:ring-[#00245A]/20 transition dark:border-gray-700 dark:bg-gray-800 dark:text-white text-xs font-semibold"
                      placeholder="Academic Institution"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">{profileData.academic_institution || 'N/A'}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Edit action buttons */}
          {isEditing && (
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-[#00245A] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1E4DB7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05] text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
