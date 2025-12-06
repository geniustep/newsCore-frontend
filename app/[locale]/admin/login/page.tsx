/**
 * NewsCore Admin Login Page
 * صفحة تسجيل الدخول للإدارة
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Eye, EyeOff, Newspaper, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuthStore } from '@/stores/admin-auth';
import { authApi } from '@/lib/api/admin';
import { cn } from '@/lib/utils/cn';

export default function AdminLoginPage() {
  const t = useTranslations('admin.login');
  const locale = useLocale();
  const router = useRouter();
  const { login: storeLogin, isLoading, setLoading } = useAdminAuthStore();
  const isRTL = locale === 'ar';

  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      // Call the real API
      const response = await authApi.login(email, password) as unknown as {
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          displayName?: string;
          avatarUrl?: string | null;
          roles: string[];
        };
        accessToken: string;
        refreshToken: string;
      };
      
      const { user, accessToken, refreshToken } = response;
      
      storeLogin(
        { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          displayName: user.displayName || `${user.firstName} ${user.lastName}`, 
          avatarUrl: user.avatarUrl || null, 
          roles: user.roles || ['user'] 
        },
        accessToken,
        refreshToken
      );
      router.push(`/${locale}/admin`);
    } catch (err) {
      console.error('Login error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('min-h-screen flex', isRTL && 'rtl')} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center mb-8 shadow-2xl">
            <Newspaper className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-center">
            NewsCore
          </h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            نظام إدارة المحتوى الإخباري الأكثر تطوراً
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-white/70 mt-1">قالب جاهز</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-white/70 mt-1">وحدة إضافية</div>
            </div>
            <div>
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm text-white/70 mt-1">إمكانيات</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NewsCore</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('title')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {t('subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className={cn(
                    'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400',
                    isRTL ? 'right-4' : 'left-4'
                  )} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      'w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl',
                      'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                      'focus:ring-2 focus:ring-primary focus:border-transparent',
                      'transition-all duration-200',
                      isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'
                    )}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className={cn(
                    'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400',
                    isRTL ? 'right-4' : 'left-4'
                  )} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      'w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl',
                      'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                      'focus:ring-2 focus:ring-primary focus:border-transparent',
                      'transition-all duration-200',
                      isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'
                    )}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600',
                      isRTL ? 'left-4' : 'right-4'
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('rememberMe')}
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  {t('forgotPassword')}
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {t('error')}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full py-3 px-4 bg-primary text-white rounded-xl font-medium',
                  'hover:bg-primary/90 focus:ring-4 focus:ring-primary/20',
                  'transition-all duration-200 flex items-center justify-center gap-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t('submit')}
                    <ArrowRight className={cn('w-5 h-5', isRTL && 'rotate-180')} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            © {currentYear || ''} NewsCore. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}

