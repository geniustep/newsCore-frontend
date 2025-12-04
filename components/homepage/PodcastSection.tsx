'use client';

import { useState } from 'react';
import { Mic, Play, Pause, Apple, Podcast as PodcastIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Episode {
  id: string;
  title: string;
  duration: string;
  publishDate: string;
  audioUrl: string;
}

interface PodcastSectionProps {
  cover: string;
  title: string;
  description: string;
  episodes: Episode[];
}

export default function PodcastSection({
  cover,
  title,
  description,
  episodes,
}: PodcastSectionProps) {
  const t = useTranslations();
  const [playing, setPlaying] = useState<string | null>(null);

  if (!episodes || episodes.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Mic className="w-8 h-8" />
          <h2 className="text-3xl font-bold">{t('sections.podcast')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Podcast Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="aspect-square bg-white/20 rounded-lg overflow-hidden mb-4">
                <img
                  src={cover}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">{title}</h3>
              <p className="text-white/80 mb-6">{description}</p>

              {/* Platform Links */}
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Apple className="w-5 h-5" />
                  <span className="font-medium">Apple Podcasts</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <PodcastIcon className="w-5 h-5" />
                  <span className="font-medium">Spotify</span>
                </a>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div className="lg:col-span-2">
            <h4 className="text-xl font-bold mb-4">{t('podcast.episodes')}</h4>
            <div className="space-y-3">
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() =>
                        setPlaying(playing === episode.id ? null : episode.id)
                      }
                      className="flex-shrink-0 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      {playing === episode.id ? (
                        <Pause className="w-6 h-6" fill="white" />
                      ) : (
                        <Play className="w-6 h-6 translate-x-0.5" fill="white" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">{episode.title}</h5>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span>{episode.duration}</span>
                        <span>•</span>
                        <span>{episode.publishDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
