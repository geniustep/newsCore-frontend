'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CurrencyItem {
  name: string;
  value: number;
  change: number;
  symbol: string;
}

export default function CurrencyTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currencies] = useState<CurrencyItem[]>([
    { name: 'دولار', value: 3.75, change: 0.02, symbol: 'USD' },
    { name: 'يورو', value: 4.10, change: -0.01, symbol: 'EUR' },
    { name: 'ذهب', value: 225.50, change: 1.20, symbol: 'GOLD' },
    { name: 'نفط', value: 85.30, change: -0.50, symbol: 'OIL' },
    { name: 'جنيه', value: 4.85, change: 0.05, symbol: 'GBP' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currencies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currencies.length]);

  const current = currencies[currentIndex];
  const isPositive = current.change >= 0;

  return (
    <div className="flex items-center gap-3 text-xs overflow-hidden">
      <div className="flex items-center gap-2 animate-fade-in">
        <span className="font-medium">{current.name}:</span>
        <span className="font-bold">{current.value.toFixed(2)}</span>
        <span className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(current.change).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
