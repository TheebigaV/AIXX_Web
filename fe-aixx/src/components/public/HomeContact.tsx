import React from "react";
import Image from "next/image";
import { FaBolt } from "react-icons/fa";
import Link from "next/link";

const HomeContact = () => {
  return (
    <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 lg:py-20 bg-white">
      <div className="">
        <div className="flex flex-col xlmid:flex-row xlmid:items-end items-center gap-0 xlmid:gap-0">
          {/* Image - Shows first on mobile/tablet (below 1280px) */}
          <div className="w-full xlmid:w-auto flex justify-center xlmid:justify-start xlmid:flex-shrink-0 order-1 xlmid:order-1">
            <div 
            className="polygon-corner-bg2 relative w-full lg:w-[45%] h-[200px] sm:h-[260px] md:h-[300px] lg:h-[360px] xl:h-[400px] flex-shrink-0"
            >
              <Image
                src="/images/aboutus/tech_grid.png"
                alt="AIXX Technology Integration"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>

          {/* Content - Shows second on mobile/tablet (below 1280px) */}
          <div
            className="w-full lg:flex-1 space-y-4 lg:space-y-6 bg-[#FAFAFA] p-6 md:p-8 lg:py-10 lg:px-12"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 xlmid:text-4xl 2xl:text-4xl">
              Let&apos;s Scale the Future!
            </h2>
            <p className="text-base sm:text-lg text-gray-600 xlmid:text-lg 2xl:text-lg">
              Ready to integrate next-generation intelligence into your operations? Our team is here to design and deploy the AI, Quantum, and autonomous systems that will drive your shared future.
            </p>
            <div>
              <Link
              href="/contact"
              className="beveled-corner inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 transition-all duration-300 w-full sm:w-auto font-medium"
              aria-label="Contact Us"
            >
                Contact Us{" "}
                <FaBolt className="ml-2 text-white group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContact;