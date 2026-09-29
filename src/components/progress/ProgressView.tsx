import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  TrendingUp,
  Target,
  BookOpen,
  Briefcase,
  DollarSign,
  Sparkles,
  History,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { lifeState, setActiveSection } = useLifeOS();

  const avgLearning = Math.round(
    lifeState.learning.reduce((acc, curr) => acc + curr.progress, 0) / (lifeState.learning.length || 1)
  );

  const avgGoals = Math.round(
    lifeState.goals.reduce((acc, curr) => acc + curr.progress, 0) / (lifeState.goals.length || 1)
  );

  const savingsPct = Math.min(
    100,
    Math.round(
      (lifeState.finance.savingsGoal.currentAmount / lifeState.finance.savingsGoal.targetAmount) * 100
    )
  );

  // Career readiness score
  const careerScore =
    lifeState.career.mode === 'exam_mode'
      ? 68
      : lifeState.career.mode === 'vacation_sprint'
      ? 84
      : 72;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Life Progress & Trajectory</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E9DDFB] text-purple-900">
            System Equilibrium: 78/100
          </span>
        </h2>
        <p className="text-xs text-stone-500">
          Holistic view of how your life pillars move forward together without neglecting any single area.
        </p>
      </div>

      {/* AI Progress Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#E9DDFB]/60 via-[#FFF9F2] to-[#DDF3E4]/50 border border-purple-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-purple-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-700" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-purple-950">
            AI Progress Summary
          </h3>
        </div>

        <blockquote className="text-sm md:text-base font-semibold text-stone-800 leading-relaxed bg-white/80 p-4 rounded-2xl border border-purple-100">
          "{lifeState.career.mode === 'exam_mode'
            ? 'Your internship goal is progressing well, with Python verified and DSA in steady review. Your upcoming exam commitments are currently reducing available hours to 8h/week, so heavier project deployment has been gracefully scheduled for post-exams.'
            : lifeState.career.mode === 'vacation_sprint'
            ? 'Your career velocity has surged during vacation! With 34 available weekly hours, you are advancing both your full-stack portfolio build and early resume preparation 3 weeks ahead of original schedule.'
            : 'Your internship goal is progressing well at 65% skill readiness. Your current commitments match your 18h/week available target, keeping your Month 1 and Month 2 milestones on track.'}"
        </blockquote>
      </div>

      {/* 4 Pillars Progress Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goals Progress */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Life Goals</span>
            <Target className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">{avgGoals}%</p>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${avgGoals}%` }} />
          </div>
          <p className="text-[11px] text-stone-500">{lifeState.goals.length} active objectives</p>
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Skill Learning</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">{avgLearning}%</p>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${avgLearning}%` }} />
          </div>
          <p className="text-[11px] text-stone-500">{lifeState.learning.length} technical competencies</p>
        </div>

        {/* Career Readiness */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Career Readiness</span>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">{careerScore}%</p>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${careerScore}%` }} />
          </div>
          <p className="text-[11px] text-stone-500">{lifeState.career.targetRole}</p>
        </div>

        {/* Savings Progress */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Savings Buffer</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">{savingsPct}%</p>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${savingsPct}%` }} />
          </div>
          <p className="text-[11px] text-stone-500">₹{lifeState.finance.savingsGoal.currentAmount.toLocaleString()} saved</p>
        </div>
      </div>

      {/* Dynamic Replanning History Log */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            <h3 className="text-base font-extrabold text-stone-900">
              Dynamic Replanning History
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            LifeOS records every time your plan adjusted to real life events
          </span>
        </div>

        <div className="space-y-3">
          {lifeState.replanningHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-stone-900">{item.trigger}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Applied
                  </span>
                </div>
                <p className="text-xs text-stone-600">{item.explanation}</p>
                <p className="text-[11px] text-stone-400 font-medium">{item.timeDelta}</p>
              </div>

              <span className="text-[11px] text-stone-400 font-semibold shrink-0">
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
