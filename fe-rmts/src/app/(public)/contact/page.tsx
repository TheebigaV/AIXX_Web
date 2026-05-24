'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';
import { FaBolt } from 'react-icons/fa';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useContactForm } from "@/hooks/public/useContactForm";
import { toast } from "react-toastify";

import useBanners from "@/hooks/public/useBanners";
import { useSettings } from "@/hooks/useSettings";

const ContactPage = () => {
  const { banners, loading: bannerLoading, getAllBanners } = useBanners();
  const [contactDetails, setContactDetails] = useState<any>(null);
  const { getSetting } = useSettings();

  useEffect(() => {
    getAllBanners('contact');
    
    // Fetch contact details banner separately using the underlying API to avoid hook conflicts
    import('@/lib/public/banners').then(module => {
      module.fetchAllBanners('contact_details').then(res => {
        if (res.data?.data && res.data.data.length > 0) {
          setContactDetails(res.data.data[0]);
        }
      }).catch(console.error);
    });
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
  const bannerTitle = bannerData?.title || "Connect with AIXX";
  const bannerSubtitle = bannerData?.subtitle || "AIXX accelerates intelligent businesses with AI, quantum, autonomous, and cybersecurity systems. Reach out to explore how we can power your next-generation transformation.";

  // Use contact details banner if available
  const address = getSetting('contact_address') || contactDetails?.subtitle || "Singapore";
  const phoneVal = getSetting('contact_phone') || contactDetails?.title_1 || "+65 9771 0677";
  const emailVal = getSetting('contact_email') || contactDetails?.title_2 || "cs@aixx.com.sg";

  const [phone, setPhone] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    formData,
    errors,
    serverError,
    loading,
    handleChange,
    handleSubmit: handleContactSubmit,
  } = useContactForm(() => {
    toast.success("Your message has been sent!");
    setSuccess(true);
    setError(null);

    // Clear all form fields after successful submission
    setPhone('');
    // Clear formData by calling handleChange with empty values
    handleChange('name', '');
    handleChange('email', '');
    handleChange('message', '');
  });

  useEffect(() => {
    formData.phone = phone;
  }, [phone, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    try {
      await handleContactSubmit();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const resetSuccess = () => setSuccess(false);
  const clearMessages = () => setError(null);

  return (
    <div className="w-full bg-white font-lato">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[665px] w-full">
        <div className="relative w-full h-full">
          <img
            src={bgImage}
            alt="AIXX Contact Banner"
            className="object-cover absolute w-full h-full inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
        </div>

        <div className="mx-auto container absolute inset-0 flex items-end px-4 sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] py-20 sm:py-24 lg:py-32 xl:py-40">
          <div className="w-full max-w-[1200px] mx-auto lg:mx-[-60px] lg:pl-14 xl:pl-18 xl:mx-[-70px] 2xl:mx-0 2xl:pl-0 px-4">
            <div className="max-w-[680px] 2xl:ml-[5px]">
              <h1 className="Lato text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-5xl font-bold text-white mb-4">
                {bannerTitle}
              </h1>
              <p className="Lato text-xs xs:text-sm sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-white leading-normal sm:leading-relaxed">
                {bannerSubtitle}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto px-4 sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] py-8 sm:py-12 md:py-16 relative z-10">
        <div className="flex flex-col lg:flex-col xlmid:flex-row xl:flex-row gap-6 sm:gap-8 w-full">
          {/* Form Container - Left side at 1280px */}
          <div className="w-full lg:w-full xlmid:w-1/2 bg-gray-50 p-4 sm:p-6 md:p-8 xl:p-8 2xl:p-8 shadow-lg -mt-12 md:-mt-28 sm:-mt-16 lg:-mt-36 xl:-mt-44 2xl:-mt-44 xlmid:h-fit xl:h-fit 2xl:h-fit xlmid:ml-[0px]  z-20 relative order-1 lg:order-1 xlmid:order-1">

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
              {/* Name */}
              <div>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Name"
                  className={`w-full h-12 px-4 py-2 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="E-mail"
                  className={`w-full h-12 px-4 py-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <div className={`relative w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                  } focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent`}>
                  <PhoneInput
                    international
                                        defaultCountry="SG"
                    value={phone}
                    onChange={(value) => setPhone(value || '')}
                    placeholder="Enter phone number"
                    className={`!h-12 !w-full !border-none !px-4 !py-2 ${errors.phone ? '!bg-red-50' : '!bg-white'
                      }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Message */}
              <div>
                <textarea
                  id="message"
                  rows={8}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Message"
                  className={`w-full px-4 py-2 bg-white border ${errors.message ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`Lato ${loading ? '' : 'beveled-corner4'} w-full flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium text-white ${loading ? 'bg-[#191E42]' : 'bg-brand-500 hover:bg-[#182166]'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition-colors duration-200`}
              >
                {loading ? 'Sending...' : 'Send Message'}
                <FaBolt className="ml-2 text-white" />
              </button>
            </form>
          </div>

          {/* Contact Info - Right side at 1280px */}
          <div className="w-full lg:w-full xlmid:w-1/2 p-4 sm:p-6 md:p-8 -mt-4 sm:-mt-6 xlmid:mt-0 ml-auto order-2 lg:order-2 xlmid:order-2">
            <h2 className="Lato text-2xl sm:text-3xl text-gray-800 mb-4 sm:mb-6">
              Build Smarter Systems With AIXX
            </h2>
            <p className="Lato text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              AIXX helps organizations design and deploy intelligent solutions across AI, quantum, autonomy, and cyber resilience so teams can make better decisions faster.
            </p>
            <div className="space-y-4 sm:space-y-6">
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
            </div>

          </div>

        </div>
      </div>
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