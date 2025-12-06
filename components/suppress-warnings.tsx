'use client';

import { useEffect } from 'react';

/**
 * Suppresses zustand deprecation warnings from third-party dependencies
 * This component should be added to the root layout
 */
export function SuppressZustandWarnings() {
  useEffect(() => {
    // Store original console.warn
    const originalWarn = console.warn;

    // Override console.warn to filter out zustand deprecation warnings
    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      
      // Suppress zustand default export deprecation warnings
      if (
        typeof message === 'string' &&
        message.includes('[DEPRECATED]') &&
        message.includes('Default export is deprecated') &&
        message.includes('zustand')
      ) {
        // Suppress this warning
        return;
      }

      // Call original warn for all other messages
      originalWarn.apply(console, args);
    };

    // Cleanup: restore original console.warn on unmount
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}

