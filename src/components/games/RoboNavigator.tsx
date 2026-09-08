import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, HelpCircle, ArrowUp, RotateCcw as TurnL, 
  RotateCw as TurnR, ArrowUpCircle, CheckCircle, Sparkles, Gem, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoboLevel } from '../../types';
import { sound } from '../../utils/audio';

interface RoboNavigatorProps {
  levels: RoboLevel[];
  onCompleteLevel: (levelId: number, starsEarned: number) => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';
type ActionType = 'forward' | 'turn_left' | 'turn_right' | 'jump';

interface CommandItem {
  id: string;
  type: ActionType;
  label: string;
}

export const RoboNavigator: React.FC<RoboNavigatorProps> = ({ levels, onCompleteLevel }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const currentLevel = levels[currentLevelIndex];

  // Robot simulation state
  const [robotPos, setRobotPos] = useState<{ x: number; y: number; dir: Direction }>({
    x: currentLevel.start.x,
    y: currentLevel.start.y,
    dir: currentLevel.start.dir,
  });

  const [collectedGems, setCollectedGems] = useState<{ x: number; y: number }[]>([]);
  const [commands, setCommands] = useState<CommandItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeCommandIdx, setActiveCommandIdx] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'running' | 'won' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showHint, setShowHint] = useState(false);

  // Reset when level changes
  useEffect(() => {
    resetLevel();
  }, [currentLevelIndex]);

  const resetLevel = () => {
    setRobotPos({
      x: currentLevel.start.x,
      y: currentLevel.start.y,
      dir: currentLevel.start.dir,
    });
    setCollectedGems([]);
    setIsRunning(false);
    setActiveCommandIdx(null);
    setGameStatus('idle');
    setStatusMessage('');
  };

  const addCommand = (type: ActionType, label: string) => {
    if (isRunning) return;
    if (currentLevel.maxBlocks && commands.length >= currentLevel.maxBlocks) {
      sound.playError();
      setStatusMessage(`จำกัดคำสั่งไม่เกิน ${currentLevel.maxBlocks} บล็อกครับ!`);
      return;
    }
    sound.playPop();
    setCommands((prev) => [...prev, { id: Math.random().toString(), type, label }]);
    setStatusMessage('');
  };

  const removeCommand = (index: number) => {
    if (isRunning) return;
    sound.playPop();
    setCommands((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearAllCommands = () => {
    if (isRunning) return;
    sound.playPop();
    setCommands([]);
    resetLevel();
  };

  // Run the algorithm simulation step-by-step
  const runProgram = async () => {
    if (commands.length === 0) {
      sound.playError();
      setStatusMessage('โปรดเลือกบล็อกคำสั่งอย่างน้อย 1 คำสั่งก่อนเริ่มครับ!');
      return;
    }

    // Reset position first
    resetLevel();
    setIsRunning(true);
    setGameStatus('running');
    setStatusMessage('น้องโรโบกำลังรันคำสั่งทีละขั้นตอน...');

    let curX = currentLevel.start.x;
    let curY = currentLevel.start.y;
    let curDir = currentLevel.start.dir;
    let currentGems: { x: number; y: number }[] = [];

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < commands.length; i++) {
      setActiveCommandIdx(i);
      const cmd = commands[i];

      await sleep(550);

      if (cmd.type === 'turn_left') {
        sound.playStep();
        if (curDir === 'up') curDir = 'left';
        else if (curDir === 'left') curDir = 'down';
        else if (curDir === 'down') curDir = 'right';
        else if (curDir === 'right') curDir = 'up';
      } else if (cmd.type === 'turn_right') {
        sound.playStep();
        if (curDir === 'up') curDir = 'right';
        else if (curDir === 'right') curDir = 'down';
        else if (curDir === 'down') curDir = 'left';
        else if (curDir === 'left') curDir = 'up';
      } else if (cmd.type === 'forward' || cmd.type === 'jump') {
        const stepDist = cmd.type === 'jump' ? 2 : 1;
        let nextX = curX;
        let nextY = curY;

        if (curDir === 'right') nextX += stepDist;
        if (curDir === 'left') nextX -= stepDist;
        if (curDir === 'down') nextY += stepDist;
        if (curDir === 'up') nextY -= stepDist;

        // Check boundary
        if (
          nextX < 0 ||
          nextX >= currentLevel.gridSize.cols ||
          nextY < 0 ||
          nextY >= currentLevel.gridSize.rows
        ) {
          sound.playError();
          setIsRunning(false);
          setGameStatus('failed');
          setStatusMessage('โอ๊ะโอ! น้องโรโบเดินชนขอบแผนที่ ลองปรับคำสั่งดูใหม่นะ!');
          return;
        }

        // If regular forward, check obstacle
        if (cmd.type === 'forward') {
          const hitObstacle = currentLevel.obstacles.find((o) => o.x === nextX && o.y === nextY);
          if (hitObstacle) {
            sound.playError();
            setIsRunning(false);
            setGameStatus('failed');
            setStatusMessage(
              hitObstacle.type === 'rock'
                ? 'อุ๊ย! เดินชนก้อนหิน! ต้องเลี้ยวหลบหรือหาทางอ้อมนะ'
                : 'ระวัง! เดินตกแอ่งน้ำ! ต้องใช้คำสั่งกระโดดข้ามนะ'
            );
            return;
          }
        }

        // If jump, check if landing spot is an obstacle
        if (cmd.type === 'jump') {
          const landingObs = currentLevel.obstacles.find((o) => o.x === nextX && o.y === nextY);
          if (landingObs) {
            sound.playError();
            setIsRunning(false);
            setGameStatus('failed');
            setStatusMessage('กระโดดแล้วลงบนสิ่งกีดขวางพอดี! ลองกะระยะดูใหม่นะ');
            return;
          }
        }

        sound.playStep();
        curX = nextX;
        curY = nextY;
      }

      // Check gem collection
      const gemAtPos = currentLevel.gems.find(
        (g) => g.x === curX && g.y === curY && !currentGems.some((cg) => cg.x === g.x && cg.y === g.y)
      );
      if (gemAtPos) {
        sound.playCollect();
        currentGems.push(gemAtPos);
        setCollectedGems([...currentGems]);
      }

      // Update state for UI
      setRobotPos({ x: curX, y: curY, dir: curDir });
    }

    // Check completion condition
    await sleep(300);
    setIsRunning(false);
    setActiveCommandIdx(null);

    const isAtTarget = curX === currentLevel.target.x && curY === currentLevel.target.y;
    const hasAllGems = currentGems.length === currentLevel.gems.length;

    if (isAtTarget && hasAllGems) {
      sound.playSuccess();
      setGameStatus('won');
      setStatusMessage('🎉 ยอดเยี่ยมมาก! น้องโรโบไปถึงธงชัยชนะและเก็บพลังงานครบถ้วน!');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      onCompleteLevel(currentLevel.id, 2);
    } else if (isAtTarget && !hasAllGems) {
      sound.playError();
      setGameStatus('failed');
      setStatusMessage('ถึงเส้นชัยแล้ว แต่ยังเก็บอัญมณีไม่ครบเลย ลองวางแผนเก็บให้ครบนะ!');
    } else {
      sound.playError();
      setGameStatus('failed');
      setStatusMessage('ยังไม่ถึงเส้นชัยเลยครับ ลองเพิ่มคำสั่งหรือตรวจสอบทิศทางอีกครั้งนะ!');
    }
  };

  // Helper icon for direction
  const getDirDegree = (dir: Direction) => {
    switch (dir) {
      case 'right': return 0;
      case 'down': return 90;
      case 'left': return 180;
      case 'up': return 270;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
      {/* Level Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              ด่านที่ {currentLevel.id} จาก {levels.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              เกมพาน้องโรโบไปเก็บสมบัติ (Sequencing)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {currentLevel.title}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">{currentLevel.story}</p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {levels.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => {
                if (!isRunning) {
                  sound.playPop();
                  setCurrentLevelIndex(idx);
                }
              }}
              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                currentLevelIndex === idx
                  ? 'bg-amber-500 text-white shadow-xs scale-105'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Layout: Grid on Left, Code Blocks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* The Grid Canvas (7 columns on large) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div 
            className="p-4 sm:p-5 bg-gradient-to-b from-amber-50/80 to-orange-50/50 rounded-2xl border-2 border-amber-200 shadow-inner w-full flex items-center justify-center"
            style={{ minHeight: '340px' }}
          >
            <div 
              className="grid gap-2 sm:gap-2.5"
              style={{
                gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(46px, 64px))`,
                gridTemplateRows: `repeat(${currentLevel.gridSize.rows}, minmax(46px, 64px))`,
              }}
            >
              {Array.from({ length: currentLevel.gridSize.rows }).map((_, r) =>
                Array.from({ length: currentLevel.gridSize.cols }).map((_, c) => {
                  const isStart = currentLevel.start.x === c && currentLevel.start.y === r;
                  const isTarget = currentLevel.target.x === c && currentLevel.target.y === r;
                  const isRobotHere = robotPos.x === c && robotPos.y === r;
                  const gemHere = currentLevel.gems.find(
                    (g) => g.x === c && g.y === r && !collectedGems.some((cg) => cg.x === c && cg.y === r)
                  );
                  const obstacleHere = currentLevel.obstacles.find((o) => o.x === c && o.y === r);

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`relative rounded-xl border flex items-center justify-center transition-all duration-300 select-none ${
                        isTarget
                          ? 'bg-emerald-100 border-emerald-300 shadow-sm'
                          : obstacleHere?.type === 'rock'
                          ? 'bg-stone-200 border-stone-300'
                          : obstacleHere?.type === 'water'
                          ? 'bg-sky-200 border-sky-300'
                          : 'bg-white border-amber-100/80 hover:border-amber-200'
                      }`}
                    >
                      {/* Cell Coordinate hint (faint) */}
                      <span className="absolute bottom-0.5 right-1 text-[9px] text-slate-300 pointer-events-none">
                        {c},{r}
                      </span>

                      {/* Target Flag */}
                      {isTarget && (
                        <div className="flex flex-col items-center justify-center text-emerald-600 animate-bounce">
                          <span className="text-xl">🏁</span>
                        </div>
                      )}

                      {/* Gems */}
                      {gemHere && !isRobotHere && (
                        <div className="text-amber-500 animate-pulse drop-shadow-sm">
                          <Gem className="w-6 h-6 fill-amber-300 text-amber-500" />
                        </div>
                      )}

                      {/* Obstacles */}
                      {obstacleHere && (
                        <div className="flex flex-col items-center justify-center">
                          {obstacleHere.type === 'rock' ? (
                            <span className="text-2xl" title="ก้อนหิน">🪨</span>
                          ) : (
                            <span className="text-2xl" title="แอ่งน้ำ">💧</span>
                          )}
                        </div>
                      )}

                      {/* Robot Character */}
                      {isRobotHere && (
                        <div
                          className="absolute z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md transition-all duration-300"
                          style={{
                            transform: `rotate(${getDirDegree(robotPos.dir)}deg)`,
                          }}
                        >
                          <span className="text-lg">🤖</span>
                          {/* Eye / nose pointer */}
                          <div className="absolute -right-1 w-2 h-2 bg-amber-300 rounded-full border border-white" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Gem Collection Progress & Status Banner */}
          <div className="w-full mt-4 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-medium text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <Gem className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>
                เก็บอัญมณี: {collectedGems.length} / {currentLevel.gems.length}
              </span>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-amber-700 bg-white border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-xl transition-all"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>{showHint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้'}</span>
            </button>
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="w-full mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start gap-2 animate-fadeIn">
              <span className="text-lg">💡</span>
              <div>
                <p className="font-bold text-amber-800">คำใบ้จากพี่โรโบ:</p>
                <p>{currentLevel.hint}</p>
              </div>
            </div>
          )}

          {/* Game Outcome Message */}
          {statusMessage && (
            <div
              className={`w-full mt-3 p-3 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2 border ${
                gameStatus === 'won'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : gameStatus === 'failed'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {gameStatus === 'won' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : gameStatus === 'failed' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* The Coding Blocks Panel (5 columns on large) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Palette of Allowed Commands */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              คลังบล็อกคำสั่ง (คลิกเพื่อเพิ่มลงโปรแกรม)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {currentLevel.allowedBlocks.includes('forward') && (
                <button
                  onClick={() => addCommand('forward', 'เดินหน้า')}
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>เดินหน้า</span>
                </button>
              )}

              {currentLevel.allowedBlocks.includes('turn_left') && (
                <button
                  onClick={() => addCommand('turn_left', 'หันซ้าย')}
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  <TurnL className="w-4 h-4" />
                  <span>หันซ้าย</span>
                </button>
              )}

              {currentLevel.allowedBlocks.includes('turn_right') && (
                <button
                  onClick={() => addCommand('turn_right', 'หันขวา')}
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  <TurnR className="w-4 h-4" />
                  <span>หันขวา</span>
                </button>
              )}

              {currentLevel.allowedBlocks.includes('jump') && (
                <button
                  onClick={() => addCommand('jump', 'กระโดดข้าม')}
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>กระโดดข้าม</span>
                </button>
              )}
            </div>
          </div>

          {/* Program Sequence Workspace */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border-2 border-dashed border-amber-300 min-h-[200px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900">
                  โปรแกรมของน้อง ({commands.length} คำสั่ง)
                </span>
                {commands.length > 0 && (
                  <button
                    onClick={clearAllCommands}
                    disabled={isRunning}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline"
                  >
                    ล้างคำสั่งทั้งหมด
                  </button>
                )}
              </div>

              {commands.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs sm:text-sm flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">🧩</span>
                  <span>ยังไม่มีคำสั่งเลย กดเลือกบล็อกด้านบนเพื่อเริ่มเขียนโปรแกรมได้เลยครับ!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {commands.map((cmd, idx) => (
                    <div
                      key={cmd.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeCommandIdx === idx
                          ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-500 scale-102'
                          : cmd.type === 'forward'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : cmd.type === 'turn_left'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : cmd.type === 'turn_right'
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                          : 'bg-purple-100 text-purple-900 border border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{cmd.label}</span>
                      </div>
                      {!isRunning && (
                        <button
                          onClick={() => removeCommand(idx)}
                          className="w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center text-slate-500 hover:text-slate-800"
                          title="ลบคำสั่งนี้"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run & Reset Controls */}
            <div className="pt-4 border-t border-amber-200/80 flex items-center gap-2 mt-3">
              <button
                id="robo-run-btn"
                onClick={runProgram}
                disabled={isRunning || commands.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-bold text-sm sm:text-base py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{isRunning ? 'กำลังทำงาน...' : 'รันคำสั่ง (Run)'}</span>
              </button>

              <button
                onClick={resetLevel}
                disabled={isRunning}
                className="p-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors"
                title="รีเซ็ตตำแหน่ง"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
