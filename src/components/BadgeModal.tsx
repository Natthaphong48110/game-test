import React from 'react';
import { Award, Star, X, CheckCircle, Lock } from 'lucide-react';
import { badgesData } from '../data/gamesData';
import { sound } from '../utils/audio';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, onClose, stars }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-purple-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">หอเกียรติยศยอดนักคิด</h3>
              <p className="text-[11px] text-purple-200">สะสมดวงดาวเพื่อปลดล็อกเหรียญตรา</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Stars Summary */}
        <div className="p-4 bg-purple-50/60 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span className="text-sm font-bold text-purple-950">
              ดาวสะสมของน้อง: <strong className="text-lg text-amber-600">{stars}</strong> ดวง
            </span>
          </div>
          <span className="text-xs text-purple-700 bg-purple-100 font-semibold px-2.5 py-1 rounded-full">
            ปลดล็อกแล้ว {badgesData.filter((b) => stars >= b.requirementStars).length} / {badgesData.length} เหรียญ
          </span>
        </div>

        {/* Badge List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {badgesData.map((badge) => {
            const isUnlocked = stars >= badge.requirementStars;

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-white border-purple-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-xs shrink-0 ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.color} text-white`
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? '🎖️' : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-800">{badge.title}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> สำเร็จ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
                  <p className="text-[11px] font-semibold text-amber-700 mt-1">
                    ต้องการ ⭐ {badge.requirementStars} ดวง
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
