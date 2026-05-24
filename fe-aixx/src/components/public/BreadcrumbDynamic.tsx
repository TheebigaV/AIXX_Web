'use client';

import Link from 'next/link';
import { projectCategories } from '@/components/public/data/projectCategories';
import { productMenuItems } from '@/components/public/data/productMenuItems';

interface BreadcrumbDynamicProps {
  /**
   * 'project'  → Projects list & project category
   * 'product'  → Products list & product title
   */
  type: 'project' | 'product';
  /**
   * slug for project id or product URL segment
   */
  slug: string;
  productCategoryName:string;
  /**
   * Only required when type==='product'
   */
  productTitle?: string;
  /**
   * Optional extra Tailwind classes
   */
  className?: string;

}

const BreadcrumbDynamic: React.FC<BreadcrumbDynamicProps> = ({
  type,
  productCategoryName,
  slug,
  productTitle,
  className = '',
}) => {
  // ─── PRODUCT BREADCRUMB ─────────────────────────────
  if (type === 'product') {
    if (!productTitle) {
      console.error('BreadcrumbDynamic: missing productTitle for product breadcrumb');
      return (
        <div className={`text-red-500 ${className}`}>
          Error: Missing product title
        </div>
      );
    }

    // find category in productMenuItems by href
    const category = productMenuItems.find((item) => item.href === `/product/${slug}`);
    // const categoryName = category?.name || slug.replace(/-/g, ' ');

    return (
      <div
        className={`flex flex-wrap items-center gap-2 text-sm ${className}`}
      >
        <Link
           href={`/product/${slug}`}
          className="text-[#191E42] hover:text-[#191E42]/90 transition-colors"
        >
          {productCategoryName}
        </Link>
        <span className="text-brand-600 text-lg">|</span>
        {/* <Link
          href={`/product/${slug}`}
          className="text-[#191E42] hover:text-[#191E42]/90 transition-colors"
        >
          {categoryName}
        </Link> */}
        <span className="text-brand-600 bg-[#F8F8F8] px-3 py-1 font-medium">
          {productTitle}
        </span>
      </div>
    );
  }

  // ─── PROJECT BREADCRUMB ─────────────────────────────
  // find project category name by id
  const project = projectCategories.find((item) => item.id === slug);
  const categoryName = project?.category || slug.replace(/-/g, ' ');

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-sm sm:text-base font-medium text-white ${className}`}
    >
      <Link
        href="/projects"
        className="text-white/80 hover:underline transition-colors"
        prefetch={false}
      >
        Projects
      </Link>
      <span className="bg-gray-700/80 pl-2 pr-3 py-0.5 border-l-4 border-brand-600">
        {categoryName}
      </span>
    </div>
  );
};

export default BreadcrumbDynamic;
