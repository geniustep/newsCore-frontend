'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  city: string;
}

export default function WeatherWidget() {
  const [weather] = useState<WeatherData>({
    temp: 25,
    condition: 'sunny',
    city: 'الرياض',
  });

  useEffect(() => {
    // TODO: Integrate with weather API
    // This is a placeholder implementation
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="w-4 h-4" />;
      case 'cloudy':
        return <Cloud className="w-4 h-4" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4" />;
      case 'windy':
        return <Wind className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      {getWeatherIcon()}
      <span>{weather.city}</span>
      <span className="font-semibold">{weather.temp}°C</span>
    </div>
  );
}
