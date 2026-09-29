import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Briefcase,
  BookOpen,
  DollarSign,
  Target,
  Clock,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const LifeOverviewBar: React.FC = () => {
  const { lifeState, setActiveSection } = useLifeOS();

  const remainingFinance = lifeState.finance.monthlyIncome - lifeState.finance.monthlyExpenses;
  const avgLearning = Math.round(
    lifeState.learning.reduce((acc, curr) => acc + curr.progress, 0) / (lifeState.learning.length || 1)
  );

  const careerStatusText =
    lifeState.career.mode === 'exam_mode'
      ? 'Exam Mode'
      : lifeState.career.mode === 'vacation_sprint'
      ? 'Vacation Sprint'
      : 'On Track';

  const careerStatusColor =
    lifeState.career.mode === 'exam_mode'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : lifeState.career.mode === 'vacation_sprint'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-[#DDF3E4] text-emerald-800 border-emerald-200';

  return (
    <section className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
          <h2 className="text-sm font-extrabold tracking-wide uppercase text-stone-500">
            My Life Right Now
          </h2>
        </div>
        <p className="text-xs text-stone-500 font-medium">
          LifeOS coordinates how your schedule and finances support your goals.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Career Status */}
        <div 
          onClick={() => setActiveSection('career')}
          className="p-3.5 rounded-2xl bg-[#E9DDFB]/30 hover:bg-[#E9DDFB]/50 border border-purple-100/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Career</span>
            <Briefcase className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${careerStatusColor}`}>
              {careerStatusText}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 mt-1 truncate">{lifeState.career.targetRole}</p>
        </div>

        {/* Learning */}
        <div 
          onClick={() => setActiveSection('learning')}
          className="p-3.5 rounded-2xl bg-[#DCEBFA]/30 hover:bg-[#DCEBFA]/50 border border-blue-100/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Learning</span>
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-lg font-extrabold text-stone-900 leading-none">{avgLearning}%</p>
          <p className="text-[10px] text-stone-500 mt-1">{lifeState.learning.length} active skills</p>
        </div>

        {/* Finance */}
        <div 
          onClick={() => setActiveSection('finance')}
          className="p-3.5 rounded-2xl bg-[#DDF3E4]/30 hover:bg-[#DDF3E4]/50 border border-emerald-100/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Finance</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-lg font-extrabold text-stone-900 leading-none">
            ₹{remainingFinance.toLocaleString()}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">Surplus / month</p>
        </div>

        {/* Goals */}
        <div 
          onClick={() => setActiveSection('goals')}
          className="p-3.5 rounded-2xl bg-[#F7DCE5]/30 hover:bg-[#F7DCE5]/50 border border-rose-100/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Goals</span>
            <Target className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-lg font-extrabold text-stone-900 leading-none">
            {lifeState.goals.length} Active
          </p>
          <p className="text-[10px] text-stone-500 mt-1">1 priority milestone</p>
        </div>

        {/* This Week Available */}
        <div 
          onClick={() => setActiveSection('schedule')}
          className="p-3.5 rounded-2xl bg-[#FBE4D5]/30 hover:bg-[#FBE4D5]/50 border border-orange-100/70 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">This Week</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-lg font-extrabold text-stone-900 leading-none">
            {lifeState.schedule.weeklyAvailableHours}h
          </p>
          <p className="text-[10px] text-stone-500 mt-1">Available for prep</p>
        </div>

        {/* Deadlines */}
        <div 
          onClick={() => setActiveSection('schedule')}
          className="p-3.5 rounded-2xl bg-[#FFF9F2] hover:bg-stone-50 border border-stone-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Upcoming</span>
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <p className="text-lg font-extrabold text-stone-900 leading-none">
            {lifeState.schedule.deadlines.length} Due
          </p>
          <p className="text-[10px] text-stone-500 mt-1">Assignments & goals</p>
        </div>
      </div>
    </section>
  );
};
