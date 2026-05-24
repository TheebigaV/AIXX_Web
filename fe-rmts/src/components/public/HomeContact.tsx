import React from "react";
import Image from "next/image";
import { FaBolt } from "react-icons/fa";
import Link from "next/link";

const HomeContact = () => {
  return (
    <div className="w-full container mx-auto px-[16px] sm:px-[16px] md:px-[24px] lg:py-[50px] lg:px-[28px] xl:py-[60px] xl:px-[75px] 2xl:py-[60px] 2xl:px-[240px] py-[100px] min-[600px]:py-[4px] max-[599px]:py-[20px] bg-white">
      <div className="">
        <div className="flex flex-col xlmid:flex-row xlmid:items-end items-center gap-0 xlmid:gap-0">
          {/* Image - Shows first on mobile/tablet (below 1280px) */}
          <div className="w-full xlmid:w-auto flex justify-center xlmid:justify-start xlmid:flex-shrink-0 order-1 xlmid:order-1">
            <div 
              className="polygon-corner-bg2 relative w-full xlmid:w-[520px] h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xlmid:h-[346px] 2xl:w-[520px] 2xl:h-[346px]"
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
            className="w-full xlmid:w-[920px] h-auto xlmid:h-[285px] xlmid:ml-0 2xl:w-[920px] 2xl:h-[285px] 2xl:ml-0 space-y-4 xlmid:space-y-6 bg-[#FAFAFA] p-6 md:p-8 xlmid:py-10 xlmid:px-12 2xl:py-10 2xl:px-12 order-2 xlmid:order-2"
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
              className="beveled-corner inline-flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 transition-all duration-300 w-full md:inline-flex md:w-auto"
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