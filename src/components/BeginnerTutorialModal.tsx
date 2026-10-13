import React, { useState } from 'react';
import { X, AlertCircle, MapPin, Hospital, BookOpen, Bot, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BeginnerTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_SLIDES = [
  {
    icon: AlertCircle,
    color: 'text-red-600 bg-red-100 dark:bg-red-950/60 dark:text-red-400',
    title: '1. 🚨 SOS Emergency Request',
    subtitle: 'Fast input-driven rescue coordination',
    description: 'Use this whenever you or your family require immediate emergency assistance. Answer 7 simple questions and confirm SOS to alert the Control Center.',
    tip: 'No login is required to submit an SOS request.'
  },
  {
    icon: MapPin,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400',
    title: '2. 📍 Approximate Location',
    subtitle: 'Selective location privacy',
    description: 'DisasterSafe requests browser location permission ONLY when you click "Use My Location". You can also type your state, district, or town manually.',
    tip: 'Your request will never be blocked if GPS permission is denied.'
  },
  {
    icon: Hospital,
    color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400',
    title: '3. 🏥 Nearby Emergency Help',
    subtitle: 'Facilities & cyclone shelter radar',
    description: 'Locate nearest hospitals with trauma centers, police stations, fire brigades, and designated cyclone/flood shelters with capacity status.',
    tip: 'Includes direct simulated call options and directions.'
  },
  {
    icon: BookOpen,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400',
    title: '4. 📚 Actionable Disaster Guides',
    subtitle: 'Before, During, and After protocols',
    description: 'Learn exact survival steps for floods, earthquakes, cyclones, fires, landslides, lightning, and extreme heatwaves.',
    tip: 'Works offline locally on your device.'
  },
  {
    icon: Bot,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/60 dark:text-purple-400',
    title: '5. 🤖 SafeGuide AI & Kit Checklist',
    subtitle: 'Smart assistance & 72-hour survival kit',
    description: 'Ask natural-language questions to SafeGuide AI and keep your 72-hour emergency survival bag fully prepared using the built-in checklist.',
    tip: 'Uses local safety knowledge base fallback if internet is lost.'
  }
];

export const BeginnerTutorialModal: React.FC<BeginnerTutorialModalProps> = ({ isOpen, onClose }) => {
  const { completeTutorial } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slide = TUTORIAL_SLIDES[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === TUTORIAL_SLIDES.length - 1;

  const handleFinish = () => {
    completeTutorial();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            New to DisasterSafe? ({currentSlide + 1} / {TUTORIAL_SLIDES.length})
          </span>
          <button
            onClick={handleFinish}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold px-2 py-1 rounded-lg"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Slide Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3.5 rounded-2xl ${slide.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{slide.title}</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{slide.subtitle}</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {slide.description}
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{slide.tip}</span>
          </div>
        </div>

        {/* Progress Bar & Nav Buttons */}
        <div className="space-y-4 pt-2">
          <div className="flex gap-1.5 w-full">
            {TUTORIAL_SLIDES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-red-600 dark:bg-red-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                currentSlide === 0
                  ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400'
                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {isLast ? (
              <button
                onClick={handleFinish}
                className="flex-1 py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Start Using DisasterSafe</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentSlide(prev => Math.min(TUTORIAL_SLIDES.length - 1, prev + 1))}
                className="flex-1 py-2.5 px-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
