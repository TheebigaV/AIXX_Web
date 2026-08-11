'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProduct, fetchProducts } from '@/lib/public/products';
import { ProductCard } from '@/components/public/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  is_active: boolean;
  main_product_image: string | null;
  sub_product_images: Array<{ id: string; url: string | null }>;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000';

const resolveImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/images/')) return imageUrl;
  if (imageUrl.startsWith('/storage')) return `${API_BASE_URL}${imageUrl}`;
  return `${API_BASE_URL}/storage/${imageUrl}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const res = await getProduct(slug);
        const allRes = await fetchProducts(1, 100, '');
        if (!mounted) return;

        const fallbackImages = [
          '/images/ai_edge_device.png',
          '/images/smart_ai_hub.png',
          '/images/neural_chip.png',
          '/images/ai_drone.png',
          '/images/smart_glasses.png',
          '/images/ai_server_rack.png'
        ];

        if (res.data) {
          let currentProduct = res.data;
          
          const excludeNames = [
            'AI Hardware Integration',
            'AI Computing Systems',
            'Hardware Optimization',
            'Edge AI Solutions',
            'Emerging Technologies'
          ];

          const allProductsData = allRes?.data?.data ?? allRes?.data ?? [];
          const allActive = (Array.isArray(allProductsData) ? allProductsData : [])
            .filter((p: any) => (p.is_active === 1 || p.is_active === true || p.is_active === '1') && !excludeNames.includes(p.name));

          if (!currentProduct.main_product_image || currentProduct.main_product_image === '') {
            const index = allActive.findIndex((p: any) => p.id === currentProduct.id);
            const useIndex = index !== -1 ? index : 0;
            currentProduct.main_product_image = fallbackImages[useIndex % fallbackImages.length];
          }

          setProduct(currentProduct);
          setSelectedImage(currentProduct.main_product_image);

          const activeOthers = allActive
            .filter((p: any) => p.slug !== slug)
            .map((p: any) => {
              if (!p.main_product_image || p.main_product_image === '') {
                const idx = allActive.findIndex((ap: any) => ap.id === p.id);
                return { ...p, main_product_image: fallbackImages[(idx !== -1 ? idx : 0) % fallbackImages.length] };
              }
              return p;
            })
            .slice(0, 3);
            
          setRelatedProducts(activeOthers);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        if (mounted) {
          setError('Failed to load product');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <main className="bg-white text-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          <p className="text-center">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-white text-black min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const mainImageUrl = resolveImageUrl(selectedImage);
  const subImages = product.sub_product_images
    ?.map(img => ({ ...img, resolved: resolveImageUrl(img.url) }))
    .filter(img => img.resolved) || [];

  return (
    <main className="bg-white text-black min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/innovative-products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => {
                    console.error('Failed to load main image:', mainImageUrl);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Sub Images Thumbnails */}
            {subImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto">
                {/* Main image thumbnail */}
                <button
                  onClick={() => setSelectedImage(product.main_product_image)}
                  className={`relative w-20 h-20 rounded border-2 flex-shrink-0 overflow-hidden ${
                    selectedImage === product.main_product_image ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  {mainImageUrl && (
                    <Image
                      src={mainImageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>

                {/* Sub images thumbnails */}
                {subImages.map(img => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-20 h-20 rounded border-2 flex-shrink-0 overflow-hidden ${
                      selectedImage === img.url ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img.resolved!}
                      alt="Product variant"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            <div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{product.name}</h1>
            </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <div
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || 'No description available' }}
              />
            </div>

            {/* CTA Buttons Removed */}

            {/* Meta Information Removed */}
          </div>
        </div>
        {/* More Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  description={p.description}
                  mainProductImage={p.main_product_image}
                  slug={p.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
