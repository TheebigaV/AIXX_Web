"use client";

import React from 'react';
import { CertificatePortalForm } from '@/components/public/CertificatePortalForm';

const CertificatePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <CertificatePortalForm />
    </div>
  );
};

export default CertificatePage;
