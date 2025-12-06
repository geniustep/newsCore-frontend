/**
 * Big Hero - Variant: Slider
 * بطل السلايدر - سلايدر بعرض كامل
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BigHeroProps } from '../index';
import { cn } from '@/lib/utils/cn';

export default function HeroSlider({
  variant,
  config,
  data,
  className,
}: BigHeroProps) {
  const { display = {}, custom = {} } = config;
  const articles = data?.articles || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(custom.autoplay !== false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isCardsSlider = variant === 'hero-cards-slider';

  // التنقل
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  // التشغيل التلقائي
  useEffect(() => {
    if (isPlaying && !isHovered && articles.length > 1) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, custom.autoplayDelay || 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, nextSlide, custom.autoplayDelay, articles.length]);

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  if (isCardsSlider) {
    // Cards Slider
    return (
      <div className={cn('hero-cards-slider relative py-8', className)}>
        <div 
          className="overflow-hidden"
          onMouseEnter={() => custom.pauseOnHover && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="flex transition-transform duration-500 ease-out gap-6 px-8"
            style={{
              transform: `translateX(calc(-${currentSlide * 100}% / ${articles.length} - ${currentSlide * 24}px))`,
            }}
          >
            {articles.map((article, index) => {
              const isActive = index === currentSlide;
              
              return (
                <article
                  key={article.id}
                  className={cn(
                    'flex-shrink-0 transition-all duration-500',
                    isActive ? 'scale-105 opacity-100' : 'scale-95 opacity-70'
                  )}
                  style={{ width: custom.cardWidth?.desktop || '500px' }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <Link href={`/article/${article.slug}`} className="block">
                      <div className="relative aspect-video">
                        <Image
                          src={article.coverImageUrl || 'https://placehold.co/800x450/1a365d/ffffff?text=News'}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="500px"
                          priority={index < 3}
                        />
                        {article.categories?.[0] && (
                          <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 text-sm font-bold rounded">
                            {article.categories[0].nameAr || article.categories[0].name}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* الأسهم */}
        {custom.showArrows !== false && articles.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* النقاط */}
        {custom.showDots !== false && articles.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentSlide 
                    ? 'w-8 bg-primary' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full Width Slider
  return (
    <div 
      className={cn('hero-slider relative', className)}
      style={{
        height: custom.height?.desktop || '500px',
        minHeight: custom.minHeight || '400px',
      }}
      onMouseEnter={() => custom.pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* الشرائح */}
      <div className="absolute inset-0">
        {articles.map((article, index) => {
          const isActive = index === currentSlide;
          const transition = custom.transition || 'fade';

          return (
            <div
              key={article.id}
              className={cn(
                'absolute inset-0 transition-all duration-700',
                transition === 'fade' && (isActive ? 'opacity-100' : 'opacity-0'),
                transition === 'slide' && (isActive ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full')
              )}
            >
              <Image
                src={article.coverImageUrl || 'https://placehold.co/1920x600/1a365d/ffffff?text=Hero'}
                alt={article.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* المحتوى */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
                <div 
                  className="max-w-7xl mx-auto"
                  style={{ maxWidth: custom.textMaxWidth || '60%' }}
                >
                  {article.categories?.[0] && (
                    <span className="inline-block bg-primary text-white px-4 py-1.5 text-sm font-bold rounded mb-4">
                      {article.categories[0].nameAr || article.categories[0].name}
                    </span>
                  )}

                  <Link href={`/article/${article.slug}`}>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 line-clamp-2 hover:text-primary/90 transition-colors">
                      {article.title}
                    </h2>
                  </Link>

                  {article.excerpt && (
                    <p className="text-gray-200 text-base md:text-lg mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    {article.author && (
                      <div className="flex items-center gap-2">
                        {article.author.avatar && (
                          <Image
                            src={article.author.avatar}
                            alt={article.author.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                        <span>{article.author.displayName || article.author.name}</span>
                      </div>
                    )}
                    {article.publishedAt && (
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString('ar-SA')}
                      </time>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* شريط التقدم */}
      {custom.showProgress && isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-primary transition-all"
            style={{
              width: '100%',
              animation: `progress ${custom.autoplayDelay || 5000}ms linear`,
            }}
          />
        </div>
      )}

      {/* الأسهم */}
      {custom.showArrows !== false && articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 z-10 p-3 transition-all',
              custom.arrowStyle === 'minimal' 
                ? 'left-4 text-white/70 hover:text-white'
                : 'left-4 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm'
            )}
            aria-label="Previous"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 z-10 p-3 transition-all',
              custom.arrowStyle === 'minimal' 
                ? 'right-4 text-white/70 hover:text-white'
                : 'right-4 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm'
            )}
            aria-label="Next"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* النقاط */}
      {custom.showDots !== false && articles.length > 1 && (
        <div className={cn(
          'absolute z-10 flex gap-2',
          custom.dotsPosition === 'bottom-center' && 'bottom-4 left-1/2 -translate-x-1/2',
          custom.dotsPosition === 'bottom-right' && 'bottom-4 right-4'
        )}>
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'transition-all duration-300',
                custom.dotsStyle === 'line' 
                  ? cn('w-8 h-1 rounded-full', index === currentSlide ? 'bg-primary' : 'bg-white/50')
                  : cn('w-3 h-3 rounded-full', index === currentSlide ? 'bg-primary' : 'bg-white/50')
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* CSS للرسوم المتحركة */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
