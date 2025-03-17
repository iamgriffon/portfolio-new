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
      className={`flex items-center cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm ${
        isSelected 
          ? 'bg-slate-700 text-white' 
          : 'text-gray-200 hover:bg-slate-700'
      }`}
    >
      <span className="text-lg">{language.flag}</span>
      <span>{language.name}</span>
    </button>
  </li>
);

// Dropdown arrow icon
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
  
  // Define available languages
  const languages: Language[] = [
    { code: 'en', name: t('en'), flag: '🇺🇸' },
    { code: 'pt-BR', name: t('pt-BR'), flag: '🇧🇷' },
    { code: 'zh', name: t('zh'), flag: '🇨🇳' }
  ];

  // Get the current language details
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  // Handle language change
  const handleLanguageChange = (newLocale: string) => {
    // Extract the path without locale
    const segments = pathname.split('/');
    const pathnameWithoutLocale = segments.slice(2).join('/') || '';
    
    // Navigate to the same page with new locale
    router.push(`/${newLocale}/${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  // Toggle dropdown menu
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
      >
        <span>
          {currentLanguage.flag} {currentLanguage.name}
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