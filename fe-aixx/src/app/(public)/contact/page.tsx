'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { FiMapPin, FiPhone, FiMail, FiAlertCircle, FiX } from 'react-icons/fi';
import { FaBolt } from 'react-icons/fa';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useInquiryForm } from "@/hooks/public/useInquiryForm";
import { toast } from "react-toastify";

import Banner from '@/components/public/Banner';
import useBanners from "@/hooks/public/useBanners";
import { useSettings } from "@/hooks/useSettings";

const ContactPage = () => {
  const { banners, loading: bannerLoading, getAllBanners } = useBanners();
  const { getSetting } = useSettings();

  useEffect(() => {
    getAllBanners('contact');
  }, []);

  const bannerData = useMemo(() => {
    if (banners && banners.length > 0) {
      const banner = banners[0];
      return {
        title: banner.title_1,
        subtitle: banner.subtitle,
        image_url: banner.image?.url,
      };
    }
    return null;
  }, [banners]);

  const bgImage = bannerData?.image_url || "/images/contact-us/contact_banner.png";
  const bannerTitle = bannerData?.title || "Connect with AIXX Academy";
  const bannerSubtitle = bannerData?.subtitle || "Tell us about your AI training needs and we will match your team with the right program, workshop, or enterprise learning path.";

  // Use settings for contact details, with fallback defaults
  const address = getSetting('contact_address', 'Singapore');
  const phoneVal = getSetting('contact_phone', '+65 9771 0677');
  const emailVal = getSetting('contact_email', 'cs@aixx.com.sg');

  const [error, setError] = useState<string | null>(null);

  const {
    formData,
    errors,
    serverError,
    loading,
    handleChange,
    handleSubmit: handleInquirySubmit,
    resetForm,
  } = useInquiryForm(() => {
    toast.success("Your enquiry has been sent!");
    setError(null);
    resetForm();
  });
  

  React.useEffect(() => {
    if (serverError) {
      setError(serverError);
    }
  }, [serverError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    await handleInquirySubmit();
  };

  const clearMessages = () => setError(null);

  // Load service and industry options from site settings (comma-separated), else fallback to defaults
  const defaultServiceOptions = [
    'Artificial Intelligence',
    'Quantum Technology',
    'Cyber Security',
    'Autonomous Mobility',
    'Logistics & Transport',
    'AI Training & Certification',
    'Other',
  ];

  const defaultIndustryOptions = [
    'Manufacturing',
    'Finance & Insurance',
    'Healthcare',
    'Education',
    'Retail / Commerce',
    'Logistics / Transport',
    'Government / Public Sector',
    'Other',
  ];

  // Settings keys: `contact_services_list` and `contact_industries_list` (comma-separated values)
  const servicesSetting = getSetting('contact_services_list');
  const industriesSetting = getSetting('contact_industries_list');

  const SERVICE_OPTIONS = servicesSetting
    ? servicesSetting.split(',').map((s: string) => s.trim()).filter(Boolean)
    : defaultServiceOptions;

  const INDUSTRY_OPTIONS = industriesSetting
    ? industriesSetting.split(',').map((s: string) => s.trim()).filter(Boolean)
    : defaultIndustryOptions;

  return (
    <div className="w-full bg-white font-lato">
      <Banner
        altText="AIXX Contact Banner"
        paths={[{ name: 'Home', href: '/' }, { name: 'Contact' }]}
        title={bannerTitle}
        subtitle={bannerSubtitle}
        bgImage={bgImage}
      />

      <Script id="contact-schema" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AIXX',
          url: 'https://aixx.com.sg/contact',
          logo: 'https://aixx.com.sg/images/logo.png',
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+65 9771 0677',
              contactType: 'customer service',
              areaServed: 'SG',
              availableLanguage: ['English'],
            },
          ],
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'SG',
            addressLocality: 'Singapore',
          },
        })}
      </Script>

      {/* Contact Form Section */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 xl:px-16 2xl:px-24 py-8 sm:py-10 md:py-12 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 w-full">
          {/* Form Container - Left side at 1280px */}
          <section className="w-full max-w-3xl mx-auto xl:mx-0 bg-gray-50 p-4 sm:p-6 md:p-8 xl:p-10 shadow-lg -mt-10 sm:-mt-14 md:-mt-18 lg:-mt-24 xl:-mt-28 2xl:-mt-32 min-w-0 relative">

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
                <div className="flex items-start">
                  <FiAlertCircle className="text-red-400 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                      Unable to Send Message
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={clearMessages}
                    className="ml-2 text-red-400 hover:text-red-600"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Question 1: Service Interest (Select) */}
              <div>
                <label htmlFor="service_interest" className="text-sm font-semibold text-gray-700">
                  1. What service are you interested in?
                </label>
                <select
                  id="service_interest"
                  value={formData.service_interest}
                  onChange={(e) => handleChange('service_interest', e.target.value)}
                  className={`w-full h-12 mt-2 px-4 py-2 bg-white border ${errors.service_interest ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-lg`}
                >
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.service_interest && <p className="text-red-500 text-sm mt-1">{errors.service_interest}</p>}
              </div>

              {/* Question 2: Industry / Business Type (Select) */}
              <div>
                <label htmlFor="industry_type" className="text-sm font-semibold text-gray-700">
                  2. What is your industry / business type?
                </label>
                <select
                  id="industry_type"
                  value={formData.industry_type}
                  onChange={(e) => handleChange('industry_type', e.target.value)}
                  className={`w-full h-12 mt-2 px-4 py-2 bg-white border ${errors.industry_type ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-lg`}
                >
                  <option value="">Select an industry</option>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.industry_type && <p className="text-red-500 text-sm mt-1">{errors.industry_type}</p>}
              </div>

              <div>
                <label htmlFor="budget_timeline" className="text-sm font-semibold text-gray-700">
                  3. What is your expected timeline?
                </label>
                <select
                  id="budget_timeline"
                  value={formData.budget_timeline}
                  onChange={(e) => handleChange('budget_timeline', e.target.value)}
                  className={`w-full h-12 mt-2 px-4 py-2 bg-white border ${errors.budget_timeline ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent rounded-lg`}
                >
                  <option value="">Select timeline</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="More than 6 months">More than 6 months</option>
                  <option value="Planning / not sure yet">Planning / not sure yet</option>
                </select>
                {errors.budget_timeline && <p className="text-red-500 text-sm mt-1">{errors.budget_timeline}</p>}
              </div>

              {/* Question 4: Requirement or Problem */}
              <div>
                <label htmlFor="message" className="text-sm font-semibold text-gray-700">
                  3. What is your requirement or problem?
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Tell us the challenge you want solved or the service you need"
                  className={`w-full px-4 py-3 bg-white border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <hr className="border-gray-200" />

              {/* Contact Details */}
              <div>
                <label htmlFor="customer_name" className="text-sm font-semibold text-gray-700">
                  4. Your name
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                  placeholder="Full name"
                  className={`w-full h-12 px-4 py-2 bg-white border ${errors.customer_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                />
                {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
              </div>

              <div>
                <label htmlFor="customer_email" className="text-sm font-semibold text-gray-700">
                  5. Your email
                </label>
                <input
                  type="email"
                  id="customer_email"
                  value={formData.customer_email}
                  onChange={(e) => handleChange('customer_email', e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full h-12 px-4 py-2 bg-white border ${errors.customer_email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                />
                {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
              </div>

              <div>
                <label htmlFor="customer_phone" className="text-sm font-semibold text-gray-700">
                  6. Your phone number
                </label>
                <div className={`relative w-full border ${errors.customer_phone ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent rounded-xl`}>
                  <PhoneInput
                    international
                    defaultCountry="SG"
                    value={formData.customer_phone}
                    onChange={(value) => handleChange('customer_phone', value || '')}
                    placeholder="Enter phone number"
                    className={`!h-12 !w-full !border-none !px-4 !py-2 ${errors.customer_phone ? '!bg-red-50' : '!bg-white'}`}
                  />
                </div>
                {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`Lato ${loading ? '' : 'beveled-corner4'} w-full flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium text-white ${loading ? 'bg-[#191E42]' : 'bg-brand-500 hover:bg-[#182166]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition-colors duration-200`}
              >
                {loading ? 'Sending...' : 'Submit Service Request'}
                <FaBolt className="ml-2 text-white" />
              </button>
            </form>
          </section>

          {/* Contact Info - Right side at 1280px */}
          <aside className="self-start w-full max-w-lg mx-auto xl:mx-0 p-4 sm:p-6 md:p-8 xl:p-10 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h2 className="Lato text-2xl sm:text-3xl text-gray-800 mb-4 sm:mb-6">
              Build Smarter Systems With AIXX
            </h2>
            <p className="Lato text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              AIXX helps organizations design and deploy intelligent solutions across AI, quantum, autonomy, and cyber resilience so teams can make better decisions faster.
            </p>
            <address className="not-italic space-y-4 sm:space-y-6">
              <ContactDetail
                icon={<FiMapPin className="text-xl text-brand-500" />}
                title="Address"
                value={address}
                href={`https://maps.google.com?q=${encodeURIComponent(address)}`}
              />
              <ContactDetail
                icon={<FiPhone className="text-xl text-brand-500" />}
                title="Phone Number"
                value={phoneVal}
                href={`tel:${phoneVal.replace(/\s+/g, '')}`}
              />
              <ContactDetail
                icon={<FiMail className="text-xl text-brand-500" />}
                title="E-mail"
                value={emailVal}
                href={`mailto:${emailVal}`}
              />
            </address>

          </aside>

        </div>
      </main>
    </div>
  );
};

// Reusable Contact Info Component
const ContactDetail = ({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) => (
  <Link href={href} target="_blank" className="flex items-start gap-4 group w-full">
    <div className="p-3 rounded-full group-hover:bg-brand-100 flex-shrink-0 bg-brand-50 transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="Lato text-lg font-medium text-gray-800 group-hover:text-brand-500 transition-colors">
        {title}
      </h3>
      <p className="Lato text-base text-gray-600 group-hover:text-brand-500 mt-1 transition-colors">
        {value}
      </p>
    </div>
  </Link>
);

export default ContactPage;