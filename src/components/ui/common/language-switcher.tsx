'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const LanguageButton = ({ 
  language, 
  isSelected, 
  onClick 
}: { 
  language: Language; 
  isSelected: boolean; 
  onClick: () => void; 
}) => (
  <li key={language.code}>
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer gap-2 w-full text-left px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm ${
        isSelected 
          ? 'bg-slate-700 text-white' 
          : 'text-gray-200 hover:bg-slate-700'
      }`}
    >
      <span className="text-base sm:text-lg">{language.flag}</span>
      <span>{language.name}</span>
    </button>
  </li>
);

const DropdownArrow = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages: Language[] = [
    { code: 'en', name: t('en'), flag: '🇺🇸' },
    { code: 'pt-BR', name: t('pt-BR'), flag: '🇧🇷' },
    { code: 'zh', name: t('zh'), flag: '🇨🇳' },
    { code: 'es', name: t('es'), flag: '🇪🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/');
    const pathnameWithoutLocale = segments.slice(2).join('/') || '';
    router.push(`/${newLocale}/${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white cursor-pointer text-xs sm:text-sm"
      >
        <span className="flex items-center">
          <span className="text-base sm:text-lg mr-0.5 sm:mr-1">{currentLanguage.flag}</span>
          <span className="hidden xs:inline">{currentLanguage.name}</span>
        </span>
        <DropdownArrow />
      </button>
      
      {isOpen && (
        <div className="absolute mt-1 right-0 bg-slate-800 rounded-md shadow-lg overflow-hidden z-50">
          <ul className="py-1">
            {languages.map(language => (
              <LanguageButton
                key={language.code}
                language={language}
                isSelected={locale === language.code}
                onClick={() => handleLanguageChange(language.code)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 