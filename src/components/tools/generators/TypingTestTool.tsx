import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';

const SAMPLE_TEXT = `The art of rapid typing lies in maintaining fluid muscle memory and consistent rhythm. When your fingers glide across the keys with confidence, your cognitive load shifts entirely from mechanical keystrokes to deep creative expression and analytical thinking. Practice precision and speed will naturally follow.`;

export const TypingTestTool: React.FC = () => {
  const [duration, setDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [typedInput, setTypedInput] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (hasStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (hasStarted && timeLeft === 0) {
      setIsFinished(true);
      setHasStarted(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasStarted, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasStarted && !isFinished) {
      setHasStarted(true);
    }
    setTypedInput(e.target.value);
  };

  const resetTest = (d = duration) => {
    setDuration(d);
    setTimeLeft(d);
    setHasStarted(false);
    setIsFinished(false);
    setTypedInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Metrics calculation
  const totalChars = typedInput.length;
  let correctChars = 0;
  for (let i = 0; i < totalChars; i++) {
    if (typedInput[i] === SAMPLE_TEXT[i]) correctChars++;
  }

  const elapsedSeconds = duration - timeLeft || 1;
  const wpm = Math.round((correctChars / 5) / (elapsedSeconds / 60));
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Test duration selector & stats header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex gap-2">
          <button
            onClick={() => resetTest(60)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              duration === 60 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            1 Minute Challenge
          </button>
          <button
            onClick={() => resetTest(180)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
              duration === 180 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            3 Minute Challenge
          </button>
        </div>

        <div className="flex items-center gap-6 text-center font-bold">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Time Left</span>
            <span className="text-xl font-mono text-slate-900">{timeLeft}s</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Speed</span>
            <span className="text-xl text-blue-600">{wpm} WPM</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
            <span className="text-xl text-emerald-600">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Target prompt snippet with character-by-character coloring */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm sm:text-base leading-relaxed tracking-wide select-none">
        {SAMPLE_TEXT.split('').map((char, index) => {
          let color = 'text-slate-400';
          if (index < typedInput.length) {
            color = typedInput[index] === char ? 'text-emerald-600 font-bold' : 'text-rose-500 bg-rose-100 rounded';
          } else if (index === typedInput.length) {
            color = 'text-blue-600 underline font-bold';
          }
          return <span key={index} className={color}>{char}</span>;
        })}
      </div>

      {/* Keystrokes Input */}
      {!isFinished ? (
        <div>
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            placeholder={hasStarted ? 'Keep typing...' : 'Start typing to begin timer automatically...'}
            className="w-full p-4 rounded-xl border-2 border-blue-500 font-mono text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          />
        </div>
      ) : (
        /* Results Card */
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-center space-y-4">
          <Trophy className="w-10 h-10 mx-auto text-amber-300" />
          <h3 className="text-2xl font-black">Test Completed!</h3>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <span className="text-xs text-blue-100 block">Speed</span>
              <span className="text-2xl font-black">{wpm} WPM</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <span className="text-xs text-blue-100 block">Accuracy</span>
              <span className="text-2xl font-black">{accuracy}%</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <span className="text-xs text-blue-100 block">Characters</span>
              <span className="text-2xl font-black">{correctChars}</span>
            </div>
          </div>
          <button
            onClick={() => resetTest()}
            className="px-6 py-2.5 bg-white text-blue-600 font-bold text-xs rounded-xl shadow-md hover:bg-blue-50 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
