"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { FaBolt, FaFire, FaGraduationCap } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useCategories from "@/hooks/public/useCategories";
import CandidateDropdown from "@/components/header/CandidateDropdown";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Technologies", href: "/technologies" },
  { label: "Innovative Products", href: "/innovative-products" },
  { label: "AI-Hot News", href: "/ai-hot-news" },
];

const AI_TRAINING_LINKS = [
  { label: "Free AI Knowledge Certificate", href: "/courses?tab=free_courses" },
  { label: "Seminars", href: "/training-and-certification/seminars" },
  { label: "Workshops", href: "/training-and-certification/workshops" },
  { label: "Courses", href: "/courses" },
  { label: "Training Media Gallery", href: "/training-and-certification/media-gallery" },
  { label: "Skill Training & Certification", href: "/training-and-certification/certification" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileTrainingOpen, setMobileTrainingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { getAllCategories } = useCategories();
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [candidateRegId, setCandidateRegId] = useState<string | null>(null);
  const [candidateEmail, setCandidateEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkCandidateLogin = () => {
      setCandidateName(localStorage.getItem("aixx_candidate_name"));
      setCandidateRegId(localStorage.getItem("aixx_candidate_reg_id"));
      setCandidateEmail(localStorage.getItem("aixx_candidate_email"));
    };
    checkCandidateLogin();
    window.addEventListener("aixx-auth-change", checkCandidateLogin as EventListener);
    return () => window.removeEventListener("aixx-auth-change", checkCandidateLogin as EventListener);
  }, []);

  const handleCandidateLogout = () => {
    localStorage.removeItem("aixx_student_token");
    localStorage.removeItem("aixx_certificate_token");
    localStorage.removeItem("aixx_candidate_name");
    localStorage.removeItem("aixx_candidate_reg_id");
    localStorage.removeItem("aixx_candidate_email");
    window.dispatchEvent(new Event("aixx-auth-change"));
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Listen for storage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'aixx_candidate_name' || e.key === 'aixx_candidate_reg_id' || e.key === 'aixx_candidate_email') {
        // Re-run the check to update state
        const checkCandidateLogin = () => {
          setCandidateName(localStorage.getItem('aixx_candidate_name'));
          setCandidateRegId(localStorage.getItem('aixx_candidate_reg_id'));
          setCandidateEmail(localStorage.getItem('aixx_candidate_email'));
        };
        checkCandidateLogin();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileTrainingOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/training-and-certification" && pathname?.startsWith("/training-and-certification")) ||
    (href === "/technologies" && pathname?.startsWith("/technologies")) ||
    (href === "/innovative-products" && pathname?.startsWith("/innovative-products"));

  const isTrainingActive = pathname?.startsWith("/training-and-certification") || pathname?.startsWith("/courses");

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white border-b border-gray-200 shadow-sm"
        }`}
    >
      {/* ── Main bar ── */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 md:px-10 lgmid:px-16 xlmid:px-24 2xl:px-32 h-[72px]">

        {/* ── Brand / Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0"
          aria-label="AIXX Home"
        >
          <div className="relative w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] flex-shrink-0">
            <Image
              src="/images/logo/logo.png"
              alt="AIXX Logo"
              fill
              priority
              sizes="48px"
              className="object-contain object-left"
            />
          </div>
          <div className="hidden sm:flex flex-col justify-center leading-tight">
            <span className="text-[#191E42] font-extrabold text-base tracking-tight">
              AIXX
            </span>
            <span className="text-gray-500 font-medium text-[11px] tracking-widest uppercase">
              PTE LTD
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lgmid:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`relative px-3 xlmid:px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group
                ${isActive(href)
                  ? "text-brand-600"
                  : "text-[#374151] hover:text-brand-600"
                }`}
            >
              {label}
              {/* animated underline */}
              <span
                className={`absolute bottom-0 left-3 xlmid:left-4 right-3 xlmid:right-4 h-[2px] rounded-full bg-brand-500 transition-all duration-300 origin-left
                  ${isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
              />
            </Link>
          ))}

          {/* AI Training dropdown */}
          <div className="relative group">
            <button
              className={`relative flex items-center gap-1 px-3 xlmid:px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${isTrainingActive ? "text-brand-600" : "text-[#374151] hover:text-brand-600"}`}
            >
              AI Training
              <FiChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              <span
                className={`absolute bottom-0 left-3 xlmid:left-4 right-3 xlmid:right-4 h-[2px] rounded-full bg-brand-500 transition-all duration-300 origin-left
                  ${isTrainingActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
              />
            </button>

            {/* Dropdown panel */}
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
              <div className="w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                {AI_TRAINING_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-colors duration-150
                      ${pathname === href
                        ? "bg-brand-50 text-brand-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                      }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden lgmid:flex items-center gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100"
          >
            Contact Us
            <FaBolt className="w-3 h-3 transition-transform group-hover:rotate-12" />
          </Link>

          <div className="ml-1 pl-3 border-l border-gray-200 h-8 flex items-center">
            <CandidateDropdown 
              candidateName={candidateName} 
              candidateRegId={candidateRegId} 
              candidateEmail={candidateEmail} 
              onLogout={handleCandidateLogout} 
            />
          </div>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="lgmid:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu"
        className={`lgmid:hidden overflow-y-auto transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-white border-t border-gray-100 px-6 py-4 space-y-1 shadow-lg">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${isActive(href)
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                }`}
            >
              {label}
              <span className="text-gray-400">›</span>
            </Link>
          ))}

          {/* Mobile AI Training accordion */}
          <div>
            <button
              onClick={() => setMobileTrainingOpen((p) => !p)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${isTrainingActive ? "bg-brand-50 text-brand-600" : "text-gray-700 hover:bg-gray-50"}`}
            >
              AI Training
              <FiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${mobileTrainingOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${mobileTrainingOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="pl-4 pt-1 space-y-1">
                {AI_TRAINING_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors
                      ${pathname === href
                        ? "bg-brand-50 text-brand-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-brand-600"
                      }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="pt-3 pb-1 space-y-3">
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100"
            >
              Contact Us
              <FaBolt className="w-3 h-3 transition-transform group-hover:rotate-12" />
            </Link>

            <div className="flex justify-center w-full border-t border-gray-100 pt-3">
              <CandidateDropdown 
                candidateName={candidateName} 
                candidateRegId={candidateRegId} 
                candidateEmail={candidateEmail} 
                onLogout={handleCandidateLogout} 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
