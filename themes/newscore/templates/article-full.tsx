'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BackToTop, CookieNotice } from '@/components/homepage/FloatingElements';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Share2, Bookmark, Facebook, Twitter, Linkedin, Link2, ChevronRight, ChevronLeft } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentHtml?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  publishedAt?: string;
  readingTime?: number;
  author?: {
    id: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
  }>;
}

interface ArticleFullTemplateProps {
  article: Article;
  relatedArticles: Article[];
  prevArticle?: Article | null;
  nextArticle?: Article | null;
}

export default function ArticleFullTemplate({
  article,
  relatedArticles,
  prevArticle,
  nextArticle,
}: ArticleFullTemplateProps) {
  const t = useTranslations();

  const authorName = article.author?.displayName || 
    `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim() || 
    'فريق التحرير';

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = article.title;
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Image - Full Width */}
        {article.coverImageUrl && (
          <div className="relative h-[60vh] min-h-[400px] max-h-[700px] w-full">
            <Image
              src={article.coverImageUrl}
              alt={article.coverImageAlt || article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Article Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-4xl mx-auto text-center">
                {/* Categories */}
                {article.categories && article.categories.length > 0 && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {article.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="bg-primary text-white px-4 py-1.5 text-sm font-bold rounded hover:bg-primary/90 transition-colors"
                      >
                        {category.nameAr || category.name}
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
                    {article.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-center gap-6 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{authorName}</span>
                  </div>
                  {article.publishedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</span>
                    </div>
                  )}
                  {article.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.readingTime} دقائق للقراءة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Share Buttons - Floating */}
          <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-40">
            <button
              onClick={() => handleShare('facebook')}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
              title="Copy Link"
            >
              <Link2 className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Share Bar */}
          <div className="lg:hidden flex items-center justify-center gap-4 mb-8 pb-8 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400 text-sm">شارك:</span>
            <button
              onClick={() => handleShare('facebook')}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center"
            >
              <Link2 className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-primary hover:prose-a:text-primary/80
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:pr-4 prose-blockquote:py-2"
            dangerouslySetInnerHTML={{ __html: article.contentHtml || article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">الوسوم:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    #{tag.nameAr || tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          {article.author && (
            <div className="mt-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={article.author.avatarUrl || 'https://placehold.co/200x200/1a365d/ffffff?text=A'}
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {authorName}
                  </h4>
                  {article.author.bio && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {article.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevArticle && (
              <Link
                href={`/article/${prevArticle.slug}`}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ChevronRight className="w-5 h-5" />
                  <span className="text-sm">المقال السابق</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {prevArticle.title}
                </h4>
              </Link>
            )}
            {nextArticle && (
              <Link
                href={`/article/${nextArticle.slug}`}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="flex items-center justify-end gap-2 text-primary mb-2">
                  <span className="text-sm">المقال التالي</span>
                  <ChevronLeft className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {nextArticle.title}
                </h4>
              </Link>
            )}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-800 py-12">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                مقالات ذات صلة
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArticles.slice(0, 4).map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/article/${relatedArticle.slug}`}
                    className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="relative h-40">
                      <Image
                        src={relatedArticle.coverImageUrl || 'https://placehold.co/400x300/1a365d/ffffff?text=Article'}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      {relatedArticle.publishedAt && (
                        <span className="text-gray-500 text-sm mt-2 block">
                          {new Date(relatedArticle.publishedAt).toLocaleDateString('ar-SA')}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Floating Elements */}
      <BackToTop />
      <CookieNotice />
    </div>
  );
}
