'use client';

import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="w-full mx-auto px-[16px] sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] py-10 text-[#0B1138] text-justify">
      <div  className='container mx-auto'>
      <h1 className="sm:text-[32px] md:text-[44px] font-bold text-primary mb-[8px]">
        PRIVACY & POLICY
      </h1>

      <p className="text-[14px] sm:text-[14px] md:text-[18px] text-brand-500 mb-[20px]">
        Last Update by : <span className="text-brand-500 font-medium">July 03<sup>rd</sup>, 2025</span>
      </p>

      <p className="mb-[20px] sm:mb-[20px] md:mb-[48px] text-gray-800 leading-relaxed sm:text-[14px] md:text-[18px] italic">
        Welcome to AIXX’s Privacy Policy. We value your trust and are committed to protecting your personal information. This page explains how we collect, use, and protect your data.
      </p>

      <Section title="Information We Collect">
        <ul className="list-disc list-inside space-y-1 sm:text-[14px] md:text-[16px]">
          <li>Name, email address, phone number (via contact forms)</li>
          <li>Address or location details (for service requests)</li>
          <li>Payment details (if you accept payments online)</li>
          <li>Browsing data (cookies, analytics)</li>
        </ul>
      </Section>

      <Section title="How We Use Your Information">
        <p className="text-[14px] sm:text-[14px] md:text-[16px]">
          We use the information you provide to respond to your service requests, schedule appointments, and deliver our electrical and electronic services safely and efficiently. Your contact details help us communicate important updates, while payment information is used solely for secure transactions. We may also use website usage data to improve our site’s performance and make your browsing experience better.
        </p>
      </Section>

      <Section title="Cookies">
        <p className="text-[14px] sm:text-[14px] md:text-[16px]">
          Our website may use cookies to enhance your experience. Cookies are small text files stored on your device to remember your preferences. You can disable cookies in your browser settings, but some features of our website may not function properly if you do.
        </p>
      </Section>

      <Section title="Sharing Your Information">
        <p className="text-[14px] sm:text-[14px] md:text-[16px]">
          We do not sell or rent your personal information to third parties. We may share it only when:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2 sm:text-[14px] md:text-[16px]">
          <li>Required to fulfill services (e.g., third-party technicians, payment gateways)</li>
          <li>Required by law or legal process</li>
          <li>Necessary to protect the safety, rights, or property of our team or clients</li>
        </ul>
      </Section>

      <Section title="Security">
        <p className="text-[14px] sm:text-[14px] md:text-[16px]">
          We implement industry-standard security practices to protect your personal data. While we strive to use commercially acceptable means to safeguard your information, we cannot guarantee 100% security due to the nature of digital data transmission.
        </p>
      </Section>

      <Section title="Your Rights">
        <p className="text-[14px] sm:text-[14px] md:text-[16px]">As a user, you have the right to:</p>
        <ul className="list-disc list-inside space-y-1 mt-2 sm:text-[14px] md:text-[16px]">
          <li>Access and review the personal information we store</li>
          <li>Request corrections or updates to your information</li>
          <li>Request deletion of your data, where applicable</li>
          <li>Object to or limit how your data is used</li>
          <li>Request a copy of your stored information (data portability)</li>
        </ul>
      </Section>

      <Section title="Changes to This Privacy Policy">
        <p className="text-[14px] sm:text-[14px] md:text-[16px]">
          We may revise this Privacy Policy occasionally. Updates will be posted on our website, and changes are effective immediately upon posting. Continued use of our services implies acceptance of the revised terms.
        </p>
      </Section>

      <Section title="Contact Information">
        <p className="text-[14px] sm:text-[14px] md:text-[16px]">
          If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:contact@aixx.ai" className="text-blue-600 hover:underline">contact@aixx.ai</a> or call <strong>021 223 2826</strong>.
        </p>
      </Section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-[38px]">
    <h2 className="text-[14px] sm:text-[16px] md:text-[24px] font-semibold sm:mb-[8px] md:mb-[12px] text-[#0B1138]">
      {title}
    </h2>
    <div className="text-gray-800 leading-relaxed">{children}</div>
  </div>
);

