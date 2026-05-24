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
      pathname === href || (href === "/product" && pathname?.startsWith("/product/"))
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
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/training-and-certification"
                  onClick={handleNavClick}
                  className={`${navLinkClass("/training-and-certification")} whitespace-nowrap`}
                  aria-current={pathname === "/training-and-certification" ? "page" : undefined}
                >
                  Training
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
              <span>Services</span>
              <span className="text-xl transition-transform group-hover:translate-x-1 -rotate-45">→</span>
            </Link>

            <Link
              href="/training-and-certification"
              onClick={handleNavClick}
              className={`flex items-center justify-between ${navLinkClass("/training-and-certification")} group`}
              aria-current={pathname === "/training-and-certification" ? "page" : undefined}
            >
              <span className="truncate max-w-[250px]">Training</span>
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
