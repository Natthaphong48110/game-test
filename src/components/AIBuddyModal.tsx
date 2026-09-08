import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { getLocalRoboAnswer } from '../utils/robotKnowledge';

interface AIBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const quickQuestions = [
  'อัลกอริทึมคืออะไร อธิบายแบบง่ายๆ หน่อย',
  'ทำไมเราต้องทำตามขั้นตอน 1-2-3 ด้วย?',
  'ยกตัวอย่างอัลกอริทึมในชีวิตประจำวันหน่อย',
  'Loop (การทำซ้ำ) มีประโยชน์ยังไงในเกม?',
];

export const AIBuddyModal: React.FC<AIBuddyModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'สวัสดีครับน้องๆ! พี่โรโบคือหุ่นยนต์ผู้ช่วยสอนเรื่องอัลกอริทึม สงสัยเรื่องขั้นตอนการคิด หรืออยากให้พี่โรโบยกตัวอย่างสนุกๆ ถามมาได้เลยนะ!',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    sound.playPop();
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        throw new Error('API failed');
      }

      const data = await res.json();
      sound.playStep();
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: data.reply || getLocalRoboAnswer(query),
        },
      ]);
    } catch {
      // Fallback for GitHub Pages static hosting or offline mode
      sound.playStep();
      const localAnswer = getLocalRoboAnswer(query);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: localAnswer,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-amber-300 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-1.5">
                พี่โรโบ AI เพื่อนคู่คิด
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-[11px] text-cyan-100">ตอบข้อสงสัยอัลกอริทึมสำหรับเด็กประถม</p>
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

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex gap-2 overflow-x-auto text-xs no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200 hover:border-cyan-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0 shadow-2xs font-medium"
            >
              💬 {q}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-amber-50/20">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-cyan-500 text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow-xs">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-amber-200/80 text-slate-800 rounded-bl-none font-medium'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-xl bg-cyan-500 text-white flex items-center justify-center text-xs shrink-0">
                🤖
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                <span>พี่โรโบกำลังคิดคำตอบให้น้องๆ อยู่นะครับ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="พิมพ์ถามพี่โรโบ เช่น ทำไมต้องมีขั้นตอน?..."
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white rounded-xl transition-all active:scale-95 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
