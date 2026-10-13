import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../locales';
import { 
  Bot, 
  Search, 
  FileEdit, 
  LayoutDashboard, 
  GraduationCap, 
  Languages, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface Props {
  activeTab: 'assistant' | 'track' | 'register' | 'officer' | 'cie';
  setActiveTab: (tab: 'assistant' | 'track' | 'register' | 'officer' | 'cie') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  urgentCount?: number;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  urgentCount = 1
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Emergency & Assurance Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl truncate">
          <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Safety Guard
          </span>
          <span className="text-slate-300 truncate text-[11px]">
            {t.emergencyBannerDesc}
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <div className="hidden sm:flex items-center gap-1.5 text-amber-300 font-medium">
            <PhoneCall className="w-3 h-3" />
            <span>Emergency: 112 / 108</span>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
            <Languages className="w-3 h-3 text-indigo-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white text-[11px] focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="English" className="text-slate-900">English</option>
              <option value="Hindi" className="text-slate-900">हिन्दी (Hindi)</option>
              <option value="Marathi" className="text-slate-900">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('assistant')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  {t.appName}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                  AI Redressal Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'assistant'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{t.navAssistant}</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'track'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.navTrack}</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span className="hidden sm:inline">{t.navRegister}</span>
              <span className="sm:hidden">Register</span>
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'officer'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">{t.navDashboard}</span>
              <span className="sm:hidden">Desk</span>
            </button>

            {/* Dedicated CIE Tab for viva & evaluation */}
            <button
              onClick={() => setActiveTab('cie')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'cie'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-sm shadow-purple-500/30'
                  : 'text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="font-bold">CIE Demo & Viva</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
