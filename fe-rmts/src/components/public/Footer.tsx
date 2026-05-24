'use client';
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from "@/hooks/useSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { getSetting } = useSettings();

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 360px) and (max-width: 639px) {
          .move-getintouch {
            margin-left: 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .footer-bottom-container {
            align-items: center !important;
            justify-content: center !important;
            flex-direction: column !important;
          }

          .footer-copyright-text {
            text-align: center !important;
            width: 100% !important;
            display: block !important;
          }
          
          .footer-links-container {
            justify-content: center !important;
            width: 100% !important;
          }
        }
      `}} />

      <footer className="bg-[#171b3c] text-white text-sm font-sans overflow-hidden">
        <div className="w-full container mx-auto px-4 sm:px-4 md:px-6 lg:px-7 xl:px-16 2xl:px-60">
          <div className="py-10 flex flex-col justify-between gap-8 lg:gap-12 xl:flex-row">

            {/* Left Section - Logo, Paragraph */}
            <div className="flex-1 max-w-full space-y-4 md:space-y-6 lg:flex lg:flex-col lg:items-center xl:items-start">

              {/* Logo */}
              <div className="flex items-center justify-start sm:justify-center lg:justify-center xl:justify-start w-full">
                <a href="/">
                  <img
                    src="/images/logo/logo.png"
                    alt="AIXX Logo"
                    className="w-40 md:w-44 h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>

             {/* Paragraph */}
              <p className="text-white text-sm leading-5 md:leading-6 font-normal text-left lg:text-center sm:text-center xl:text-left px-2 sm:px-0 w-full mx-auto xl:mx-0" style={{maxWidth: 'clamp(280px, 90vw, 400px)'}}>
                {getSetting('footer_text', 'AIXX brings next-generation AI, quantum, and autonomous systems together to help organizations build resilient, intelligent operations for a shared future.')}
              </p>
            </div>

            {/* Right Section - Columns */}
            <div className="flex-1  grid grid-cols-1 gap-6 [@media(max-width:600px)]:gap-0 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 lg:gap-8 xl:gap-1">

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
              <div className="text-left xlmid:ml-32 xl:ml-0">
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
              <div className="text-left move-getintouch  px-0 [@media(max-width:600px)]:-translate-x-4 xlmid:ml-auto">
                <h3 className="text-brand-600 text-base md:text-lg font-semibold mb-2 md:mb-3">
                  Get In Touch
                </h3>
                <ul className="space-y-2 md:space-y-3 text-gray-400">
                                    <li className="flex flex-col md:flex-row items-start gap-1 md:gap-2">
                    <div className="flex items-center gap-2 hover:text-brand-600">
                       <MapPin className="flex-shrink-0 w-5 h-5 " />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getSetting('contact_address', 'Singapore'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors whitespace-nowrap"
                      >
                        {getSetting('contact_address', 'Singapore')}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-2 hover:text-brand-600">
                    <Phone className="flex-shrink-0 w-5 h-5 " />
                    <a href={`tel:${getSetting('contact_phone', '+65 9771 0677').replace(/\s+/g, '')}`} className=" transition-colors">
                      {getSetting('contact_phone', '+65 9771 0677')}
                    </a>
                  </li>
                  <li className="flex items-center gap-2  hover:text-brand-600">
                    <Mail className="flex-shrink-0 w-5 h-5 " />
                    <a href={`mailto:${getSetting('contact_email', 'cs@aixx.com.sg')}?subject=Enquiry%20from%20Website`} className="transition-colors">
                      {getSetting('contact_email', 'cs@aixx.com.sg')}
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#0f1231] py-3 md:py-4 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-4 md:px-6 lg:px-7 xl:px-16 2xl:px-60">
              <div className="flex flex-col md:flex-row justify-between text-gray-500 text-xs footer-bottom-container">
                <span className="mb-2 md:mb-0 text-left footer-copyright-text">
                  {getSetting('footer_copyright', `© ${currentYear} AIXX`)}
                </span>
                <div className="flex gap-2 footer-links-container">
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