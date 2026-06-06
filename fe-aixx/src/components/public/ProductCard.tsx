import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  name: string;
  description: string;
  imagePath?: string;
  slug: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ name, description, imagePath, slug }) => {
  const imageUrl = imagePath ? `/storage/${imagePath.replace('public/', '')}` : '/images/placeholders/product.png';
  return (
    <div className="group relative rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-gray-200/30 p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
      <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-md">
        <Image src={imageUrl} alt={name} width={400} height={225} className="object-cover transition-opacity group-hover:opacity-90" />
      </div>
      <h3 className="text-xl font-semibold text-blue-100 mb-2 group-hover:text-white transition-colors">{name}</h3>
      <p className="text-sm text-gray-200 line-clamp-3 group-hover:text-gray-100 transition-colors">{description}</p>
      <Link href={`/products/${slug}`}>
        <a className="mt-4 inline-block text-sm font-medium text-blue-300 hover:text-white transition-colors">
          Learn More &rarr;
        </a>
      </Link>
    </div>
  );
};
