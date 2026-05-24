'use client';

import React from 'react';

const TermsAndConditionsPage = () => {
  return (
    <div className="w-full mx-auto px-[16px] sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] py-10 text-[#0B1138]">
      <div  className='container mx-auto'>
      <h1 className="px-[16px] sm:text-[24px] md:text-[40px] lg:text-[44px] font-bold text-brand-500 sm:mb-[16px] md:mb-[36px] lg:text-left">
        TERMS AND CONDITIONS
      </h1>

      <Section title="Service Scope">
        <p>
          Our services include inspection, maintenance, and minor repair work as described in the selected package.
          Major repairs or replacements may require separate quotations and timelines.
          Any services outside the agreed scope must be confirmed in writing before execution.
        </p>
      </Section>

      <Section title="Booking and Scheduling">
        <p>
          Appointments must be booked at least 24 hours in advance. Changes or cancellations should be informed at least 12 hours prior to the scheduled time.
          Repeated rescheduling or no-shows may result in additional charges or future service restrictions.
        </p>
      </Section>

      <Section title="Payment Terms">
        <p>
          Payments must be made in full upon completion of the service unless otherwise agreed in writing.
          We accept cash, bank transfers, and online payment methods.
          Late payments may be subject to penalties or interest as per our invoicing terms.
        </p>
      </Section>

      <Section title="Inspection Reports">
        <p>
          All reports provided are based on visual inspections and standard testing. We are not liable for hidden defects or damages that were not visible or accessible at the time of inspection.
          Invasive or destructive testing is not included unless explicitly stated.
        </p>
      </Section>

      <Section title="Warranty and Liability">
        <p>
          We offer limited warranties on specific maintenance tasks, which will be outlined in the final service report.
          Warranty does not apply to damages caused by misuse, neglect, unauthorized repairs, or external factors (weather, rodents, etc.).
        </p>
      </Section>

      <Section title="Client Responsibilities">
        <p>
          Clients must ensure access to the property at the scheduled time and keep pets, children, or valuable items secured during service hours.
          Clients are responsible for disclosing any known safety hazards (e.g., unstable structures, exposed wiring).
        </p>
      </Section>

      <Section title="Force Majeure">
        <p>
          We are not liable for delays or cancellations due to events beyond our control, such as extreme weather,
          natural disasters, pandemics, strikes, or transportation disruptions.
        </p>
      </Section>

      <Section title="Safety Compliance">
        <p>
          Our team follows all necessary safety protocols and uses appropriate protective equipment.
          Clients are requested to avoid restricted work areas and cooperate in maintaining a safe work environment.
        </p>
      </Section>

      <Section title="Data Privacy">
        <p>
          Any personal or property information shared during the service will be kept confidential and used only for service-related purposes.
          Photos or data collected for documentation will not be shared publicly without client consent.
        </p>
      </Section>

      <Section title="Amendments">
        <p>
          We reserve the right to update or change these terms without prior notice.
          Clients will be informed of any significant changes in advance.
          It is the client’s responsibility to review the latest version before service confirmation.
        </p>
      </Section>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

// ✅ Section Component
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-[18px] sm:text-[18px] md:text-[20px] 
      font-medium text-[#0B1138] mb-[8px]">
      {title}
    </h2>
    <div className="text-[14px] sm:text-[14px] md:text-[16px] text-gray-800 leading-relaxed text-justify sm:mb-[20px] md:mb-[32px]">
      {children}
    </div>
  </div>
);
