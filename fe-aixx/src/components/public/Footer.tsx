'use client';
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from "@/hooks/useSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { getSetting } = useSettings();

  return (
    <>

      <footer className="bg-[#171b3c] text-white text-sm font-sans overflow-hidden">
        <div className="w-full px-4 sm:px-6 md:px-10 lgmid:px-16 xlmid:px-24 2xl:px-32">
          <div className="py-8 sm:py-10 flex flex-col justify-between gap-8 lgmid:gap-12 xlmid:flex-row">

            {/* Left Section - Logo, Paragraph */}
            <div className="flex-1 max-w-full space-y-4 md:space-y-6 flex flex-col items-start">

              {/* Logo */}
              <div className="flex items-center justify-start w-full">
                <a href="/">
                  <img
                    src="/images/logo/logo.png"
                    alt="AIXX Logo"
                    className="w-36 sm:w-40 md:w-44 h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>

             {/* Paragraph */}
             <div className="space-y-1">
               <p className="text-white text-sm leading-6 font-normal text-left max-w-sm">
                {getSetting('footer_text', 'AIXX brings next-generation AI, quantum, and autonomous systems together to help organizations build resilient, intelligent operations for a shared future.')}
              </p>
              <p className="text-gray-400 text-xs font-semibold text-left">
                AIXX PTE LTD, SINGAPORE.
              </p>
             </div>
            </div>

            {/* Right Section - Columns */}
            <div className="flex-1 grid grid-cols-1 gap-8 sm:grid-cols-2 lgmid:grid-cols-3 lgmid:gap-12">

              {/* Quick Links */}
              <div className="text-left">
                <h3 className="text-brand-600 text-base md:text-lg font-semibold mb-2 md:mb-3">Quick Links</h3>
                                <ul className="space-y-1.5 md:space-y-2 text-gray-400">
                  <li><a href="/about-us" className="hover:text-brand-600 transition-colors block py-1 md:py-0">About Us</a></li>
                  <li><a href="/services" className="hover:text-brand-600 transition-colors block py-1 md:py-0">Services</a></li>
                  <li><a href="/contact" className="hover:text-brand-600 transition-colors block py-1 md:py-0">Contact Us</a></li>
                </ul>
              </div>

              {/* Services */}
              <div className="text-left">
                <h3 className="text-brand-600 text-base md:text-lg font-semibold mb-2 md:mb-3">Services</h3>
                                <ul className="space-y-1.5 md:space-y-2 text-gray-400">
                  <li><a href="/services" className="hover:text-brand-600 transition-colors block py-1 md:py-0">Artificial Intelligence</a></li>
                  <li><a href="/services" className="hover:text-brand-600 transition-colors block py-1 md:py-0">Quantum Technology</a></li>
                  <li><a href="/services" className="hover:text-brand-600 transition-colors block py-1 md:py-0">Cyber Security</a></li>
                  <li><a href="/services" className="hover:text-brand-600 transition-colors block py-1 md:py-0">Autonomous Mobility</a></li>
                  <li><a href="/services" className="hover:text-brand-600 transition-colors block py-1 md:py-0">Logistics & Transport</a></li>
                </ul>
              </div>

              {/* Get In Touch */}
              <div className="text-left sm:col-span-2 lgmid:col-span-1">
                <h3 className="text-brand-600 text-base md:text-lg font-semibold mb-2 md:mb-3">
                  Get In Touch
                </h3>
                <ul className="space-y-2 md:space-y-3 text-gray-400">
                  <li className="flex items-start gap-2 hover:text-brand-600">
                    <MapPin className="flex-shrink-0 w-5 h-5 mt-0.5" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getSetting('contact_address', 'Singapore'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors break-words"
                    >
                      {getSetting('contact_address', 'Singapore')}
                    </a>
                  </li>
                  <li className="flex items-center gap-2 hover:text-brand-600">
                    <Phone className="flex-shrink-0 w-5 h-5 " />
                    <a href={`tel:${getSetting('contact_phone', '+65 9771 0677').replace(/\s+/g, '')}`} className="transition-colors break-all">
                      {getSetting('contact_phone', '+65 9771 0677')}
                    </a>
                  </li>
                  <li className="flex items-center gap-2 hover:text-brand-600">
                    <Mail className="flex-shrink-0 w-5 h-5 " />
                    <a href={`mailto:${getSetting('contact_email', 'cs@aixx.com.sg')}?subject=Enquiry%20from%20Website`} className="transition-colors break-all">
                      {getSetting('contact_email', 'cs@aixx.com.sg')}
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bg-[#0f1231] py-3 md:py-4 -mx-4 sm:-mx-6 md:-mx-10 lgmid:-mx-16 xlmid:-mx-24 2xl:-mx-32">
            <div className="w-full px-4 sm:px-6 md:px-10 lgmid:px-16 xlmid:px-24 2xl:px-32">
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-center text-gray-500 text-xs">
                <span>
                  {getSetting('footer_copyright', `© ${currentYear} AIXX`)}
                </span>
                <div className="flex gap-2 flex-wrap justify-center">
                  <a href="/privacy-policy" className="hover:underline hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600 px-1 rounded">
                    Privacy Policy
                  </a>
                  <span>-</span>
                  <a href="/terms-condition" className="hover:underline hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600 px-1 rounded">
                    Term & Conditions
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;