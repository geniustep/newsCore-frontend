'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NewsletterSection() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterType, setNewsletterType] = useState('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription API
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-4">{t('newsletter.title')}</h2>
        <p className="text-xl text-white/90 mb-8">
          {t('newsletter.subtitle')}
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {/* Newsletter Type Selection */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <label className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="daily"
                  checked={newsletterType === 'daily'}
                  onChange={(e) => setNewsletterType(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">{t('newsletter.daily')}</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="weekly"
                  checked={newsletterType === 'weekly'}
                  onChange={(e) => setNewsletterType(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">{t('newsletter.weekly')}</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="breaking"
                  checked={newsletterType === 'breaking'}
                  onChange={(e) => setNewsletterType(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">{t('newsletter.breaking')}</span>
              </label>
            </div>

            {/* Email Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.emailPlaceholder')}
                className="flex-1 px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors text-lg whitespace-nowrap"
              >
                {t('newsletter.subscribe')}
              </button>
            </div>

            <p className="text-sm text-white/70 mt-4">
              {t('newsletter.privacy')}
            </p>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-semibold">{t('newsletter.success')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
