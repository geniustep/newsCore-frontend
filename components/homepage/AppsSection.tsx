'use client';

import { Smartphone, Bell, BookOpen, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AppsSection() {
  const t = useTranslations();

  const features = [
    {
      icon: <Bell className="w-6 h-6" />,
      title: t('apps.feature1'),
      description: t('apps.feature1Desc'),
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: t('apps.feature2'),
      description: t('apps.feature2Desc'),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('apps.feature3'),
      description: t('apps.feature3Desc'),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* App Mockup */}
          <div className="relative">
            <div className="relative z-10 max-w-sm mx-auto">
              <div className="aspect-[9/19] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-4 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Placeholder for app screenshot */}
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary to-primary-dark">
                    <Smartphone className="w-24 h-24 text-white/30" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold mb-4">{t('apps.title')}</h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('apps.subtitle')}
            </p>

            {/* Features List */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
