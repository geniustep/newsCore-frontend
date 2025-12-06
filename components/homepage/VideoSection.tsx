'use client';

import { useState, useEffect } from 'react';
import { Play, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
  views?: number;
}

interface VideoSectionProps {
  videos: Video[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatNumber = (num: number) => {
    if (!mounted) return num.toString();
    return num.toLocaleString(locale);
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Play className="w-8 h-8 text-primary" />
            {t('sections.videos')}
          </h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              {t('sections.latest')}
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              {t('sections.mostViewed')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-xl aspect-video relative group">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-primary translate-x-1" fill="currentColor" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedVideo.duration}
                </span>
                {selectedVideo.views && (
                  <span>{formatNumber(selectedVideo.views)} {t('video.views')}</span>
                )}
              </div>
            </div>
          </div>

          {/* Video Playlist */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">{t('video.playlist')}</h3>
            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full text-left group ${
                    selectedVideo.id === video.id ? 'ring-2 ring-primary rounded-lg' : ''
                  }`}
                >
                  <div className="flex gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="relative w-32 h-20 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-8 h-8 text-white" fill="white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                      {video.views && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNumber(video.views)} {t('video.views')}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
