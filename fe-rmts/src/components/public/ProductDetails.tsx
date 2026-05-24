'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaBolt, FaWhatsapp, FaTag } from 'react-icons/fa';
import BreadcrumbDynamic from '@/components/public/BreadcrumbDynamic';
import EnquiryFormModal from '@/components/public/EnquiryFormModal';
import useProducts from '@/hooks/public/useProducts';
import RenderRelatedProducts from '@/components/public/RenderRelatedProducts';
import { IoLogoWhatsapp } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";

export default function ProductDetailsPage() {
  const { slug: productSlug } = useParams();
  const [visibleProductsCount, setVisibleProductsCount] = useState(4);
  const [layoutConfig, setLayoutConfig] = useState({
    gridColumns: 'grid-cols-4',
    imageHeight: 250,
    imageWidth: 250,
  });
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTabletView, setIsTabletView] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [is1920View, setIs1920View] = useState(false);

  const { selectedProduct, getProduct } = useProducts();

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      let count = 4;
      let columns = 'grid-cols-4';

      setIsMobileView(width < 768);
      setIsTabletView(width >= 768 && width < 1024);
      setIs1920View(width >= 1920);

      if (width >= 1920) {
        count = 5;
        columns = 'grid-cols-5';
      } else if (width >= 1400) {
        count = 4;
        columns = 'grid-cols-4';
      } else if (width >= 768) {
        count = 3;
        columns = 'grid-cols-3';
      } else if (width >= 360) {
        count = 2;
        columns = 'grid-cols-2';
      } else {
        count = 2;
        columns = 'grid-cols-2';
      }

      setVisibleProductsCount(count);
      setLayoutConfig({
        gridColumns: columns,
        imageHeight: width >= 1920 ? 280 : 250,
        imageWidth: width >= 1920 ? 280 : 250,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedProduct]);

  const handleCallNow = () => {
    window.location.href = 'tel:+1234567890';
  };

  const handleWhatsApp = () => {
    const message = `I'm interested in ${selectedProduct?.name} (Product ID: ${selectedProduct?.id})`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/1234567890?text=${encodedMessage}`, '_blank');
  };

  useEffect(() => {
    const loadProduct = async () => {
      await getProduct(productSlug);
    };
    loadProduct();
  }, [productSlug, getProduct]);

  const renderSpecifications = () => {
    if (!selectedProduct?.specifications || selectedProduct.specifications.length === 0) return null;
    return (
      <div>
        <h2 className="text-lg md:text-xl font-medium mb-3 text-[#191E42]">Specifications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedProduct.specifications.map((spec: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {spec.name || spec.key}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden overflow-y-auto"> {/* ✅ Ensures scrollbars appear only when needed */}
      {selectedProduct ? (
      <div className="container mx-auto sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px]">
                  <div className="max-w-7xl mx-auto min-[1920px]:max-w-full">

            <BreadcrumbDynamic
              type="product"
              productCategoryName={selectedProduct.category.name}
              slug={selectedProduct.category.slug}
              productTitle={selectedProduct.name}
              className="mb-4"
            />

            {/* Desktop Layout (1024px and above) */}
            <div className="hidden min-[1024px]:flex flex-row gap-6">
              <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-hidden"> {/* ✅ Prevents unwanted scroll */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#F9F9F9] flex items-center justify-center border border-gray-200">
                  <Image
                    src={selectedProduct.main_product_image.url}
                    alt={selectedProduct.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4"
                    priority
                  />
                </div>
                {selectedProduct.sub_product_images.length > 0 && (
                  <div className="grid gap-2 grid-cols-3">
                    {selectedProduct.sub_product_images.map((sub, index) => (
                      <div key={index} className="relative aspect-square bg-gray-50 overflow-hidden border border-gray-200">
                        <Image
                          src={sub.url}
                          alt={`${selectedProduct.name}`}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 33vw, 15vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className={`flex flex-row gap-4 mt-4 ${is1920View ? 'min-[1920px]:gap-2' : ''}`}>
                  <button
                    onClick={() => setShowEnquiryForm(true)}
                    className={`beveled-corner hover:bg-brand-700 text-white flex items-center justify-center py-3 px-6 text-base font-medium ${is1920View ? 'min-[1920px]:flex-[1.5]' : 'flex-1'}`}
                  >
                    Make an Enquiry
                    <FaBolt className="ml-2 text-white" />
                  </button>

                  <button
                    onClick={handleCallNow}
                    className={`folded-border flex items-center justify-center group ${is1920View ? 'min-[1920px]:flex-1' : 'flex-1'}`}
                  >
                    <span className="mr-2">Call now</span>
                    <FaPhone />
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className={`folded-border flex items-center justify-center group ${is1920View ? 'min-[1920px]:flex-1' : 'flex-1'}`}
                  >
                    <span className="mr-2">WhatsApp</span>
                    <IoLogoWhatsapp className="text-[#25D366] text-[24px]" />
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-4">
                {selectedProduct.category && (
                  <div
                    className="relative inline-flex items-center gap-2 px-4 py-2 bg-[#FFECE2]"
                    style={{
                      clipPath: 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 16px, 100% 100%, 0% 100%)'
                    }}
                  >
                    <FaTag className="text-brand-600" />
                    <span className="text-brand-600 font-medium text-[18px] tracking-wider">
                      {selectedProduct.category.name}
                    </span>
                  </div>
                )}
                <h1 className="text-[32px] md:text-3xl font-semibold text-[#191E42] mt-4">{selectedProduct.name}</h1>
                {selectedProduct.description && (
                  <div
                    className="prose text-base md:text-lg text-black leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                  />
                )}
              </div>
            </div>

            {/* Tablet and Mobile Layout (below 1024px) */}
            <div className="min-[1024px]:hidden flex flex-col gap-6 overflow-hidden"> {/* ✅ Prevents scrollbar flicker */}
              {(isMobileView || isTabletView) && (
                <div className="flex flex-col gap-2">
                  <h1 className="text-[28px] font-semibold text-[#191E42]">{selectedProduct.name}</h1>
                  {selectedProduct.category && (
                    <div
                      className="inline-flex items-center gap-2 px-2 py-1 bg-[#FFECE2] max-w-max"
                      style={{
                        clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 0% 100%)'
                      }}
                    >
                      <FaTag className="text-brand-600 text-xs" />
                      <span className="text-brand-600 font-medium text-xs tracking-wider">
                        {selectedProduct.category.name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="relative aspect-video w-full overflow-hidden bg-[#F9F9F9] flex items-center justify-center border border-gray-200">
                <Image
                  src={selectedProduct.main_product_image.url}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className="object-contain p-4"
                  priority
                />
              </div>

              {selectedProduct.sub_product_images.length > 0 && (
                <div className="grid gap-2 grid-cols-3">
                  {selectedProduct.sub_product_images.map((sub, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-50 overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={sub.url}
                        alt={`${selectedProduct.name}`}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 33vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              )}

              {isMobileView ? (
                <div className="flex flex-row gap-3">
                  <button
                    onClick={() => setShowEnquiryForm(true)}
                    className="beveled-corner hover:bg-brand-700 text-white flex items-center justify-center py-3 px-4 text-sm flex-[2] font-medium"
                  >
                    Make an Enquiry
                    <FaBolt className="ml-2 text-white" />
                  </button>

                  <div className="flex gap-4 flex-1">
                    <button
                      onClick={handleCallNow}
                      className="relative overflow-hidden square-corner border border-brand-600 p-2 aspect-square h-[50px] w-[46px] flex items-center justify-center group flex-1"
                    >
                      <FaPhone className="text-brand-600" />
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="relative overflow-hidden square-corner border border-brand-600 p-2 aspect-square h-[50px] w-[46px] flex items-center justify-center group flex-1"
                    >
                      <IoLogoWhatsapp className="text-[#25D366] text-[24px]" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-4">
                  <button
                    onClick={() => setShowEnquiryForm(true)}
                    className="beveled-corner hover:bg-brand-700 text-white flex items-center justify-center py-3 px-6 text-base flex-1 font-medium"
                  >
                    Make an Enquiry
                    <FaBolt className="ml-2 text-white" />
                  </button>

                  <button
                    onClick={handleCallNow}
                    className="folded-border flex-1 flex items-center justify-center group"
                  >
                    <span className="mr-2">Call now</span>
                    <FaPhone className="text-brand-600" />
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="folded-border flex-1 flex items-center justify-center group"
                  >
                    <span className="mr-2">WhatsApp</span>
                    <IoLogoWhatsapp className="text-[#25D366] text-[24px]" />
                  </button>
                </div>
              )}

              {selectedProduct.description && (
                <div
                  className="prose text-base md:text-lg text-black leading-relaxed mt-4"
                  dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                />
              )}
            </div>

            <EnquiryFormModal
              visible={showEnquiryForm}
              onClose={() => setShowEnquiryForm(false)}
              productTitle={selectedProduct.name}
              productId={selectedProduct.id}
            />

            <div className="mt-12">
              <RenderRelatedProducts
                baseSlug={`/product/${selectedProduct?.category?.slug}`}
                categoryId={selectedProduct?.category?.id}
                currentProductId={selectedProduct?.id}
                visibleProductsCount={visibleProductsCount}
                layoutConfig={layoutConfig}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-80">No products</div>
      )}
    </div>
  );
}
