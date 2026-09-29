import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { Sparkles, RotateCcw, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lifeState, resetToDemo, setActiveSection, triggerReplanning, setShowOnboarding } = useLifeOS();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => setActiveSection('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E9DDFB] to-[#DCEBFA] flex items-center justify-center shadow-xs border border-purple-200/60 transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-stone-900">LifeOS</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DDF3E4] text-emerald-800 border border-emerald-200/60">
                  System Connected
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">Your Life as One Living System</p>
            </div>
          </div>

          {/* Mobile Profile pill */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={resetToDemo}
              title="Reset Demo Data"
              className="p-2 text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-100 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Replanning Quick Demo Bar (Signature Feature) */}
        <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 bg-[#FFF9F2] border border-amber-100 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider px-2 whitespace-nowrap flex items-center gap-1">
            ⚡ Quick Demo:
          </span>

          <button
            onClick={() => triggerReplanning('exams')}
            className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 transition-all flex items-center gap-1 whitespace-nowrap shadow-2xs hover:scale-102"
            title="Simulate 2 weeks of exams"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            1. Add Exams
          </button>

          <button
            onClick={() => triggerReplanning('vacation')}
            className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 text-stone-700 hover:text-blue-900 border border-stone-200 transition-all flex items-center gap-1 whitespace-nowrap shadow-2xs hover:scale-102"
            title="Simulate 10 days of vacation"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            2. Add Vacation
          </button>

          <button
            onClick={() => triggerReplanning('course_completed')}
            className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 transition-all flex items-center gap-1 whitespace-nowrap shadow-2xs hover:scale-102"
            title="Mark Python course completed"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            3. Python Done
          </button>

          <button
            onClick={() => {
              setActiveSection('ai');
            }}
            className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#E9DDFB] hover:bg-purple-200 text-purple-900 border border-purple-200 transition-all flex items-center gap-1 whitespace-nowrap shadow-2xs hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            4. Ask LifeOS
          </button>
        </div>

        {/* Right User & Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={resetToDemo}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            Reset Demo
          </button>

          <button
            onClick={() => setShowOnboarding(true)}
            className="text-xs font-medium text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-xl bg-[#E9DDFB]/60 hover:bg-[#E9DDFB] border border-purple-200/70 transition-colors"
          >
            Setup Profile
          </button>

          <div 
            onClick={() => setActiveSection('career')}
            className="flex items-center gap-2 pl-2 border-l border-stone-200 cursor-pointer"
          >
            <img
              src={lifeState.profile.avatar}
              alt={lifeState.profile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-200"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-stone-800 leading-tight">{lifeState.profile.name}</p>
              <p className="text-[10px] text-stone-500 truncate max-w-[120px]">
                {lifeState.career.mode === 'exam_mode' ? 'Exam Mode' : lifeState.career.mode === 'vacation_sprint' ? 'Vacation Sprint' : 'Standard Mode'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
