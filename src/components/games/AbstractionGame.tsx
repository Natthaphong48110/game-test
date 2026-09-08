import React, { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AbstractionScenario, AbstractionItem } from '../../types';
import { sound } from '../../utils/audio';

interface AbstractionGameProps {
  scenarios: AbstractionScenario[];
  onCompleteScenario: (id: string, starsEarned: number) => void;
}

export const AbstractionGame: React.FC<AbstractionGameProps> = ({
  scenarios,
  onCompleteScenario,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentScenario = scenarios[currentIdx];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  const toggleItem = (id: string) => {
    if (isSubmitted) return;
    sound.playPop();

    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      if (selectedIds.length >= currentScenario.targetCount) {
        sound.playError();
        return;
      }
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const checkAnswer = () => {
    if (selectedIds.length !== currentScenario.targetCount) {
      sound.playError();
      return;
    }

    // Check if every selected item isEssential
    const essentialItems = currentScenario.items.filter((i) => i.isEssential);
    const correct =
      selectedIds.length === essentialItems.length &&
      selectedIds.every((id) => essentialItems.some((e) => e.id === id));

    setIsSubmitted(true);
    if (correct) {
      sound.playSuccess();
      setIsAllCorrect(true);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
      onCompleteScenario(currentScenario.id, 2);
    } else {
      sound.playError();
      setIsAllCorrect(false);
    }
  };

  const resetCurrent = () => {
    sound.playPop();
    setSelectedIds([]);
    setIsSubmitted(false);
    setIsAllCorrect(false);
  };

  const nextScenario = () => {
    sound.playPop();
    setSelectedIds([]);
    setIsSubmitted(false);
    setIsAllCorrect(false);
    setCurrentIdx((prev) => (prev + 1) % scenarios.length);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
              ภารกิจที่ {currentIdx + 1} จาก {scenarios.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              การคิดเชิงคำนวณ: การคิดเชิงนามธรรม (Abstraction)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {currentScenario.title}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">{currentScenario.mission}</p>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {scenarios.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                sound.playPop();
                setSelectedIds([]);
                setIsSubmitted(false);
                setIsAllCorrect(false);
                setCurrentIdx(idx);
              }}
              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                currentIdx === idx
                  ? 'bg-rose-500 text-white shadow-xs scale-105'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Target Counter Indicator */}
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
          <span>เลือกแล้ว:</span>
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
            {selectedIds.length} / {currentScenario.targetCount} อย่าง
          </span>
          <span className="text-slate-400">(แตะที่การ์ดเพื่อเลือกหรือยกเลิก)</span>
        </div>

        {/* Item Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {currentScenario.items.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                disabled={isSubmitted}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer select-none ${
                  isSelected
                    ? isSubmitted
                      ? item.isEssential
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-md ring-2 ring-emerald-300'
                        : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300'
                      : 'bg-rose-50 border-rose-400 text-rose-900 shadow-sm scale-102 ring-2 ring-rose-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{item.icon}</span>
                <span className="text-sm font-bold text-slate-800">{item.name}</span>

                {isSubmitted && (
                  <span
                    className={`text-[11px] font-medium mt-1 px-2 py-0.5 rounded-md ${
                      item.isEssential
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.reason}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Result Section */}
        <div className="mt-7 w-full flex flex-col items-center">
          {!isSubmitted ? (
            <button
              onClick={checkAnswer}
              disabled={selectedIds.length !== currentScenario.targetCount}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-bold text-sm sm:text-base px-7 py-3 rounded-xl shadow-md transition-all disabled:opacity-40"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>ตรวจคำตอบ (เลือกให้ครบ {currentScenario.targetCount} อย่าง)</span>
            </button>
          ) : (
            <div className="w-full animate-fadeIn">
              {isAllCorrect ? (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-lg mb-1">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                    <span>เก่งมาก! คัดกรองสาระสำคัญได้เป๊ะมาก ⭐</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-700">{currentScenario.tips}</p>
                  {currentIdx < scenarios.length - 1 && (
                    <button
                      onClick={nextScenario}
                      className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      <span>ภารกิจถัดไป</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-base mb-1">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <span>ยังมีบางอย่างที่ไม่จำเป็นสำหรับเป้าหมายนี้ครับ ดูเหตุผลบนการ์ดได้เลย!</span>
                  </div>
                  <button
                    onClick={resetCurrent}
                    className="mt-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-xl transition-colors"
                  >
                    ลองใหม่อีกครั้ง ↺
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
