import React, { useState } from 'react';
import { CheckSquare, AlertCircle, Sparkles } from 'lucide-react';

export const AttendanceCalculatorTool: React.FC = () => {
  const [attended, setAttended] = useState<number>(32);
  const [total, setTotal] = useState<number>(40);
  const [target, setTarget] = useState<number>(75);

  const safeAttended = Math.max(0, attended);
  const safeTotal = Math.max(safeAttended, total);
  const currentPercentage = safeTotal > 0 ? (safeAttended / safeTotal) * 100 : 0;

  // If above target: how many can you skip?
  // (attended) / (total + x) >= target/100  =>  total + x <= attended * 100 / target  => x = floor((attended * 100 / target) - total)
  let bunkCount = 0;
  if (currentPercentage >= target) {
    bunkCount = Math.floor((safeAttended * 100) / target - safeTotal);
  }

  // If below target: how many must you attend?
  // (attended + y) / (total + y) >= target/100 => 100*attended + 100*y >= target*total + target*y => y*(100 - target) >= target*total - 100*attended
  let attendCount = 0;
  if (currentPercentage < target) {
    attendCount = Math.ceil((target * safeTotal - 100 * safeAttended) / (100 - target));
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Classes Attended</label>
          <input
            type="number"
            min="0"
            max={total}
            value={attended}
            onChange={e => setAttended(Number(e.target.value))}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Classes Conducted</label>
          <input
            type="number"
            min="1"
            value={total}
            onChange={e => setTotal(Number(e.target.value))}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>Target Attendance Requirement</span>
            <span className="text-blue-600 font-extrabold">{target}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="1"
            value={target}
            onChange={e => setTarget(Number(e.target.value))}
            className="w-full accent-blue-600 mt-2"
          />
        </div>
      </div>

      {/* Main Status Display */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-sm font-semibold text-slate-700">Current Attendance Standing</span>
          <span className={`text-2xl font-black ${currentPercentage >= target ? 'text-emerald-600' : 'text-rose-600'}`}>
            {currentPercentage.toFixed(1)}%
          </span>
        </div>

        {currentPercentage >= target ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>You are safely above the {target}% threshold!</span>
            </div>
            <p className="text-sm text-emerald-900 leading-relaxed">
              You can safely bunk or skip the next <strong className="text-emerald-700 font-black text-lg">{bunkCount}</strong> class{bunkCount === 1 ? '' : 'es'} without falling below your {target}% target requirement.
            </p>
          </div>
        ) : (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Attendance Alert: Below {target}% requirement</span>
            </div>
            <p className="text-sm text-rose-900 leading-relaxed">
              You need to attend the next <strong className="text-rose-700 font-black text-lg">{attendCount}</strong> consecutive class{attendCount === 1 ? '' : 'es'} to bring your attendance back up to {target}%.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
