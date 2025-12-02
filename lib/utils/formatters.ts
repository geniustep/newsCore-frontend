/**
 * Format number to compact notation (e.g., 1000 -> 1K)
 */
export function formatCompactNumber(num: number, locale: string = 'ar'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get reading time in minutes
 */
export function getReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate SEO-friendly excerpt from HTML content
 */
export function generateExcerpt(html: string, maxLength: number = 160): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  // Remove extra whitespace
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return truncateText(cleaned, maxLength);
}

/**
 * Format URL to include protocol
 */
export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
