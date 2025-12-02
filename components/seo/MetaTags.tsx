import { Metadata } from 'next';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
  url?: string;
}

export function generateMetadata({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  category,
  tags,
  url,
}: MetaTagsProps): Metadata {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'أخبار اليوم';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      locale: 'ar_SA',
      type: type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : [],
        section: category,
        tags: tags || [],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        fr: `${siteUrl}/fr`,
      },
    },
  };
}
