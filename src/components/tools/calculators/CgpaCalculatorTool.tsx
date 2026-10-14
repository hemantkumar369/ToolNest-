import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, RotateCcw } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
}

export const CgpaCalculatorTool: React.FC = () => {
  const [scale, setScale] = useState<'10' | '4'>('10');
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Computer Networks', credits: 4, gradePoint: 9 },
    { id: '2', name: 'Algorithms & Data Structures', credits: 4, gradePoint: 10 },
    { id: '3', name: 'Database Management', credits: 3, gradePoint: 8 },
    { id: '4', name: 'Operating Systems', credits: 3, gradePoint: 9 },
  ]);

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: `Course ${prev.length + 1}`,
        credits: 3,
        gradePoint: scale === '10' ? 8 : 3.5,
      }
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, val: any) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const totalCredits = courses.reduce((acc, c) => acc + (c.credits || 0), 0);
  const totalWeightedPoints = courses.reduce((acc, c) => acc + (c.credits * c.gradePoint || 0), 0);
  const gpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  const percentage = scale === '10' ? gpa * 9.5 : (gpa / 4) * 100;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Scale Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Grading Scale</span>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setScale('10')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${scale === '10' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              10-Point Scale (CBSE / Indian Universities)
            </button>
            <button
              onClick={() => setScale('4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${scale === '4' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              4.0 Scale (US / International)
            </button>
          </div>
        </div>

        <button
          onClick={addCourse}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-3">
        {courses.map((course, idx) => (
          <div key={course.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs font-bold flex items-center justify-center text-slate-500 shrink-0">
              {idx + 1}
            </span>
            <input
              type="text"
              value={course.name}
              onChange={e => updateCourse(course.id, 'name', e.target.value)}
              placeholder="Course Name"
              className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
            />
            <div className="flex items-center gap-2">
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={course.credits}
                  onChange={e => updateCourse(course.id, 'credits', Number(e.target.value))}
                  placeholder="Credits"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-center font-bold"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={scale === '10' ? 10 : 4}
                  value={course.gradePoint}
                  onChange={e => updateCourse(course.id, 'gradePoint', Number(e.target.value))}
                  placeholder="Grade"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-center font-bold"
                />
              </div>
              <button
                onClick={() => removeCourse(course.id)}
                disabled={courses.length <= 1}
                className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GPA & Percentage Results Card */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-100 font-bold block">Calculated Grade Point Average</span>
          <div className="text-4xl sm:text-5xl font-black mt-1">
            {gpa.toFixed(2)} <span className="text-lg font-medium text-blue-100">/ {scale}</span>
          </div>
          <span className="text-xs text-blue-100 mt-1 block">Based on {totalCredits} total credit units</span>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl text-center border border-white/20 sm:w-56">
          <span className="text-[11px] uppercase tracking-wider text-blue-100 font-semibold block">Equivalent Percentage</span>
          <div className="text-2xl font-black mt-1">{percentage.toFixed(1)}%</div>
          <span className="text-[10px] text-blue-200 mt-0.5 block">
            {scale === '10' ? 'Formula: CGPA × 9.5' : 'Formula: (GPA ÷ 4) × 100'}
          </span>
        </div>
      </div>
    </div>
  );
};
