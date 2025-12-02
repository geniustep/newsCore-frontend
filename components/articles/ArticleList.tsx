'use client';

import type { Article } from '@/lib/api/types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          variant="horizontal"
        />
      ))}
    </div>
  );
}
