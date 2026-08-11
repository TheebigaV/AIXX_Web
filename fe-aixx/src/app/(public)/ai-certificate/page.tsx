"use client";

import React from 'react';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';

const CertificatePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <CertificatePortalForm />
    </div>
  );
};

export default CertificatePage;
