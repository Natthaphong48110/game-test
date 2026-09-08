import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, CheckCircle2, RotateCcw, Sparkles, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface SortingItem {
  id: number;
  value: number;
  name: string;
  emoji: string;
  color: string;
}

const initialItems: SortingItem[] = [
  { id: 1, value: 1, name: "มดจิ๋ว", emoji: "🐜", color: "bg-amber-100 border-amber-300 text-amber-900" },
  { id: 2, value: 3, name: "ลูกเจี๊ยบ", emoji: "🐥", color: "bg-yellow-100 border-yellow-300 text-yellow-900" },
  { id: 3, value: 5, name: "เจ้าเหมียว", emoji: "🐱", color: "bg-orange-100 border-orange-300 text-orange-900" },
  { id: 4, value: 7, name: "พี่หมี", emoji: "🐻", color: "bg-emerald-100 border-emerald-300 text-emerald-900" },
  { id: 5, value: 9, name: "คุณช้าง", emoji: "🐘", color: "bg-blue-100 border-blue-300 text-blue-900" }
];

interface SortingGameProps {
  onComplete: (stars: number) => void;
}

export const SortingGame: React.FC<SortingGameProps> = ({ onComplete }) => {
  const [items, setItems] = useState<SortingItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [swapCount, setSwapCount] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    shuffleItems();
  }, []);

  const shuffleItems = () => {
    sound.playPop();
    const shuffled = [...initialItems].sort(() => Math.random() - 0.5);
    // Ensure it's not already sorted
    const alreadySorted = shuffled.every((item, i) => i === 0 || item.value >= shuffled[i - 1].value);
    if (alreadySorted) {
      const tmp = shuffled[0];
      shuffled[0] = shuffled[1];
      shuffled[1] = tmp;
    }
    setItems(shuffled);
    setSelectedIdx(null);
    setSwapCount(0);
    setIsSorted(false);
    setIsAutoPlaying(false);
  };

  const handleCardClick = (idx: number) => {
    if (isSorted || isAutoPlaying) return;
    sound.playPop();

    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      // Swap the two items
      const newItems = [...items];
      const temp = newItems[selectedIdx];
      newItems[selectedIdx] = newItems[idx];
      newItems[idx] = temp;

      setItems(newItems);
      setSelectedIdx(null);
      setSwapCount((c) => c + 1);

      // Check if sorted now
      const checkSorted = newItems.every((it, i) => i === 0 || it.value >= newItems[i - 1].value);
      if (checkSorted) {
        sound.playSuccess();
        setIsSorted(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
        onComplete(2);
      }
    }
  };

  // Demo computer bubble sort in action!
  const runAutoBubbleSort = async () => {
    if (isSorted || isAutoPlaying) return;
    setIsAutoPlaying(true);
    setSelectedIdx(null);

    const arr = [...items];
    const n = arr.length;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setSelectedIdx(j);
        sound.playStep();
        await sleep(600);

        if (arr[j].value > arr[j + 1].value) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setItems([...arr]);
          setSwapCount((c) => c + 1);
          sound.playPop();
          await sleep(600);
        }
      }
    }

    setSelectedIdx(null);
    setIsAutoPlaying(false);
    setIsSorted(true);
    sound.playSuccess();
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
      {/* Header */}
      <div className="pb-4 border-b border-amber-100 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
            มินิเกมพิเศษ
          </span>
          <span className="text-xs text-slate-500 font-medium">
            การจัดเรียงลำดับ (Sorting Algorithm)
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
          กล่องปริศนา: เรียงลำดับสัตว์ตัวน้อยตามขนาด
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          แตะที่การ์ด 2 ใบเพื่อสลับที่กัน จัดเรียงให้สัตว์ตัวเล็กที่สุดอยู่ซ้าย และตัวใหญ่ที่สุดอยู่ขวา!
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Swap Counter and Info */}
        <div className="flex items-center justify-between w-full mb-4 text-xs sm:text-sm font-semibold text-slate-600">
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl">
            สลับตำแหน่งไปแล้ว: <strong className="text-slate-800">{swapCount}</strong> ครั้ง
          </span>

          <span className="text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            น้อย ➔ มาก (1 ➔ 9)
          </span>
        </div>

        {/* The 5 Cards */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full py-4">
          {items.map((item, idx) => {
            const isSelected = selectedIdx === idx;

            return (
              <button
                key={item.id}
                onClick={() => handleCardClick(idx)}
                disabled={isSorted || isAutoPlaying}
                className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'ring-4 ring-amber-400 -translate-y-2 shadow-lg bg-amber-50 border-amber-400'
                    : item.color
                } hover:shadow-md active:scale-95`}
              >
                <span className="text-3xl sm:text-4xl animate-float">{item.emoji}</span>
                <span className="text-xs sm:text-sm font-bold mt-2">{item.name}</span>
                <span className="text-[11px] font-semibold opacity-75">เบอร์ {item.value}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={shuffleItems}
            disabled={isAutoPlaying}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>สลับการ์ดใหม่</span>
          </button>

          <button
            onClick={runAutoBubbleSort}
            disabled={isSorted || isAutoPlaying}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            title="ดูคอมพิวเตอร์เรียงลำดับแบบ Bubble Sort"
          >
            <Play className="w-4 h-4" />
            <span>{isAutoPlaying ? 'คอมพิวเตอร์กำลังจัดเรียง...' : 'ดูอัลกอริทึมจัดเรียงอัตโนมัติ'}</span>
          </button>
        </div>

        {/* Success Banner */}
        {isSorted && (
          <div className="w-full mt-6 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-lg mb-1">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <span>เรียงลำดับถูกต้องสมบูรณ์แบบ! 🎉</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-700">
              คอมพิวเตอร์ใช้วิธีเปรียบเทียบทีละคู่แล้วสลับที่แบบนี้แหละครับ เรียกว่า Bubble Sort!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
