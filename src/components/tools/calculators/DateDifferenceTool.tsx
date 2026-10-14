import React, { useState } from 'react';
import { CalendarRange } from 'lucide-react';

export const DateDifferenceTool: React.FC = () => {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [includeEndDay, setIncludeEndDay] = useState(false);

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  const calculateDiff = () => {
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (includeEndDay) diffDays += 1;

    // Working days calculation
    let workingDays = 0;
    const cur = new Date(start);
    while (cur < end || (includeEndDay && cur.toDateString() === end.toDateString())) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) workingDays++;
      cur.setDate(cur.getDate() + 1);
    }

    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const totalHours = diffDays * 24;

    return {
      diffDays,
      workingDays,
      weeks,
      remainingDays,
      months,
      totalHours,
    };
  };

  const diff = calculateDiff();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="include-end-day"
          checked={includeEndDay}
          onChange={e => setIncludeEndDay(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
        />
        <label htmlFor="include-end-day" className="text-xs font-semibold text-slate-700 cursor-pointer">
          Include end day in calculation (+1 day)
        </label>
      </div>

      {diff && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-center shadow-md">
            <span className="text-xs uppercase tracking-wider text-blue-100 font-bold block">Total Duration</span>
            <div className="text-4xl sm:text-5xl font-black mt-2">
              {diff.diffDays.toLocaleString()} <span className="text-xl font-normal text-blue-100">days</span>
            </div>
            <p className="text-xs text-blue-100 mt-2">
              Equivalent to {diff.weeks} weeks and {diff.remainingDays} days
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[11px] text-emerald-700 font-bold block">Business Working Days</span>
              <span className="text-2xl font-black text-emerald-800">{diff.workingDays.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Excludes Sat & Sun</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-bold block">Total Hours</span>
              <span className="text-2xl font-black text-slate-800">{diff.totalHours.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-bold block">Approx. Months</span>
              <span className="text-2xl font-black text-slate-800">~{diff.months}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
