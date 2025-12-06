'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Home,
  FileText,
  Files,
  FolderOpen,
  Tag,
  Image,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ListOrdered,
  Palette,
  Moon,
  Sun,
  AlertTriangle,
  Clock,
  BarChart3,
  Puzzle,
  Languages,
  Layers,
  Newspaper,
} from 'lucide-react';
import { useAdminAuthStore } from '@/stores/admin-auth';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  group?: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const basePath = `/${locale}/nc-admin`;

  const navigation: NavItem[] = [
    { name: t('nav.dashboard'), href: '', icon: Home, group: 'main' },
    { name: t('nav.articles'), href: '/articles', icon: FileText, group: 'content' },
    { name: t('nav.pages'), href: '/pages', icon: Files, group: 'content' },
    { name: t('nav.categories'), href: '/categories', icon: FolderOpen, group: 'content' },
    { name: t('nav.tags'), href: '/tags', icon: Tag, group: 'content' },
    { name: t('nav.media'), href: '/media', icon: Image, group: 'content' },
    { name: t('nav.breakingNews'), href: '/breaking-news', icon: AlertTriangle, group: 'content' },
    { name: t('nav.scheduledPosts'), href: '/scheduled', icon: Clock, group: 'content' },
    { name: t('nav.analytics'), href: '/analytics', icon: BarChart3, group: 'analytics' },
    { name: t('nav.menus'), href: '/menus', icon: ListOrdered, group: 'appearance' },
    { name: t('nav.builder'), href: '/builder', icon: Layers, group: 'appearance' },
    { name: t('nav.templates'), href: '/templates', icon: Newspaper, group: 'appearance' },
    { name: t('nav.themes'), href: '/themes', icon: Palette, group: 'system' },
    { name: t('nav.modules'), href: '/modules', icon: Puzzle, group: 'system' },
    { name: t('nav.translations'), href: '/translations', icon: Languages, group: 'system' },
    { name: t('nav.users'), href: '/users', icon: Users, group: 'system' },
    { name: t('nav.settings'), href: '/settings', icon: Settings, group: 'system' },
  ];

  useEffect(() => {
    setMounted(true);
    // Check dark mode preference
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (mounted && !isAuthenticated) {
      router.push(`/${locale}/nc-admin/login`);
    }
  }, [mounted, isAuthenticated, router, locale]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/nc-admin/login`);
  };

  const isActive = (href: string) => {
    const fullPath = href ? `${basePath}${href}` : basePath;
    if (href === '') {
      return pathname === basePath;
    }
    return pathname.startsWith(fullPath);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If on login page, just render children
  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-72 shadow-xl transform transition-transform duration-300 lg:hidden flex flex-col',
          'bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-primary">NewsCore</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={`${basePath}${item.href}`}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-primary">NewsCore</span>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isDarkMode ? t('lightMode') : t('darkMode')}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={`${basePath}${item.href}`}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-primary text-white font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || ''}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
