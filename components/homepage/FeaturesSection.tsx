'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { FileText, Clock, User } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  author: {
    name: string;
  };
  readTime: number; // in minutes
  type: 'report' | 'investigation';
}

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  const locale = useLocale();
  const t = useTranslations();

  if (!features || features.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('sections.features')}</h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={`/${locale}/article/${feature.slug}`}
              className="group"
            >
              <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                {/* Featured Image */}
                <div className="aspect-[16/9] bg-gray-200 relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full text-white font-semibold text-sm ${
                      feature.type === 'report' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      {feature.type === 'report' ? t('article.report') : t('article.investigation')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {feature.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {feature.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {feature.readTime} {t('article.minRead')}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
