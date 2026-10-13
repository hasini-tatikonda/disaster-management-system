import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../locales/translations';
import { LanguageCode } from '../types';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { activeLanguage, setLanguage } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
            <Globe className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Language / భాష / भाषा</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          DisasterSafe supports Indian regional languages to ensure immediate emergency access for all citizens across India.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map(lang => {
            const isSelected = activeLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as LanguageCode);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">{lang.nativeName}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lang.name}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400">
          Primary emergency terminology translated across regional Indian dialects.
        </div>
      </div>
    </div>
  );
};
