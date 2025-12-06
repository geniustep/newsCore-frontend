'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Check, ArrowRight, Sparkles, Shield, Zap, Star } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export default function SubscribePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'basic',
      name: t('subscribe.basicPlan'),
      price: billingCycle === 'monthly' ? 9.99 : 99,
      period: billingCycle === 'monthly' ? t('subscribe.perMonth') : t('subscribe.perYear'),
      features: [
        t('subscribe.feature1'),
        t('subscribe.feature2'),
        t('subscribe.feature3'),
      ],
    },
    {
      id: 'pro',
      name: t('subscribe.proPlan'),
      price: billingCycle === 'monthly' ? 19.99 : 199,
      period: billingCycle === 'monthly' ? t('subscribe.perMonth') : t('subscribe.perYear'),
      features: [
        t('subscribe.feature1'),
        t('subscribe.feature2'),
        t('subscribe.feature3'),
        t('subscribe.feature4'),
        t('subscribe.feature5'),
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: t('subscribe.enterprisePlan'),
      price: billingCycle === 'monthly' ? 49.99 : 499,
      period: billingCycle === 'monthly' ? t('subscribe.perMonth') : t('subscribe.perYear'),
      features: [
        t('subscribe.feature1'),
        t('subscribe.feature2'),
        t('subscribe.feature3'),
        t('subscribe.feature4'),
        t('subscribe.feature5'),
        t('subscribe.feature6'),
        t('subscribe.feature7'),
      ],
    },
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    // TODO: Implement actual subscription logic
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/${locale}/login`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href={`/${locale}`} className="inline-block mb-8">
            <h1 className="text-3xl font-bold">{t('site.name')}</h1>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold">{t('subscribe.title')}</h2>
          </div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t('subscribe.subtitle')}
          </p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-1 shadow-lg inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('subscribe.monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('subscribe.yearly')}
              <span className="ms-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {t('subscribe.save20')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-primary shadow-xl scale-105'
                  : 'shadow-lg hover:shadow-xl'
              } ${plan.popular ? 'border-2 border-primary' : 'border border-gray-100'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {t('subscribe.mostPopular')}
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.id);
                  handleSubscribe();
                }}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  t('subscribe.choosePlan')
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            {t('subscribe.whySubscribe')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t('subscribe.benefit1Title')}</h4>
              <p className="text-gray-600 text-sm">{t('subscribe.benefit1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t('subscribe.benefit2Title')}</h4>
              <p className="text-gray-600 text-sm">{t('subscribe.benefit2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{t('subscribe.benefit3Title')}</h4>
              <p className="text-gray-600 text-sm">{t('subscribe.benefit3Desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ or Back */}
      <div className="py-12 text-center">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180 rtl:rotate-0" />
          <span>{t('common.backToHome')}</span>
        </Link>
      </div>
    </div>
  );
}

