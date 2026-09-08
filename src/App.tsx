import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, BookOpen, ListOrdered, Shapes, Target, 
  ArrowDownUp, Award, HelpCircle, Star, Play, CheckCircle2
} from 'lucide-react';
import { GameTab } from './types';
import { Navbar } from './components/Navbar';
import { RoboNavigator } from './components/games/RoboNavigator';
import { StepSequencer } from './components/games/StepSequencer';
import { PatternHunter } from './components/games/PatternHunter';
import { AbstractionGame } from './components/games/AbstractionGame';
import { SortingGame } from './components/games/SortingGame';
import { LessonsSection } from './components/LessonsSection';
import { AIBuddyModal } from './components/AIBuddyModal';
import { BadgeModal } from './components/BadgeModal';
import { roboLevels, sequenceTasks, patternQuestions, abstractionScenarios, badgesData } from './data/gamesData';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<GameTab>('navigator');
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('algokids_stars');
    return saved ? parseInt(saved, 10) : 3; // start with 3 welcome stars!
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAIBuddyOpen, setIsAIBuddyOpen] = useState<boolean>(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('algokids_lessons');
    return saved ? JSON.parse(saved) : {};
  });

  // Save progress
  useEffect(() => {
    localStorage.setItem('algokids_stars', stars.toString());
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('algokids_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const addStars = (amount: number) => {
    setStars((prev) => prev + amount);
  };

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.isMuted = next;
    if (!next) sound.playPop();
  };

  const handleReadLesson = (lessonId: string) => {
    if (!completedLessons[lessonId]) {
      setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
      addStars(1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800">
      {/* Top Navbar */}
      <Navbar
        stars={stars}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenBadges={() => setIsBadgeModalOpen(true)}
        onOpenAIBuddy={() => setIsAIBuddyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Mascot Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 sm:p-8 text-white shadow-lg shadow-amber-500/15">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-950 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span>ยินดีต้อนรับสู่โลกแห่งการคิดเชิงคำนวณ!</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight drop-shadow-xs">
                เรียนรู้อัลกอริทึมแสนสนุก กับน้องโรโบ! 🤖
              </h1>
              <p className="mt-2 text-sm sm:text-base text-amber-950/80 font-medium max-w-xl leading-relaxed">
                ฝึกคิดเป็นสเต็ป 1-2-3 แก้ปัญหาอย่างชาญฉลาดผ่านเกมจำลองที่เข้าใจง่าย
                เล่นสนุกได้ดาว สะสมเหรียญรางวัลมากมาย!
              </p>

              {/* Quick Call to Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <button
                  id="hero-play-btn"
                  onClick={() => {
                    sound.playPop();
                    setActiveTab('navigator');
                  }}
                  className="flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-amber-600 text-amber-600" />
                  <span>เริ่มเล่นเกมเลย!</span>
                </button>

                <button
                  id="hero-learn-btn"
                  onClick={() => {
                    sound.playPop();
                    setActiveTab('lessons');
                  }}
                  className="flex items-center gap-2 bg-amber-600/30 hover:bg-amber-600/40 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/30 backdrop-blur-xs transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>อ่านการ์ตูนบทเรียน</span>
                </button>
              </div>
            </div>

            {/* Mascot Graphic */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-5xl sm:text-6xl shadow-inner animate-float">
                🤖
              </div>
              <span className="mt-2 text-xs font-bold bg-white/30 px-3 py-1 rounded-full text-amber-950">
                พี่โรโบพร้อมลุย!
              </span>
            </div>
          </div>
        </section>

        {/* Tab Navigation Menu */}
        <section className="bg-white p-2 rounded-2xl border border-amber-200 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
            {/* Tab 1 */}
            <button
              id="tab-btn-navigator"
              onClick={() => {
                sound.playPop();
                setActiveTab('navigator');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'navigator'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>พาน้องโรโบเดิน</span>
            </button>

            {/* Tab 2 */}
            <button
              id="tab-btn-sequencer"
              onClick={() => {
                sound.playPop();
                setActiveTab('sequencer');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'sequencer'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>เรียงขั้นตอน</span>
            </button>

            {/* Tab 3 */}
            <button
              id="tab-btn-pattern"
              onClick={() => {
                sound.playPop();
                setActiveTab('pattern');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'pattern'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Shapes className="w-4 h-4" />
              <span>ถอดแพทเทิร์น</span>
            </button>

            {/* Tab 4 */}
            <button
              id="tab-btn-abstraction"
              onClick={() => {
                sound.playPop();
                setActiveTab('abstraction');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'abstraction'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-rose-50 hover:text-rose-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>คัดสิ่งสำคัญ</span>
            </button>

            {/* Tab 5 */}
            <button
              id="tab-btn-sorting"
              onClick={() => {
                sound.playPop();
                setActiveTab('sorting');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'sorting'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-900'
              }`}
            >
              <ArrowDownUp className="w-4 h-4" />
              <span>กล่องเรียงลำดับ</span>
            </button>

            {/* Tab 6 */}
            <button
              id="tab-btn-lessons"
              onClick={() => {
                sound.playPop();
                setActiveTab('lessons');
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'lessons'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>บทเรียนการ์ตูน</span>
            </button>
          </div>
        </section>

        {/* Active Tab View */}
        <section>
          {activeTab === 'navigator' && (
            <RoboNavigator
              levels={roboLevels}
              onCompleteLevel={(lvlId, starsEarned) => addStars(starsEarned)}
            />
          )}

          {activeTab === 'sequencer' && (
            <StepSequencer
              tasks={sequenceTasks}
              onCompleteTask={(taskId, starsEarned) => addStars(starsEarned)}
            />
          )}

          {activeTab === 'pattern' && (
            <PatternHunter
              questions={patternQuestions}
              onCompleteQuestion={(qId, starsEarned) => addStars(starsEarned)}
            />
          )}

          {activeTab === 'abstraction' && (
            <AbstractionGame
              scenarios={abstractionScenarios}
              onCompleteScenario={(sId, starsEarned) => addStars(starsEarned)}
            />
          )}

          {activeTab === 'sorting' && (
            <SortingGame
              onComplete={(starsEarned) => addStars(starsEarned)}
            />
          )}

          {activeTab === 'lessons' && (
            <LessonsSection
              onReadLesson={handleReadLesson}
              completedLessons={completedLessons}
            />
          )}
        </section>

        {/* 4 Pillars Summary for Kids (Educational Footer Card) */}
        <section className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs">
          <h3 className="font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2 mb-4">
            <span className="text-xl">🌟</span>
            <span>สรุป 4 บันไดลับการคิดเชิงคำนวณ (Computational Thinking)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-2xl">🧩</span>
              <h4 className="font-bold text-sm text-amber-900 mt-2">1. แยกย่อยปัญหา</h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                หั่นเรื่องยากๆ ให้เป็นเรื่องย่อยๆ ทีละนิด จะจัดการได้ง่ายขึ้นเยอะ!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <span className="text-2xl">🔍</span>
              <h4 className="font-bold text-sm text-purple-900 mt-2">2. หารูปแบบ</h4>
              <p className="text-xs text-purple-800 mt-1 leading-relaxed">
                สังเกตสิ่งที่เกิดขึ้นซ้ำๆ หรือคล้ายกัน เพื่อหาวิธีแก้แบบรวดเร็ว
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
              <span className="text-2xl">🎯</span>
              <h4 className="font-bold text-sm text-rose-900 mt-2">3. คิดเชิงนามธรรม</h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                เลือกเฉพาะสิ่งสำคัญสำหรับเป้าหมาย และตัดสิ่งที่ไม่จำเป็นออกไป
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-2xl">📋</span>
              <h4 className="font-bold text-sm text-emerald-900 mt-2">4. ออกแบบอัลกอริทึม</h4>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                เรียงลำดับขั้นตอน 1, 2, 3 ให้ชัดเจน ใครทำตามก็สำเร็จเหมือนกัน!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <AIBuddyModal
        isOpen={isAIBuddyOpen}
        onClose={() => setIsAIBuddyOpen(false)}
      />

      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        stars={stars}
      />

      {/* Friendly Footer */}
      <footer className="mt-8 border-t border-amber-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <p className="font-medium">
          AlgoKids © ตะลุยโลกอัลกอริทึมและการคิดเชิงคำนวณ สำหรับน้องๆ วัยประถมศึกษา 🚀
        </p>
        <p className="mt-1 text-slate-400">
          เรียนรู้อย่างสนุก ปลอดภัย เสริมทักษะการคิดอย่างเป็นระบบ
        </p>
      </footer>
    </div>
  );
}
