'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  name: string;
  description: string;
  mainProductImage?: string | { url?: string | null } | null;
  slug: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000';

const resolveImageUrl = (
  mainProductImage?: ProductCardProps['mainProductImage']
) => {
  // Handle different input formats
  if (!mainProductImage) return null;
  
  const rawImage = typeof mainProductImage === 'string' ? mainProductImage : mainProductImage?.url;
  
  if (!rawImage) return null;
  if (rawImage.startsWith('http')) return rawImage;
  
  // If path already starts with /storage, prepend API base URL
  if (rawImage.startsWith('/storage')) {
    return `${API_BASE_URL}${rawImage}`;
  }
  
  // For other paths, assume storage path
  return `${API_BASE_URL}/storage/${rawImage}`;
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '').trim();

export const ProductCard: React.FC<ProductCardProps> = ({ name, description, mainProductImage, slug }) => {
  const imageUrl = resolveImageUrl(mainProductImage);
  const [showImage, setShowImage] = useState(Boolean(imageUrl));

  return (
    <div className="group relative rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-gray-200/30 p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
      <div className="relative mb-4 flex h-56 overflow-hidden rounded-md bg-gray-100">
        {imageUrl && showImage ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-opacity group-hover:opacity-90"
            onError={() => setShowImage(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500">
            No image
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-blue-900 mb-2 group-hover:text-black transition-colors">{stripHtml(name)}</h3>
      <p className="text-sm text-gray-800 line-clamp-3 group-hover:text-gray-900 transition-colors">{stripHtml(description)}</p>
      <Link href={`/products/${slug}`} className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-black transition-colors">
        Learn More &rarr;
      </Link>
    </div>
  );
};
