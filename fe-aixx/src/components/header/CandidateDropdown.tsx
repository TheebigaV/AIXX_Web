"use client";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { fetchMyCourses, Course } from "@/services/studentService";
import Link from "next/link";

interface CandidateDropdownProps {
  candidateName: string | null;
  candidateRegId: string | null;
  candidateEmail?: string | null;
  onLogout: () => void;
}

export default function CandidateDropdown({
  candidateName,
  candidateRegId,
  candidateEmail,
  onLogout,
}: CandidateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  const isLoggedIn = !!candidateName || (mounted && Boolean(typeof window !== "undefined" && localStorage.getItem("aixx_student_token")));

  useEffect(() => {
    if (!isLoggedIn) return;
    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        const data = await fetchMyCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, [isLoggedIn]);

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    closeDropdown();
    onLogout();
  };

  const userInitial = candidateName ? candidateName.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative">
      {/* ── Trigger button ── */}
      <button
        onClick={toggleDropdown}
        className="group flex items-center gap-2 rounded-full pl-1 pr-2 py-1 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dropdown-toggle"
        aria-label="User menu"
      >
        {/* Avatar circle */}
        <span
          className={`relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold flex-shrink-0 transition-all duration-200 ${isLoggedIn ? "bg-gradient-to-br from-brand-500 to-green-400 text-white shadow-md shadow-brand-500/30 ring-2 ring-white ring-offset-1" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-brand-300 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-900/20 dark:group-hover:text-brand-400"}`}
        >
          {isLoggedIn ? (
            <span className="leading-none">{userInitial}</span>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
            </svg>
          )}
          {/* Online pulse dot when logged in */}
          {isLoggedIn && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white dark:border-gray-900" />
          )}
        </span>

        {/* Name + RegID (desktop only, when logged in) */}
        {isLoggedIn && (
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-gray-800 dark:text-white/90 max-w-[110px] truncate">
              {candidateName}
            </span>
            <span className="text-[10px] font-medium text-brand-500 dark:text-brand-400 tracking-wide">
              {candidateRegId}
            </span>
            {candidateEmail && (
              <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate max-w-[150px] mt-0.5">
                {candidateEmail}
              </span>
            )}
          </div>
        )}

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-500" : "group-hover:text-gray-600"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* ── Dropdown panel ── */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-3 w-[240px] flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/60 dark:shadow-gray-900/80 p-2 overflow-hidden"
      >
        {isLoggedIn ? (
          <>
            {/* Profile header inside dropdown */}
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-gradient-to-r from-brand-50 to-green-50 dark:from-brand-900/20 dark:to-green-900/20 border border-brand-100 dark:border-brand-800/30">
              <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-green-400 text-white font-bold text-base shadow-md shadow-brand-500/30">
                {userInitial}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate">{candidateName}</p>
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">{candidateRegId}</p>
                {candidateEmail && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {candidateEmail}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Active
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-0.5">
              <li>
                <Link
                  href="/profile"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" />
                    </svg>
                  </span>
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/my-courses"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                    </svg>
                  </span>
                  My Courses
                </Link>
              </li>
            </ul>

            <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300 transition-colors group"
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z" />
                </svg>
              </span>
              Sign Out
            </button>
          </>
        ) : (
          <>
            {/* Guest header */}
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Welcome!</p>
                <p className="text-xs text-gray-400">Sign in to your account</p>
              </div>
            </div>

            <ul className="flex flex-col gap-0.5">
              <li>
                <Link
                  href="/signin"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-brand-600 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20.2C9.5 20.2 7.29 18.92 6 16.98C6.03 14.99 10 13.9 12 13.9C13.99 13.9 17.97 14.99 18 16.98C16.71 18.92 14.5 20.2 12 20.2Z" />
                    </svg>
                  </span>
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  onClick={closeDropdown}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-brand-600 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM6 10V7H4V10H1V12H4V15H6V12H9V10H6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14Z" />
                    </svg>
                  </span>
                  Create Account
                </Link>
              </li>
            </ul>

            {/* CTA footer removed */}
          </>
        )}
      </Dropdown>
    </div>
  );
}

