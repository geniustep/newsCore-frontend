/**
 * NewsCore - Settings Page
 * صفحة الإعدادات
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Settings,
  Search,
  Share2,
  Mail,
  Key,
  Save,
  Check,
  Image,
  Bell,
  Shield,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SettingsTab {
  id: string;
  label: string;
  icon: typeof Settings;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          معلومات الموقع
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم الموقع
            </label>
            <input
              type="text"
              defaultValue="أخبار اليوم"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الشعار النصي
            </label>
            <input
              type="text"
              defaultValue="موقعك الإخباري الأول"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          وصف الموقع
        </label>
        <textarea
          rows={3}
          defaultValue="موقع إخباري شامل يقدم آخر الأخبار المحلية والعالمية"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اللغة الافتراضية
          </label>
          <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            المنطقة الزمنية
          </label>
          <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option value="Asia/Riyadh">توقيت الرياض (GMT+3)</option>
            <option value="Asia/Dubai">توقيت دبي (GMT+4)</option>
            <option value="Africa/Cairo">توقيت القاهرة (GMT+2)</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          الشعار
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">الشعار الرئيسي</p>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
              رفع صورة
            </button>
          </div>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">أيقونة الموقع</p>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
              رفع صورة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SEOSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          إعدادات SEO العامة
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان الموقع (Title Tag)
            </label>
            <input
              type="text"
              defaultValue="أخبار اليوم - موقعك الإخباري الأول"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">يُفضل أن يكون بين 50-60 حرف</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف التعريفي (Meta Description)
            </label>
            <textarea
              rows={3}
              defaultValue="موقع إخباري شامل يقدم آخر الأخبار المحلية والعالمية في السياسة والاقتصاد والرياضة والتقنية"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">يُفضل أن يكون بين 150-160 حرف</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الكلمات المفتاحية
            </label>
            <input
              type="text"
              defaultValue="أخبار, أخبار عربية, سياسة, اقتصاد, رياضة"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Open Graph
        </h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">صورة المشاركة الافتراضية</p>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
              رفع صورة
            </button>
            <p className="text-xs text-gray-400 mt-2">الحجم المُوصى به: 1200x630 بكسل</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          أدوات التحليل
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Search Console
            </label>
            <input
              type="text"
              placeholder="رمز التحقق"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialSettings() {
  const socialNetworks = [
    { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { id: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
    { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { id: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
    { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...' },
    { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/...' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          روابط التواصل الاجتماعي
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialNetworks.map((network) => (
            <div key={network.id}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {network.label}
              </label>
              <input
                type="url"
                placeholder={network.placeholder}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                dir="ltr"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          إعدادات المشاركة
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700 dark:text-gray-300">تفعيل أزرار المشاركة على المقالات</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700 dark:text-gray-300">إظهار عدد المشاركات</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-700 dark:text-gray-300">النشر التلقائي على تويتر</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function SettingsPage() {
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs: SettingsTab[] = [
    { id: 'general', label: 'عام', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'social', label: 'التواصل الاجتماعي', icon: Share2 },
    { id: 'email', label: 'البريد الإلكتروني', icon: Mail },
    { id: 'api', label: 'API', icon: Key },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: Database },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'seo':
        return <SEOSettings />;
      case 'social':
        return <SocialSettings />;
      default:
        return (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>هذا القسم قيد التطوير</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إعدادات الموقع العامة والتكوينات
          </p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            'px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2',
            saved
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
          )}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              تم الحفظ
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              حفظ الإعدادات
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right',
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

