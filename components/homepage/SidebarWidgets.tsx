'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { TrendingUp, Mail, ThumbsUp } from 'lucide-react';
import type { Article } from '@/lib/api/types';

// Most Read Widget
interface MostReadProps {
  articles: Article[];
}

export function MostReadWidget({ articles }: MostReadProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<'read' | 'shared' | 'commented'>('read');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">{t('sidebar.trending')}</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('read')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'read'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          {t('sidebar.mostRead')}
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'shared'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          {t('sidebar.mostShared')}
        </button>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.slice(0, 5).map((article, index) => (
          <Link
            key={article.id}
            href={`/${locale}/article/${article.slug}`}
            className="flex gap-3 group"
          >
            <span className="text-3xl font-bold text-gray-200 group-hover:text-primary transition-colors">
              {index + 1}
            </span>
            <div className="flex-1">
              <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h4>
              {article.featured_image && (
                <div className="w-full h-20 mt-2 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Newsletter Widget
export function NewsletterWidget() {
  const t = useTranslations();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Subscribe:', email);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-6 h-6" />
        <h3 className="text-xl font-bold">{t('newsletter.title')}</h3>
      </div>
      <p className="text-white/90 mb-4 text-sm">
        {t('newsletter.description')}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder')}
          className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-white text-primary font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {t('newsletter.subscribe')}
        </button>
      </form>
    </div>
  );
}

// Poll Widget
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollWidgetProps {
  question: string;
  options: PollOption[];
}

export function PollWidget({ question, options }: PollWidgetProps) {
  const t = useTranslations();
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = () => {
    if (selectedOption) {
      setVoted(true);
      // TODO: Submit vote to API
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ThumbsUp className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">{t('poll.title')}</h3>
      </div>
      <p className="font-semibold mb-4">{question}</p>

      {!voted ? (
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="poll"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="w-4 h-4 text-primary"
              />
              <span>{option.text}</span>
            </label>
          ))}
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('poll.vote')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{option.text}</span>
                  <span className="font-semibold">{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          <p className="text-sm text-gray-500 text-center mt-4">
            {t('poll.totalVotes')}: {totalVotes.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
