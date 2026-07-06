"use client";

import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useCategories from "@/hooks/public/useCategories";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileProductDropdownOpen, setMobileProductDropdownOpen] = useState(false);
  const pathname = usePathname();

  const { categories, getAllCategories } = useCategories(); // dynamic categories

  useEffect(() => {
    getAllCategories(); 
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setMobileProductDropdownOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileProductDropdownOpen(false);
  };

  const toggleMobileProductDropdown = () => {
    setMobileProductDropdownOpen((prev) => !prev);
  };

  const handleNavClick = () => closeMenu();

  const navLinkClass = (href: string) =>
    `hover:text-brand-500 transition-colors ${
      pathname === href ||
      (href === "/training-and-certification" && pathname?.startsWith("/training-and-certification")) ||
      (href === "/product" && pathname?.startsWith("/product/"))
        ? "text-brand-500 font-semibold"
        : ""
    }`;

  return (
    <header className="bg-white w-full z-50 border-b border-gray-200 shadow-sm fixed">
      <div className=" w-full mx-auto container flex items-center justify-between px-4 sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] py-[12px]">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="relative w-[124px] sm:w-[124px] md:w-[188px] h-[45px] sm:h-[45px] md:h-[68px] sm:mr-[] md:mr-[328px] lg:mr-[496px] xl:mr-[324px] 2xl:mr-[484px] "
          aria-label="AIXX Home"
        >
          <Image
            src="/images/logo/logo.png"
            alt="AIXX Logo"
            fill
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xlmid:flex items-center space-x-[37px] h-[48px]">
          <nav className="text-[#191E42] font-medium text-base sm:text-[16px]">
            <ul className="flex space-x-[25px] xl:space-x-[66px] items-center">
              <li>
                <Link
                  href="/"
                  onClick={handleNavClick}
                  className={`${navLinkClass("/")} whitespace-nowrap`}
                  aria-current={pathname === "/" ? "page" : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  onClick={handleNavClick}
                  className={`${navLinkClass("/about-us")} whitespace-nowrap`}
                  aria-current={pathname === "/about-us" ? "page" : undefined}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  onClick={handleNavClick}
                  className={`${navLinkClass("/services")} whitespace-nowrap`}
                  aria-current={pathname === "/services" ? "page" : undefined}
                >
                  Technologies
                </Link>
              </li>
              <li className="relative group">
                <div className="inline-flex items-center gap-1">
                  <Link
                    href="/training-and-certification"
                    onClick={handleNavClick}
                    className={`${navLinkClass("/training-and-certification")} whitespace-nowrap inline-flex items-center gap-1`}
                    aria-current={pathname === "/training-and-certification" ? "page" : undefined}
                  >
                    AI Training
                    <span className="text-[10px] text-slate-500">▾</span>
                  </Link>
                </div>
                <div className="invisible absolute left-0 top-full z-40 mt-3 w-52 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl transition-all duration-200 group-hover:visible group-hover:block">
                  <Link
                    href="/training-and-certification/seminars"
                    onClick={handleNavClick}
                    className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Seminars
                  </Link>
                  <Link
                    href="/training-and-certification/workshops"
                    onClick={handleNavClick}
                    className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Workshops
                  </Link>
                  <Link
                    href="/training-and-certification/courses"
                    onClick={handleNavClick}
                    className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Courses
                  </Link>
                  <Link
                    href="/training-and-certification/newsletters"
                    onClick={handleNavClick}
                    className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Latest Technology News
                  </Link>
                  <Link
                    href="/training-and-certification/media-gallery"
                    onClick={handleNavClick}
                    className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Training Media Gallery
                  </Link>
                  <Link
                    href="/training-and-certification/certification"
                    onClick={handleNavClick}
                    className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Skill Training & Certification
                  </Link>
                </div>
              </li>
              <li>
                <Link
                  href="/innovative-products"
                  onClick={handleNavClick}
                  className={`${navLinkClass("/innovative-products")} whitespace-nowrap`}
                  aria-current={pathname === "/innovative-products" ? "page" : undefined}
                >
                  Innovative Products
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Contact Button */}
          <Link
            href="/contact"
            onClick={handleNavClick}
            className="beveled-corner group flex items-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 transition-colors"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            <span>Contact Us</span>
            <FaBolt className="text-white group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="xlmid:hidden">
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="p-2 focus:outline-none"
          >
            {menuOpen ? <FiX className="w-7 h-7 text-[#191E42]" /> : <FiMenu className="w-7 h-7 text-[#191E42]" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="px-[12px] py-[6px]">
        <div id="mobile-menu" className="xlmid:hidden w-full bg-[#F4F4F4] polygon-corner-bg1 shadow-md px-6 py-6 text-[#191E42] text-base ">
          <nav className="flex flex-col space-y-6 font-medium">
            <Link
              href="/"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/")} group`}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              <span>Home</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/about-us"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/about-us")} group`}
              aria-current={pathname === "/about-us" ? "page" : undefined}
            >
              <span>About Us</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/services"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/services")} group`}
              aria-current={pathname === "/services" ? "page" : undefined}
            >
              <span>Technologies</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification")} group`}
              aria-current={pathname === "/training-and-certification" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">AI Training</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification/seminars"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification/seminars")} group`}
              aria-current={pathname === "/training-and-certification/seminars" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">Seminars</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification/workshops"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification/workshops")} group`}
              aria-current={pathname === "/training-and-certification/workshops" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">Workshops</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification/courses"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification/courses")} group`}
              aria-current={pathname === "/training-and-certification/courses" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">Courses</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification/newsletters"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification/newsletters")} group`}
              aria-current={pathname === "/training-and-certification/newsletters" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">Latest Technology News</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification/media-gallery"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification/media-gallery")} group`}
              aria-current={pathname === "/training-and-certification/media-gallery" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">Training Media Gallery</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification/certification"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification/certification")} group`}
              aria-current={pathname === "/training-and-certification/certification" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">Skill Training & Certification</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/innovative-products"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/innovative-products")} group`}
              aria-current={pathname === "/innovative-products" ? "page" : undefined}
            >
              <span>Innovative Products</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            {/* Mobile Contact Button */}
            <Link
              href="/contact"
              onClick={handleNavClick}
              className={`beveled-corner w-full px-4 py-2 bg-brand-500 text-white flex items-center justify-center space-x-2 transition hover:bg-brand-600 ${
                pathname === "/contact" ? "font-semibold" : ""
              }`}
              aria-current={pathname === "/contact" ? "page" : undefined}
            >
              <span>Contact Us</span>
              <FaBolt className="text-white group-hover:rotate-12 transition-transform" />
            </Link>
          </nav>
        </div>
        </div>
      )}
    </header>
  );
};

export default Header;
