// src/app/(public)/innovative-products/page.tsx
import React from 'react';
import { ProductCard } from '@/components/public/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts } from '@/lib/public/products';



export default function InnovativeProductsPage() {
  // Load products from the selected category (admin should assign products to the "innovative-products" category)
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchProducts(1, 12, 'innovative-products');
        if (!mounted) return;
        setProducts(res.data.data || []);
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
    <main className="bg-gray-900 text-white min-h-screen py-12">
      {/* Hero */}
      <section className="container mx-auto px-4 text-center mb-16">
        <div className="mb-8 flex justify-center">
          <Image
              src="/images/innovative_products_banner.png"
              alt="Innovative Products Banner"
              width={1200}
              height={400}
              className="object-cover rounded-md"
            />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-200 mb-4">
          Innovative AI Infrastructure for a Smarter Future
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Empowering organizations with AI‑ready hardware, intelligent integration, and future‑focused technology solutions.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium transition">
              Book a Consultation
          </Link>
        </div>
      </section>

      {/* Key Message */}
      <section className="container mx-auto px-4 mb-12">
        <p className="text-center text-xl text-gray-200 max-w-4xl mx-auto">
          AIXX does not simply sell hardware. We provide end‑to‑end AI solutions by integrating, upgrading, and optimizing hardware platforms to support AI workloads, machine learning applications, automation systems, and future‑ready digital transformation initiatives.
        </p>
      </section>



      {/* Product Cards */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center text-blue-200 mb-8">Our AI‑Hardware Solutions</h2>
        {isLoading && <p className="text-center">Loading products…</p>}
        {isError && <p className="text-center text-red-400">Failed to load products.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products &&
            products.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                description={p.description}
                imagePath={p.image_path}
                slug={p.slug}
              />
            ))}
        </div>
      </section>
    </main>
  );
}
