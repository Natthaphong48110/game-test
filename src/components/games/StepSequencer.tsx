import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SequenceTask, SequenceStep } from '../../types';
import { sound } from '../../utils/audio';

interface StepSequencerProps {
  tasks: SequenceTask[];
  onCompleteTask: (taskId: string, starsEarned: number) => void;
}

export const StepSequencer: React.FC<StepSequencerProps> = ({ tasks, onCompleteTask }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const currentTask = tasks[currentTaskIndex];

  // Shuffled steps for the student to organize
  const [userSteps, setUserSteps] = useState<SequenceStep[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Shuffle steps whenever current task changes
  useEffect(() => {
    resetTask();
  }, [currentTaskIndex]);

  const resetTask = () => {
    const shuffled = [...currentTask.steps].sort(() => Math.random() - 0.5);
    // Ensure it's not accidentally already in order on first shuffle
    const isAlreadyOrdered = shuffled.every((s, i) => s.order === i + 1);
    if (isAlreadyOrdered && shuffled.length > 1) {
      // swap first two
      const temp = shuffled[0];
      shuffled[0] = shuffled[1];
      shuffled[1] = temp;
    }
    setUserSteps(shuffled);
    setIsSuccess(false);
    setShowError(false);
    setErrorMessage('');
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isSuccess) return;
    sound.playPop();
    const newSteps = [...userSteps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;

    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;

    setUserSteps(newSteps);
    setShowError(false);
  };

  const checkAnswer = () => {
    // Correct if each step's order matches its index + 1
    const correct = userSteps.every((step, idx) => step.order === idx + 1);

    if (correct) {
      sound.playSuccess();
      setIsSuccess(true);
      setShowError(false);
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
      });
      onCompleteTask(currentTask.id, 2);
    } else {
      sound.playError();
      setShowError(true);
      // Give smart feedback
      const firstWrongIdx = userSteps.findIndex((step, idx) => step.order !== idx + 1);
      setErrorMessage(
        `เอ๊ะ! ขั้นตอนที่ ${firstWrongIdx + 1} น่าจะยังไม่ใช่ตำแหน่งนี้ครับ ลองนึกถึงลำดับความจริงดูนะ!`
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
      {/* Header & Task Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              ภารกิจที่ {currentTaskIndex + 1} จาก {tasks.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              การคิดเชิงคำนวณ: การแยกย่อยและจัดลำดับ (Sequencing)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {currentTask.title}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">{currentTask.description}</p>
        </div>

        {/* Task Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {tasks.map((task, idx) => (
            <button
              key={task.id}
              onClick={() => {
                sound.playPop();
                setCurrentTaskIndex(idx);
              }}
              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                currentTaskIndex === idx
                  ? 'bg-emerald-500 text-white shadow-xs scale-105'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive cards */}
      <div className="max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-3 text-center">
          กดปุ่มลูกศร ⬆️ หรือ ⬇️ เพื่อเลื่อนขั้นตอนให้อยู่ในลำดับ 1 - 2 - 3 - 4 ที่ถูกต้อง
        </p>

        <div className="space-y-3">
          {userSteps.map((step, idx) => (
            <div
              key={step.id}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                isSuccess
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                {/* Step Number Badge */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base shrink-0 ${
                    isSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    {step.text}
                  </p>
                </div>
              </div>

              {/* Move up / down controls */}
              {!isSuccess && (
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="เลื่อนขึ้น"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === userSteps.length - 1}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="เลื่อนลง"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action button & Feedback */}
        <div className="mt-6 flex flex-col items-center">
          {!isSuccess ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="sequencer-check-btn"
                onClick={checkAnswer}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>ตรวจคำตอบ (Check)</span>
              </button>

              <button
                onClick={resetTask}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors"
                title="สลับลำดับใหม่"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="w-full bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-center animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-lg mb-1">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                <span>ถูกต้องแล้วครับ! เก่งมากๆ ⭐</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-700">
                {currentTask.successExplanation}
              </p>

              {currentTaskIndex < tasks.length - 1 && (
                <button
                  onClick={() => {
                    sound.playPop();
                    setCurrentTaskIndex((prev) => prev + 1);
                  }}
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition-all shadow-sm"
                >
                  ไปต่อภารกิจถัดไป ➔
                </button>
              )}
            </div>
          )}

          {showError && (
            <div className="w-full mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-center justify-center gap-2 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
