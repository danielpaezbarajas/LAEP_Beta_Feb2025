import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe2 } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'id', name: 'Indonesia' },
  { code: 'zh', name: '中文' },
  { code: 'it', name: 'Italiano' }
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Globe2 className="w-5 h-5 text-gray-500" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}