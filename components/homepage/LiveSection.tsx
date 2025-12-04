'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Radio, Calendar } from 'lucide-react';

interface LiveEvent {
  id: string;
  title: string;
  startTime: string;
  thumbnail: string;
}

interface LiveSectionProps {
  isLive: boolean;
  liveTitle?: string;
  liveUrl?: string;
  upcomingEvents?: LiveEvent[];
}

export default function LiveSection({
  isLive,
  liveTitle,
  liveUrl,
  upcomingEvents = [],
}: LiveSectionProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Stream */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse-slow" />
                <span className="font-bold text-sm">{t('live.nowLive')}</span>
              </div>
              <h2 className="text-2xl font-bold">{t('sections.live')}</h2>
            </div>

            {isLive && liveUrl ? (
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                {/* Placeholder for video player */}
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <Radio className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl font-semibold mb-2">{liveTitle}</p>
                    <Link
                      href={liveUrl}
                      className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                    >
                      {t('live.watchNow')}
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Radio className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">{t('live.noLive')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Programs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6" />
              <h3 className="text-xl font-bold">{t('live.upcoming')}</h3>
            </div>

            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
                        <img
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-400">{event.startTime}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">{t('live.noUpcoming')}</p>
              )}
            </div>

            <Link
              href={`/${locale}/live`}
              className="block mt-6 text-center py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('live.fullSchedule')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
