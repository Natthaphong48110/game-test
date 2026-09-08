import React, { useState } from 'react';
import { BookOpen, CheckCircle, Sparkles, Lightbulb, Compass, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, lessonsData } from '../data/lessonsData';
import { sound } from '../utils/audio';

interface LessonsSectionProps {
  onReadLesson: (lessonId: string) => void;
  completedLessons: Record<string, boolean>;
}

export const LessonsSection: React.FC<LessonsSectionProps> = ({
  onReadLesson,
  completedLessons,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(lessonsData[0].id);
  const activeLesson = lessonsData.find((l) => l.id === activeLessonId) || lessonsData[0];

  const handleMarkRead = () => {
    sound.playSuccess();
    onReadLesson(activeLesson.id);
    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
      {/* Header */}
      <div className="pb-4 border-b border-amber-100 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              คลังความรู้ฉบับการ์ตูน
            </span>
            <span className="text-xs text-slate-500 font-medium">
              เข้าใจง่าย กระชับ เหมาะสำหรับเด็กประถม
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            เรื่องเล่าอัลกอริทึม & การคิดเชิงคำนวณ
          </h2>
        </div>
      </div>

      {/* Lesson Selector Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {lessonsData.map((lesson) => {
          const isSelected = lesson.id === activeLessonId;
          const isDone = !!completedLessons[lesson.id];

          return (
            <button
              key={lesson.id}
              onClick={() => {
                sound.playPop();
                setActiveLessonId(lesson.id);
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                  : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">
                  {lesson.id === 'what-is-algo'
                    ? '📝'
                    : lesson.id === 'ct-pillars'
                    ? '🧠'
                    : lesson.id === 'loop-magic'
                    ? '🔁'
                    : '🐛'}
                </span>
                {isDone && (
                  <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold line-clamp-1">{lesson.title}</p>
              <p
                className={`text-[11px] mt-0.5 line-clamp-1 ${
                  isSelected ? 'text-amber-100' : 'text-slate-500'
                }`}
              >
                {lesson.shortSubtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Lesson Content Body */}
      <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-3xl p-5 sm:p-7 border border-amber-200/80">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200">
              {activeLesson.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
              {activeLesson.title}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
            {activeLesson.id === 'what-is-algo'
              ? '📝'
              : activeLesson.id === 'ct-pillars'
              ? '🧠'
              : activeLesson.id === 'loop-magic'
              ? '🔁'
              : '🐛'}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-white/70 p-4 rounded-2xl border border-amber-100 mb-5 shadow-2xs">
          {activeLesson.summary}
        </p>

        {/* Real-life Step-by-Step Example Box */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{activeLesson.realLifeExample.emoji}</span>
            <h4 className="text-base font-bold text-amber-900">
              {activeLesson.realLifeExample.title}
            </h4>
          </div>

          <div className="space-y-2">
            {activeLesson.realLifeExample.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-700"
              >
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact & Key Takeaway */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-900 flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-blue-800 font-bold mb-0.5">รู้หรือไม่?</strong>
              <p className="text-blue-700 leading-normal">{activeLesson.funFact}</p>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 flex items-start gap-2.5">
            <Compass className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-800 font-bold mb-0.5">หัวใจสำคัญ</strong>
              <p className="text-emerald-700 leading-normal">{activeLesson.keyRule}</p>
            </div>
          </div>
        </div>

        {/* Mark as read button */}
        <div className="flex justify-end">
          <button
            onClick={handleMarkRead}
            disabled={completedLessons[activeLesson.id]}
            className={`flex items-center gap-2 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs ${
              completedLessons[activeLesson.id]
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white active:scale-95'
            }`}
          >
            {completedLessons[activeLesson.id] ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>เข้าใจบทเรียนนี้แล้ว (ได้รับ 1 ⭐ แล้ว)</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4 fill-white" />
                <span>อ่านจบแล้ว! กดรับดาว ⭐</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
