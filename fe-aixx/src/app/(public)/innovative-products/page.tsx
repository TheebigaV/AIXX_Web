'use client';
// src/app/(public)/innovative-products/page.tsx
import { ProductCard } from '@/components/public/ProductCard';
import Link from 'next/link';
import Banner from '@/components/public/Banner';
import { useState, useEffect } from 'react';
import { fetchProducts } from '@/lib/public/products';



export default function InnovativeProductsPage() {
  // Load products from the selected category (admin should assign products to the "innovative-products" category)
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchProducts(1, 12, '');
        if (!mounted) return;
        const productsData = res?.data?.data ?? res?.data ?? [];
        const excludeNames = [
          'AI Hardware Integration',
          'AI Computing Systems',
          'Hardware Optimization',
          'Edge AI Solutions',
          'Emerging Technologies'
        ];

        const activeProducts = (Array.isArray(productsData) ? productsData : []).filter(
            (p: any) => (p.is_active === 1 || p.is_active === true || p.is_active === '1') && !excludeNames.includes(p.name)
        );
        const fallbackImages = [
          '/images/ai_edge_device.png',
          '/images/smart_ai_hub.png',
          '/images/neural_chip.png',
          '/images/ai_drone.png',
          '/images/smart_glasses.png',
          '/images/ai_server_rack.png'
        ];

        const productsWithImages = activeProducts.map((p: any, i: number) => {
          if (!p.main_product_image || p.main_product_image === '') {
            return { ...p, main_product_image: fallbackImages[i % fallbackImages.length] };
          }
          return p;
        });

        setProducts(productsWithImages);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setIsError(true);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="bg-white text-black min-h-screen">
      <Banner
        altText="Innovative Products Banner"
        paths={[{ name: 'Home', href: '/' }, { name: 'Innovative Products' }]}
        title="Innovative Products"
        subtitle="Cutting‑edge AI hardware and solutions for a smarter future."
        bgImage="/images/innovative_products_banner.png"
      />

      {/* Product Cards */}
      <section className="w-full px-4 mb-16 bg-white pt-8 md:pt-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-black mb-8">Our AI‑Hardware Solutions</h2>
          {isLoading && <p className="text-center">Loading products…</p>}
          {isError && (
            <p className="text-center text-red-400">Failed to load products.</p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products &&
              products.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  description={p.description}
                  mainProductImage={p.main_product_image}
                  slug={p.slug}
                />
              ))}
          </div>
          {products.length === 0 && !isLoading && !isError && (<p className="text-center text-gray-500">No products found.</p>)}
        </div>
      </section>
    </main>
  );
}
