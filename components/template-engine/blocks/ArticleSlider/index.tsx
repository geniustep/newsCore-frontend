/**
 * NewsCore Template Engine - Article Slider Block
 * بلوك سلايدر المقالات
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockConfig } from '@/lib/template-engine/types';
import type { FetchResult, Article } from '@/lib/template-engine/data-source';
import { getMockArticles } from '@/lib/template-engine/data-source';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ArticleSliderProps {
  variant: string;
  config: Partial<BlockConfig>;
  data?: FetchResult;
  pageData?: Record<string, unknown>;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ArticleSlider({
  variant,
  config,
  data,
  className,
}: ArticleSliderProps) {
  const articles = useMemo(() => {
    if (data?.articles?.length) {
      return data.articles;
    }
    return getMockArticles(6);
  }, [data]);

  const { custom = {} } = config;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying] = useState(custom.autoplay !== false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    if (isPlaying && !isHovered && articles.length > 1 && custom.autoplay !== false) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, custom.autoplayDelay || 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, nextSlide, custom.autoplayDelay, articles.length, custom.autoplay]);

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  // اختيار الـ variant
  switch (variant) {
    case 'slider-3':
    case 'slider-4':
      return (
        <CardSlider
          articles={articles}
          config={config}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          variant={variant}
          className={className}
        />
      );
    case 'slider-5':
      return (
        <ThumbnailSlider
          articles={articles}
          config={config}
          currentSlide={currentSlide}
          goToSlide={goToSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          className={className}
        />
      );
    default:
      return (
        <FullWidthSlider
          articles={articles}
          config={config}
          currentSlide={currentSlide}
          goToSlide={goToSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          variant={variant}
          className={className}
        />
      );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FULL WIDTH SLIDER (slider-1, slider-2)
// ═══════════════════════════════════════════════════════════════════════════════

interface SliderComponentProps {
  articles: Article[];
  config: Partial<BlockConfig>;
  currentSlide: number;
  goToSlide?: (index: number) => void;
  setCurrentSlide?: React.Dispatch<React.SetStateAction<number>>;
  nextSlide: () => void;
  prevSlide: () => void;
  isHovered: boolean;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  variant?: string;
  className?: string;
}

function FullWidthSlider({
  articles,
  config,
  currentSlide,
  goToSlide,
  nextSlide,
  prevSlide,
  setIsHovered,
  variant,
  className,
}: SliderComponentProps) {
  const { custom = {} } = config;
  const isFade = variant === 'slider-2' || custom.transition === 'fade';

  return (
    <div 
      className={cn('article-slider-full relative overflow-hidden rounded-xl', className)}
      style={{ height: custom.height?.desktop || '450px' }}
      onMouseEnter={() => custom.pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* الشرائح */}
      {articles.map((article, index) => {
        const isActive = index === currentSlide;

        return (
          <div
            key={article.id}
            className={cn(
              'absolute inset-0 transition-all duration-700',
              isFade 
                ? (isActive ? 'opacity-100 z-10' : 'opacity-0 z-0')
                : (isActive ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full')
            )}
          >
            <Image
              src={article.coverImageUrl || 'https://placehold.co/1200x450/1a365d/ffffff?text=Slider'}
              alt={article.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* المحتوى */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div style={{ maxWidth: custom.textMaxWidth || '70%' }}>
                {article.categories?.[0] && (
                  <span className="inline-block bg-primary text-white px-3 py-1 text-sm font-bold rounded mb-3">
                    {article.categories[0].nameAr || article.categories[0].name}
                  </span>
                )}

                <Link href={`/article/${article.slug}`}>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2 hover:text-primary/90 transition-colors">
                    {article.title}
                  </h2>
                </Link>

                {display.showExcerpt !== false && article.excerpt && (
                  <p className="text-gray-200 mb-4 line-clamp-2 hidden md:block">
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
                          width={28}
                          height={28}
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

      {/* الأسهم */}
      {custom.showArrows !== false && articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors"
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* النقاط */}
      {custom.showDots !== false && articles.length > 1 && goToSlide && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentSlide ? 'w-8 bg-primary' : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD SLIDER (slider-3, slider-4)
// ═══════════════════════════════════════════════════════════════════════════════

function CardSlider({
  articles,
  config,
  currentSlide,
  nextSlide,
  prevSlide,
  setIsHovered,
  variant,
  className,
}: SliderComponentProps) {
  const { display = {}, custom = {} } = config;
  const isCentered = variant === 'slider-4';

  const slidesPerView = custom.slidesPerView?.desktop || 3;
  const spaceBetween = custom.spaceBetween?.desktop || 24;

  return (
    <div 
      className={cn('article-slider-cards relative', className)}
      onMouseEnter={() => custom.pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesPerView + spaceBetween / 10)}%)`,
            gap: `${spaceBetween}px`,
          }}
        >
          {articles.map((article, index) => {
            const isActive = isCentered && index === currentSlide;

            return (
              <article
                key={article.id}
                className={cn(
                  'flex-shrink-0 transition-all duration-500',
                  isCentered && (isActive ? 'scale-105 opacity-100' : 'scale-95 opacity-70')
                )}
                style={{ width: `calc(${100 / slidesPerView}% - ${spaceBetween}px)` }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <Link href={`/article/${article.slug}`} className="block">
                    <div className="relative aspect-video">
                      <Image
                        src={article.coverImageUrl || 'https://placehold.co/600x338/1a365d/ffffff?text=News'}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                      {article.categories?.[0] && (
                        <span className="absolute top-3 right-3 bg-primary text-white px-2 py-1 text-xs font-bold rounded">
                          {article.categories[0].nameAr || article.categories[0].name}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      {display.showExcerpt !== false && article.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
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
      {custom.showArrows !== false && articles.length > slidesPerView && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THUMBNAIL SLIDER (slider-5)
// ═══════════════════════════════════════════════════════════════════════════════

function ThumbnailSlider({
  articles,
  config,
  currentSlide,
  goToSlide,
  nextSlide,
  prevSlide,
  setIsHovered,
  className,
}: SliderComponentProps) {
  const { custom = {} } = config;

  return (
    <div 
      className={cn('article-slider-thumbnails', className)}
      onMouseEnter={() => custom.pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* السلايدر الرئيسي */}
      <div 
        className="relative overflow-hidden rounded-xl mb-4"
        style={{ height: custom.height?.desktop || '450px' }}
      >
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <Image
              src={article.coverImageUrl || 'https://placehold.co/1200x450/1a365d/ffffff?text=Slider'}
              alt={article.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div style={{ maxWidth: '60%' }}>
                {article.categories?.[0] && (
                  <span className="inline-block bg-primary text-white px-3 py-1 text-sm font-bold rounded mb-3">
                    {article.categories[0].nameAr || article.categories[0].name}
                  </span>
                )}
                <Link href={`/article/${article.slug}`}>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                </Link>
                {article.excerpt && (
                  <p className="text-gray-200 line-clamp-2 hidden md:block">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* الأسهم */}
        {custom.showArrows !== false && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full"
              aria-label="Next"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* الصور المصغرة */}
      {custom.thumbnails?.enabled !== false && goToSlide && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {articles.map((article, index) => (
            <button
              key={article.id}
              onClick={() => goToSlide(index)}
              className={cn(
                'flex-shrink-0 relative overflow-hidden rounded-lg transition-all',
                index === currentSlide 
                  ? 'ring-2 ring-primary scale-105' 
                  : 'opacity-70 hover:opacity-100'
              )}
              style={{ width: '100px', height: '60px' }}
            >
              <Image
                src={article.coverImageUrl || 'https://placehold.co/200x120/1a365d/ffffff?text=Thumb'}
                alt={article.title}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { ArticleSlider };
