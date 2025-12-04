'use client';

import { Twitter, Facebook, Instagram, Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SocialHub() {
  const t = useTranslations();

  const trendingHashtags = [
    '#عاجل',
    '#السعودية',
    '#الرياض',
    '#اقتصاد',
    '#تقنية',
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{t('sections.socialMedia')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Twitter Feed */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-sky-500 text-white p-4 flex items-center gap-2">
              <Twitter className="w-6 h-6" />
              <h3 className="font-bold text-lg">Twitter</h3>
            </div>
            <div className="p-6 min-h-[300px]">
              {/* Placeholder for Twitter embed */}
              <div className="text-center text-gray-500">
                <Twitter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">{t('social.followUs')}</p>
              </div>
            </div>
          </div>

          {/* Facebook Feed */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex items-center gap-2">
              <Facebook className="w-6 h-6" />
              <h3 className="font-bold text-lg">Facebook</h3>
            </div>
            <div className="p-6 min-h-[300px]">
              {/* Placeholder for Facebook embed */}
              <div className="text-center text-gray-500">
                <Facebook className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">{t('social.likeUs')}</p>
              </div>
            </div>
          </div>

          {/* Instagram Feed */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white p-4 flex items-center gap-2">
              <Instagram className="w-6 h-6" />
              <h3 className="font-bold text-lg">Instagram</h3>
            </div>
            <div className="p-6 min-h-[300px]">
              {/* Placeholder for Instagram embed */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">{t('social.trending')}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingHashtags.map((tag) => (
              <a
                key={tag}
                href={`#${tag}`}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-full transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
