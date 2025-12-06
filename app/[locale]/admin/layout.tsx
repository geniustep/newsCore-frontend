/**
 * NewsCore Admin Layout
 * تخطيط لوحة الإدارة الرئيسي مع دعم NextAdmin
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Search,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { useAdminAuthStore } from '@/stores/admin-auth';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface NavGroup {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  items: NavItem[];
}

interface NavItem {
  id: string;
  name: string;
  nameAr: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const getNavigation = (basePath: string): NavGroup[] => [
  {
    id: 'main',
    label: 'Main',
    labelAr: 'الرئيسية',
    icon: Home,
    items: [
      { id: 'dashboard', name: 'Dashboard', nameAr: 'لوحة التحكم', href: '', icon: Home },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    labelAr: 'المحتوى',
    icon: FileText,
    items: [
      { id: 'articles', name: 'Articles', nameAr: 'المقالات', href: '/content/articles', icon: FileText },
      { id: 'pages', name: 'Pages', nameAr: 'الصفحات', href: '/content/pages', icon: Files },
      { id: 'categories', name: 'Categories', nameAr: 'التصنيفات', href: '/content/categories', icon: FolderOpen },
      { id: 'tags', name: 'Tags', nameAr: 'الوسوم', href: '/content/tags', icon: Tag },
      { id: 'media', name: 'Media', nameAr: 'الوسائط', href: '/content/media', icon: Image },
      { id: 'breaking', name: 'Breaking News', nameAr: 'الأخبار العاجلة', href: '/content/breaking-news', icon: AlertTriangle, badge: 'جديد', badgeColor: 'bg-red-500' },
    ],
  },
  {
    id: 'appearance',
    label: 'Appearance',
    labelAr: 'المظهر',
    icon: Palette,
    items: [
      { id: 'builder', name: 'Page Builder', nameAr: 'باني الصفحات', href: '/appearance/builder', icon: Layers },
      { id: 'templates', name: 'Templates', nameAr: 'القوالب', href: '/appearance/templates', icon: Newspaper },
      { id: 'menus', name: 'Menus', nameAr: 'القوائم', href: '/appearance/menus', icon: ListOrdered },
      { id: 'themes', name: 'Themes', nameAr: 'السمات', href: '/appearance/themes', icon: Palette },
    ],
  },
  {
    id: 'system',
    label: 'System',
    labelAr: 'النظام',
    icon: Settings,
    items: [
      { id: 'analytics', name: 'Analytics', nameAr: 'التحليلات', href: '/system/analytics', icon: BarChart3 },
      { id: 'users', name: 'Users', nameAr: 'المستخدمين', href: '/system/users', icon: Users },
      { id: 'translations', name: 'Translations', nameAr: 'الترجمات', href: '/system/translations', icon: Languages },
      { id: 'modules', name: 'Modules', nameAr: 'الوحدات', href: '/system/modules', icon: Puzzle },
      { id: 'settings', name: 'Settings', nameAr: 'الإعدادات', href: '/system/settings', icon: Settings },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function NavGroupComponent({
  group,
  basePath,
  pathname,
  isCollapsed,
  isRTL,
}: {
  group: NavGroup;
  basePath: string;
  pathname: string;
  isCollapsed: boolean;
  isRTL: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const GroupIcon = group.icon;

  const isActive = (href: string) => {
    const fullPath = href ? `${basePath}${href}` : basePath;
    if (href === '') {
      return pathname === basePath;
    }
    return pathname.startsWith(fullPath);
  };

  const hasActiveItem = group.items.some(item => isActive(item.href));

  return (
    <div className="mb-2">
      {!isCollapsed && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider',
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            'transition-colors rounded-lg'
          )}
        >
          <div className="flex items-center gap-2">
            <GroupIcon className="w-4 h-4" />
            <span>{isRTL ? group.labelAr : group.label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}

      {(isOpen || isCollapsed) && (
        <nav className={cn('space-y-1', !isCollapsed && 'mt-1')}>
          {group.items.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={`${basePath}${item.href}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'group relative',
                  active
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? (isRTL ? item.nameAr : item.name) : undefined}
              >
                <ItemIcon className={cn('w-5 h-5 flex-shrink-0', active && 'text-white')} />
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 font-medium">
                      {isRTL ? item.nameAr : item.name}
                    </span>
                    {item.badge && (
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full text-white',
                        item.badgeColor || 'bg-primary'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {isCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const basePath = `/${locale}/admin`;
  const isRTL = locale === 'ar';
  const navigation = getNavigation(basePath);
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      const savedCollapsed = localStorage.getItem('admin_sidebar_collapsed');
      if (savedCollapsed) setSidebarCollapsed(savedCollapsed === 'true');
    }
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && !pathname.includes('/login')) {
      router.push(`/${locale}/admin/login`);
    }
  }, [mounted, isAuthenticated, router, locale, pathname]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebarCollapse = () => {
    const newValue = !sidebarCollapsed;
    setSidebarCollapsed(newValue);
    localStorage.setItem('admin_sidebar_collapsed', String(newValue));
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/admin/login`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
            <Newspaper className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (pathname.includes('/login')) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return (
    <QueryClientProvider client={queryClient}>
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', isRTL && 'rtl')} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col transition-all duration-300',
          'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
          isRTL ? 'right-0 border-l' : 'left-0 border-r',
          sidebarCollapsed ? 'w-20' : 'w-72',
          'lg:translate-x-0',
          sidebarOpen 
            ? 'translate-x-0' 
            : isRTL ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <Link href={basePath} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">NewsCore</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            )}
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {navigation.map((group) => (
            <NavGroupComponent
              key={group.id}
              group={group}
              basePath={basePath}
              pathname={pathname}
              isCollapsed={sidebarCollapsed}
              isRTL={isRTL}
            />
          ))}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.displayName || ''}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
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
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2 rounded-lg text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center"
              title={t('logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={toggleSidebarCollapse}
          className={cn(
            'hidden lg:flex absolute top-20 items-center justify-center',
            'w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
            'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
            'shadow-sm hover:shadow transition-all',
            isRTL ? '-left-3' : '-right-3'
          )}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-3 h-3" />
          ) : (
            <PanelLeftClose className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300',
        isRTL 
          ? sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-72'
          : sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 lg:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mx-4">
            <Link href={basePath} className="hover:text-primary">
              {t('title')}
            </Link>
            {pathname !== basePath && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Help */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              title={isDarkMode ? t('lightMode') : t('darkMode')}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* View Site */}
            <Link
              href={`/${locale}`}
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              عرض الموقع
              <ChevronRight className={cn('w-4 h-4', isRTL && 'rotate-180')} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث في لوحة التحكم...' : 'Search admin panel...'}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                autoFocus
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 rounded">
                ESC
              </kbd>
            </div>
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {isRTL ? 'اكتب للبحث...' : 'Start typing to search...'}
            </div>
          </div>
        </div>
      )}
    </div>
    </QueryClientProvider>
  );
}

