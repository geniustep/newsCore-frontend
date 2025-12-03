import type { Article } from '@/lib/api/types';

interface NewsArticleJsonLdProps {
  article: Article;
  url: string;
}

// Helper to get author name
const getAuthorName = (article: Article): string => {
  const author = article.author;
  if (!author) return 'Unknown';
  if ('displayName' in author && author.displayName) return author.displayName;
  if ('name' in author && author.name) return author.name;
  if ('firstName' in author) return `${author.firstName} ${author.lastName}`.trim();
  return 'Unknown';
};

// Helper to get category from article
const getCategory = (article: Article) => {
  return article.category || article.categories?.[0];
};

// Helper to get image URL from article
const getImageUrl = (article: Article): string => {
  return article.coverImageUrl || article.featuredImage || '';
};

export function NewsArticleJsonLd({ article, url }: NewsArticleJsonLdProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'أخبار اليوم';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  
  const category = getCategory(article);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || article.title,
    image: getImageUrl(article),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: getAuthorName(article),
      url: article.author ? `${siteUrl}/author/${article.author.id}` : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category?.name,
    keywords: article.tags?.map((tag) => tag.name).join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  url: string;
  name: string;
  description: string;
}

export function WebsiteJsonLd({ url, name, description }: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
