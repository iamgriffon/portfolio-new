'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: t('en'), flag: '🇺🇸' },
    { code: 'pt-BR', name: t('pt-BR'), flag: '🇧🇷' },
    { code: 'zh', name: t('zh'), flag: '🇨🇳' }
  ];

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/');
    const pathnameWithoutLocale = segments.slice(2).join('/') || '';
    router.push(`/${newLocale}/${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
      >
        <span>
          {languages.find(lang => lang.code === locale)?.flag} {languages.find(lang => lang.code === locale)?.name || 'Language'}
        </span>
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute mt-1 right-0 bg-slate-800 rounded-md shadow-lg overflow-hidden z-50">
          <ul className="py-1">
            {languages.map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm ${locale === lang.code ? 'bg-slate-700 text-white' : 'text-gray-200 hover:bg-slate-700'}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 