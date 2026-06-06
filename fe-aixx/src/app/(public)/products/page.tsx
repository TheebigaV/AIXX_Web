"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMicrochip, FaTachometerAlt, FaProjectDiagram, FaRocket, FaCogs, FaNetworkWired } from "react-icons/fa";
import ProductsList from "@/components/public/Products";

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition p-6 flex flex-col gap-4">
      <div className="text-4xl text-brand-600">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{children}</p>
      <div className="mt-auto">
        <Link href="/contact" className="text-brand-600 hover:underline font-medium">Book a Consultation →</Link>
      </div>
    </div>
  );
};

export default function InnovativeProductsPage() {
  return (
    <main className="bg-white py-16">
      <section className="relative w-full h-[400px] mb-6">
        <Image src="/images/training_banner.png" alt="Products Banner" fill style={{ objectFit: "cover" }} className="rounded-md" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 text-white">
          <h1 className="text-4xl font-bold">Our AI‑Powered Products</h1>
          <p className="text-lg mt-2">Innovative solutions for a smarter future</p>
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-[240px]">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#00245A] mb-4">Innovative AI Infrastructure for a Smarter Future</h1>
            <p className="text-lg text-gray-700 mb-6">Empowering organizations with AI-ready hardware, intelligent integration, and future-focused technology solutions. We don’t just sell hardware — we integrate, optimize, and upgrade systems to run AI workloads reliably at scale.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="beveled-corner bg-brand-500 text-white px-5 py-3">Book a Consultation</Link>
              <Link href="/product" className="border border-gray-300 px-5 py-3 text-gray-700 rounded">Explore AI Solutions</Link>
            </div>
          </div>
          <div className="relative h-64 md:h-80 lg:h-96">
            <Image src="/images/illustrations/ai-hardware.png" alt="AI Hardware Illustration" fill className="object-contain" sizes="(max-width: 768px) 320px, 600px" />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#00245A] mb-6">Featured Solutions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<FaMicrochip />} title="AI-Optimized Computing Systems">
              High-performance AI workstations, edge AI devices, and custom hardware configurations designed to accelerate ML workflows and inference.
            </FeatureCard>
            <FeatureCard icon={<FaTachometerAlt />} title="Hardware Performance Enhancement">
              RAM upgrades, high-speed storage, GPU acceleration and system tuning to reduce training and inference time.
            </FeatureCard>
            <FeatureCard icon={<FaProjectDiagram />} title="AI Hardware Integration">
              Seamless integration of AI software with existing hardware, edge deployments, IoT and enterprise infrastructure.
            </FeatureCard>
            <FeatureCard icon={<FaCogs />} title="System Integration Services">
              Turnkey installation, automation hardware deployment and on-site integration for mission-critical systems.
            </FeatureCard>
            <FeatureCard icon={<FaNetworkWired />} title="Enterprise AI Infrastructure">
              Scalable architecture, orchestration and operational support for production AI systems and data pipelines.
            </FeatureCard>
            <FeatureCard icon={<FaRocket />} title="Next-Generation Technologies">
              Quantum readiness consultation, advanced processing architectures and future-focused computing strategy.
            </FeatureCard>
          </div>
        </section>

        <section className="bg-gradient-to-r from-white to-slate-50 border border-gray-200 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-[#00245A]">Ready to upgrade your infrastructure?</h3>
            <p className="text-gray-600">Schedule a technical consultation and discover a tailored roadmap for adopting AI hardware and integrations.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/contact" className="beveled-corner bg-brand-500 text-white px-5 py-3">Book a Consultation</Link>
            <Link href="/contact" className="px-5 py-3 border border-gray-300 rounded text-gray-700">Request a Proposal</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
