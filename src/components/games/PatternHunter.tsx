import React, { useState } from 'react';
import { Sparkles, CheckCircle2, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PatternQuestion } from '../../types';
import { sound } from '../../utils/audio';

interface PatternHunterProps {
  questions: PatternQuestion[];
  onCompleteQuestion: (id: string, starsEarned: number) => void;
}

export const PatternHunter: React.FC<PatternHunterProps> = ({ questions, onCompleteQuestion }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQ = questions[currentIdx];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      sound.playSuccess();
      setIsCorrect(true);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
      onCompleteQuestion(currentQ.id, 2);
    } else {
      sound.playError();
      setIsCorrect(false);
    }
  };

  const nextQuestion = () => {
    sound.playPop();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentIdx((prev) => (prev + 1) % questions.length);
  };

  const resetCurrent = () => {
    sound.playPop();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
              ข้อที่ {currentIdx + 1} จาก {questions.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              การคิดเชิงคำนวณ: การจดจำรูปแบบ (Pattern Recognition)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {currentQ.title}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            สังเกตรูปแบบที่ซ้ำกัน แล้วทายว่าตัวต่อไปในเครื่องหมายคำถาม [?] คืออะไร!
          </p>
        </div>

        {/* Question Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                sound.playPop();
                setSelectedOption(null);
                setIsAnswered(false);
                setIsCorrect(false);
                setCurrentIdx(idx);
              }}
              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                currentIdx === idx
                  ? 'bg-purple-600 text-white shadow-xs scale-105'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Pattern Sequence Display */}
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-full bg-slate-50 p-5 sm:p-6 rounded-3xl border-2 border-purple-200 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 shadow-inner">
          {currentQ.sequence.map((item, idx) => (
            <div
              key={idx}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xs transition-transform hover:scale-105 ${item.color}`}
            >
              <span className="text-2xl sm:text-3xl">{item.icon}</span>
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </div>
          ))}

          {/* Target Unknown Box */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 border-dashed border-purple-400 bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-2xl animate-pulse">
            ?
          </div>
        </div>

        {/* Choice Options */}
        <div className="mt-8 w-full">
          <p className="text-center text-xs sm:text-sm font-bold text-slate-600 mb-4">
            เลือกคำตอบที่ถูกต้อง:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isThisChosen = selectedOption === idx;
              const isThisCorrect = currentQ.correctIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isAnswered
                      ? isThisCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-md scale-102 ring-2 ring-emerald-300'
                        : isThisChosen
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 hover:shadow-sm active:scale-95'
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="text-sm font-bold text-slate-800">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Area */}
        {isAnswered && (
          <div className="mt-6 w-full animate-fadeIn">
            {isCorrect ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-lg mb-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>เก่งมาก! ตอบถูกแล้วครับ ⭐</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-700">{currentQ.explanation}</p>
                <button
                  onClick={nextQuestion}
                  className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition-colors shadow-xs"
                >
                  <span>ข้อถัดไป</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center">
                <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-base mb-1">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span>ยังไม่ถูกต้องครับ ลองสังเกตการสลับกันอีกครั้งนะ</span>
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
  );
};
