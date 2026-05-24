'use client';

import { useEffect, useState } from 'react';
import { FaBolt } from 'react-icons/fa';
import { useInquiryForm } from "@/hooks/public/useInquiryForm";
import { toast } from "react-toastify";

interface Props {
  visible: boolean;
  onClose: () => void;
  productTitle: string;
  productId: number;
}

export default function EnquiryFormModal({ visible, onClose, productTitle, productId }: Props) {

  const {
    formData,
    errors,
    serverError,
    loading,
    handleChange,
    handleSubmit,
  } = useInquiryForm(() => {
    toast.success("Your inquiry has been sent!");
    
    // ✅ Clear form fields after successful submission
    handleChange("customer_name", "");
    handleChange("customer_phone", "");
    handleChange("customer_email", "");
    handleChange("message", "");
  });

  useEffect(() => {
    formData.product_id = productId;
  }, [productId]);

  useEffect(() => {
    if (visible) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white shadow-xl max-w-2xl w-full relative px-8 py-6 mx-4 border border-gray-200 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-[#192A44] text-white w-8 h-8 flex items-center justify-center text-2xl hover:bg-[#2a3a54] transition-colors z-10"
            aria-label="Close enquiry form"
          >
            ×
          </button>

          {serverError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-400 text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-sm text-[#191E42] mb-1 tracking-wider">Enquiry Form</h4>
            <h2 className="text-2xl font-semibold text-brand-600">{productTitle}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="customer_name"
                placeholder="Name"
                value={formData.customer_name}
                onChange={(e) => handleChange("customer_name", e.target.value)}
                className={`w-full px-4 py-3 border ${errors.customer_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                disabled={loading}
              />
              {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
            </div>

            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone No"
                value={formData.customer_phone}
                onChange={(e) => handleChange("customer_phone", e.target.value)}
                className={`w-full px-4 py-3 border ${errors.customer_phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                disabled={loading}
              />
              {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
            </div>

            <div>
              <input
                type="email"
                name="customer_email"
                placeholder="Email"
                value={formData.customer_email}
                onChange={(e) => handleChange("customer_email", e.target.value)}
                className={`w-full px-4 py-3 border ${errors.customer_email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                disabled={loading}
              />
              {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} h-32 resize-none focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                disabled={loading}
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`
                bg-brand-600 text-white w-full py-3 font-medium text-lg flex items-center justify-center gap-2
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#E55C1B]'}
                transition-all duration-300
              `}
              style={{
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
              }}
            >
              {loading ? 'Sending...' : (
                <>
                  Send Message <FaBolt className="text-[#fff]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
