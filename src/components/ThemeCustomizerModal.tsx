import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeOption } from '../types';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThemeCardInfo {
  id: ThemeOption;
  name: string;
  description: string;
  previewClass: string;
  badgeColor: string;
}

const THEME_OPTIONS: ThemeCardInfo[] = [
  {
    id: 'light',
    name: 'Clean Slate Light',
    description: 'High-contrast clean light mode for daytime clarity and outdoor viewing',
    previewClass: 'bg-slate-100 text-slate-900 border-slate-300',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    description: 'Eye-safe dark mode canvas for low light and emergency operations',
    previewClass: 'bg-slate-950 text-slate-100 border-slate-800',
    badgeColor: 'bg-purple-600 text-white'
  }
];

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { activeTheme, setTheme } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Theme & Background Color</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize the ResQ background color theme and visual atmosphere for high visibility, outdoor direct sunlight, or night rescue operations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {THEME_OPTIONS.map(theme => {
            const isSelected = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                }}
                className={`flex flex-col text-left p-3.5 rounded-xl border-2 transition-all relative ${
                  theme.previewClass
                } ${
                  isSelected
                    ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-slate-900 border-red-500'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-sm">{theme.name}</span>
                  {isSelected && (
                    <span className="p-0.5 rounded-full bg-red-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] opacity-80 leading-snug">{theme.description}</span>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.badgeColor}`}>
                    Sample Button
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
