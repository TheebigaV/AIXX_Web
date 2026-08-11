'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchPublicTrainings } from '@/lib/training';

interface NewsDetailItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  tag: string;
  slug: string;
  imageUrl?: string;
  content: string;
}

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [news, setNews] = useState<NewsDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<NewsDetailItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const response = await fetchPublicTrainings('newsletters');
        const payload = response?.data?.data || response?.data || [];
        const items = Array.isArray(payload) ? payload : [];
        const matchedNews = items.find((item: any) => (item.slug || item.id) === slug);

        if (!isMounted) return;

        if (matchedNews) {
          setNews({
            id: matchedNews.id,
            slug: matchedNews.slug,
            title: matchedNews.name || 'News',
            description: matchedNews.description || '',
            content: matchedNews.description || '',
            duration: matchedNews.duration || 'Recently',
            tag: matchedNews.highlights || 'NEWS',
            imageUrl: matchedNews.sub_modules || matchedNews.image?.url || '/images/gallery/news1.png',
          });

          // Related News
          const related = items
            .filter((item: any) => (item.slug || item.id) !== slug)
            .slice(0, 3)
            .map((item: any) => ({
              id: item.id,
              slug: item.slug,
              title: item.name || 'News',
              description: item.description || '',
              content: item.description || '',
              duration: item.duration || 'Recently',
              tag: item.highlights || 'NEWS',
              imageUrl: item.sub_modules || item.image?.url || '/images/gallery/news1.png',
            }));
          setRelatedNews(related);

        } else {
          setNews(null);
        }
      } catch (error) {
        console.error('Failed to load news details:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) {
        loadNews();
    }
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-white text-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          <p className="text-center">Loading news details...</p>
        </div>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="bg-white text-black min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">News Not Found</h1>
          <p className="text-gray-600 mb-6">The requested news article could not be found.</p>
          <Link href="/ai-hot-news" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Back to AI-Hot News
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-black min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/ai-hot-news" className="hover:text-blue-600">
            AI-Hot News
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{news.title}</span>
        </div>

        {/* News Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              {news.imageUrl ? (
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                    news.tag === 'BREAKING' ? 'bg-red-100 text-red-600' : 
                    news.tag === 'TRENDING' ? 'bg-emerald-100 text-emerald-600' : 
                    'bg-blue-100 text-blue-600'
                }`}>
                   {news.tag}
                </span>
                <div className="flex items-center text-gray-500 gap-1 text-sm font-medium">
                   <ClockIcon />
                   <span>{news.duration}</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{news.title}</h1>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Content</h2>
              <div
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>
          </div>
        </div>

        {/* More News Section */}
        {relatedNews.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More AI-Hot News</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedNews.map((n) => (
                <Link href={`/news/${n.slug}`} key={n.id} className="block group">
                  <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 transition-all group-hover:shadow-lg h-full flex flex-col">
                    {n.imageUrl && (
                      <div className="w-full h-48 relative overflow-hidden shrink-0">
                        <img 
                          src={n.imageUrl} 
                          alt={n.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                          {n.tag}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <ClockIcon /> {n.duration}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {n.title}
                      </h3>
                      <div 
                        className="text-sm text-gray-600 line-clamp-3 prose-sm" 
                        dangerouslySetInnerHTML={{ __html: n.description }} 
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
