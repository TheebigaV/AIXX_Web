'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { api } from '@/lib/api';

interface VerifiedCertificate {
  certificate_token: string;
  holder_name: string | null;
  registration_id: string | null;
  course: string | null;
  score: number | null;
  issued_at: string | null;
}

const formatDate = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function CertificateVerifyPage() {
  const params = useParams();
  const token = params?.token as string;
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
        const response = await api.get(`api/certificate/verify/${encodeURIComponent(token)}`);
        if (isMounted && response.data?.valid) {
          setCertificate(response.data.data);
        }
      } catch {
        // 404 = not found / revoked; the invalid state below covers it.
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex flex-col items-center justify-center py-20">
        <FaSpinner className="animate-spin text-brand-600 mb-4" size={40} />
        <p className="text-slate-600 font-bold">Verifying certificate...</p>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
          <FaTimesCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Certificate not valid</h1>
          <p className="text-slate-600 mb-6">
            We couldn&apos;t find a valid AIXX certificate for this link. It may have been revoked or the link may be incorrect.
          </p>
          <Link href="/" className="inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700">
            Go to AIXX
          </Link>
        </div>
      </div>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: 'Certificate holder', value: certificate.holder_name || '—' },
    { label: 'Registration ID', value: certificate.registration_id || '—' },
    { label: 'Course', value: certificate.course || '—' },
    { label: 'Score', value: certificate.score !== null ? `${certificate.score}%` : '—' },
    { label: 'Issued on', value: formatDate(certificate.issued_at) },
  ];

  return (
    <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="text-center mb-6">
          <FaCheckCircle className="mx-auto mb-4 text-green-600" size={48} />
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Verified certificate</h1>
          <p className="text-slate-600">This certificate was issued by AIXX and is valid.</p>
        </div>

        <dl className="divide-y divide-slate-100 border-y border-slate-100">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-4">
              <dt className="text-sm text-slate-500">{row.label}</dt>
              <dd className="font-semibold text-slate-900 sm:text-right break-words">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-center text-xs text-slate-400 break-all">
          Certificate ID: {certificate.certificate_token}
        </p>
      </div>
    </div>
  );
}
