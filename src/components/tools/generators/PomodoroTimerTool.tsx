import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Volume2, Sparkles } from 'lucide-react';

export const PomodoroTimerTool: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  const getDuration = (m: 'focus' | 'shortBreak' | 'longBreak') => {
    switch (m) {
      case 'focus': return 25 * 60;
      case 'shortBreak': return 5 * 60;
      case 'longBreak': return 15 * 60;
    }
  };

  const handleModeSwitch = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getDuration(newMode));
  };

  // Play pleasant synthesized chime via Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio context might be restricted
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playChime();
      setIsRunning(false);
      if (mode === 'focus') {
        const nextCount = sessionsCompleted + 1;
        setSessionsCompleted(nextCount);
        if (nextCount % 4 === 0) {
          handleModeSwitch('longBreak');
        } else {
          handleModeSwitch('shortBreak');
        }
      } else {
        handleModeSwitch('focus');
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode, sessionsCompleted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8 text-center">
      {/* Mode Switcher */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleModeSwitch('focus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'focus' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => handleModeSwitch('shortBreak')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => handleModeSwitch('longBreak')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'longBreak' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Main Big Countdown Timer */}
      <div className="py-6">
        <div className="font-mono text-7xl sm:text-9xl font-black text-slate-900 tracking-tight select-none">
          {formatTime(timeLeft)}
        </div>
        <p className="text-xs text-slate-500 font-semibold mt-2 uppercase tracking-wider">
          {mode === 'focus' ? 'Stay deeply focused on your single task' : 'Relax, stretch, and grab some water'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-md flex items-center gap-2 cursor-pointer transition-all ${
            isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700 scale-105'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl cursor-pointer transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Session counter */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Completed Focus Sessions Today: <strong className="text-slate-900">{sessionsCompleted}</strong></span>
      </div>
    </div>
  );
};
