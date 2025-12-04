'use client';

import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  const t = useTranslations();

  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">{t('sections.partners')}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full h-12 object-contain grayscale group-hover:grayscale-0 transition-all"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
