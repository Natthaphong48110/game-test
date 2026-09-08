import React from 'react';
import { Bot, Star, Volume2, VolumeX, Award, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  stars: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenBadges: () => void;
  onOpenAIBuddy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stars,
  isMuted,
  onToggleSound,
  onOpenBadges,
  onOpenAIBuddy,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-white transform -rotate-3 hover:rotate-0 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                AlgoKids
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                ประถมศึกษา
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              ตะลุยโลกอัลกอริทึม & การคิดเชิงคำนวณ
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask AI Robo Buddy Button */}
          <button
            id="nav-ask-robo-btn"
            onClick={() => {
              sound.playPop();
              onOpenAIBuddy();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
            title="ปรึกษาพี่โรโบ AI"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">ถามพี่โรโบ AI</span>
            <span className="sm:hidden">พี่โรโบ</span>
          </button>

          {/* Star Counter */}
          <div
            id="nav-star-counter"
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl shadow-xs text-amber-900 font-bold text-xs sm:text-sm"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span>{stars}</span>
            <span className="hidden md:inline font-normal text-amber-700">ดาว</span>
          </div>

          {/* Badges Trophy Button */}
          <button
            id="nav-badges-btn"
            onClick={() => {
              sound.playPop();
              onOpenBadges();
            }}
            className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-semibold text-xs sm:text-sm px-2.5 py-1.5 rounded-xl transition-colors"
            title="ดูเหรียญรางวัล"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">เหรียญรางวัล</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={() => {
              onToggleSound();
            }}
            aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
