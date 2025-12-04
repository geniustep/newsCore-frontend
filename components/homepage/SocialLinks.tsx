'use client';

import { Facebook, Twitter, Instagram, Youtube, Rss } from 'lucide-react';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
  { icon: Youtube, href: '#', label: 'Youtube', color: 'hover:text-red-600' },
  { icon: Rss, href: '#', label: 'RSS', color: 'hover:text-orange-500' },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${social.color}`}
          aria-label={social.label}
        >
          <social.icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
