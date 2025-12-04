'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, X, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-110"
      aria-label="Back to top"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}

export function ChatWidget() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl animate-fade-in">
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{t('chat.title')}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 h-80 flex items-center justify-center text-gray-500">
            <p>{t('chat.message')}</p>
          </div>
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder={t('chat.placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110"
        aria-label="Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}

export function CookieNotice() {
  const t = useTranslations();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          {t('cookies.message')}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setVisible(false)}
            className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            {t('cookies.accept')}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            {t('cookies.decline')}
          </button>
        </div>
      </div>
    </div>
  );
}
