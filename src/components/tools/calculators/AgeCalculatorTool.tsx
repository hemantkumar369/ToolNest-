import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Heart } from 'lucide-react';

export const AgeCalculatorTool: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const bDate = new Date(birthDate);
  const tDate = new Date(targetDate);

  const calculateAge = () => {
    if (isNaN(bDate.getTime()) || isNaN(tDate.getTime()) || bDate > tDate) {
      return null;
    }

    let years = tDate.getFullYear() - bDate.getFullYear();
    let months = tDate.getMonth() - bDate.getMonth();
    let days = tDate.getDate() - bDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(tDate.getFullYear(), tDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = tDate.getTime() - bDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next Birthday
    const currentYear = tDate.getFullYear();
    let nextBday = new Date(currentYear, bDate.getMonth(), bDate.getDate());
    if (nextBday < tDate) {
      nextBday = new Date(currentYear + 1, bDate.getMonth(), bDate.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));

    // Day of birth
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = daysOfWeek[bDate.getDay()];

    // Western Zodiac
    const m = bDate.getMonth() + 1;
    const d = bDate.getDate();
    let zodiac = 'Aries';
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) zodiac = 'Aries ♈';
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) zodiac = 'Taurus ♉';
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) zodiac = 'Gemini ♊';
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) zodiac = 'Cancer ♋';
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) zodiac = 'Leo ♌';
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) zodiac = 'Virgo ♍';
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) zodiac = 'Libra ♎';
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) zodiac = 'Scorpio ♏';
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) zodiac = 'Sagittarius ♐';
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) zodiac = 'Capricorn ♑';
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) zodiac = 'Aquarius ♒';
    else zodiac = 'Pisces ♓';

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysToNextBday,
      bornDay,
      zodiac,
    };
  };

  const ageData = calculateAge();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Age at the Date of</label>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
          />
        </div>
      </div>

      {ageData && (
        <div className="space-y-6 pt-4 border-t border-slate-100">
          {/* Main Primary Age Card */}
          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white text-center shadow-lg shadow-blue-500/15">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Chronological Age</span>
            <div className="text-3xl sm:text-5xl font-black mt-2">
              {ageData.years} <span className="text-lg sm:text-2xl font-medium text-blue-100">years</span> {ageData.months} <span className="text-lg sm:text-2xl font-medium text-blue-100">months</span> {ageData.days} <span className="text-lg sm:text-2xl font-medium text-blue-100">days</span>
            </div>
            <p className="text-xs text-blue-100 mt-2">
              Born on a <strong className="text-white">{ageData.bornDay}</strong> • Zodiac: <strong className="text-white">{ageData.zodiac}</strong>
            </p>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Total Days</span>
              <span className="text-lg font-black text-slate-800">{ageData.totalDays.toLocaleString()}</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Total Weeks</span>
              <span className="text-lg font-black text-slate-800">{ageData.totalWeeks.toLocaleString()}</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Total Hours</span>
              <span className="text-lg font-black text-slate-800">{ageData.totalHours.toLocaleString()}</span>
            </div>
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[11px] text-emerald-700 block font-semibold">Next Birthday In</span>
              <span className="text-lg font-black text-emerald-600">{ageData.daysToNextBday} days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
