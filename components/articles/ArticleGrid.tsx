'use client';

import type { Article } from '@/lib/api/types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  columns?: 1 | 2 | 3 | 4;
}

export default function ArticleGrid({ articles, columns = 3 }: ArticleGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
