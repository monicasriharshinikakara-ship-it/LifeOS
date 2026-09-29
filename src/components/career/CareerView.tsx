import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  FolderGit2,
  Award,
  FileText,
  ArrowRight,
  Zap,
  RotateCcw,
} from 'lucide-react';

export const CareerView: React.FC = () => {
  const { lifeState, triggerReplanning, setActiveSection } = useLifeOS();

  const isExamMode = lifeState.career.mode === 'exam_mode';
  const isVacationSprint = lifeState.career.mode === 'vacation_sprint';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">Career Architecture</h2>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isExamMode
                  ? 'bg-amber-100 text-amber-900 border-amber-200'
                  : isVacationSprint
                  ? 'bg-blue-100 text-blue-900 border-blue-200'
                  : 'bg-[#DDF3E4] text-emerald-900 border-emerald-200'
              }`}
            >
              {isExamMode ? '⚡ Exam-Adjusted Mode' : isVacationSprint ? '🚀 Vacation Sprint Mode' : 'Standard 4-Month Mode'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Dynamic career roadmap synchronized with your university schedule and skill readiness.
          </p>
        </div>

        {/* Dynamic Replanning Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerReplanning('exams')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isExamMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-200'
                : 'bg-white hover:bg-amber-50 text-stone-700 border-stone-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Simulate Exams (2 Wks)
          </button>

          <button
            onClick={() => triggerReplanning('vacation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isVacationSprint
                ? 'bg-blue-100 text-blue-900 border-blue-300 ring-2 ring-blue-200'
                : 'bg-white hover:bg-blue-50 text-stone-700 border-stone-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            Simulate Vacation (10 Days)
          </button>

          <button
            onClick={() => triggerReplanning('course_completed')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-emerald-50 text-stone-700 border border-stone-200 transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Python Course Done
          </button>
        </div>
      </div>

      {/* Top Banner: Mode Explanation & Time Impact */}
      {(isExamMode || isVacationSprint) && (
        <div
          className={`p-4 rounded-3xl border flex items-start justify-between gap-4 ${
            isExamMode
              ? 'bg-[#FFF9F2] border-amber-200/90 text-amber-950'
              : 'bg-[#DCEBFA]/40 border-blue-200 text-blue-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${isExamMode ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                {isExamMode ? 'Dynamic Replanning: Exam Period Active' : 'Dynamic Replanning: Vacation Acceleration Active'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {isExamMode
                  ? 'Exams reduce your weekly career preparation window from 18h down to 8h. Heavy repository development is temporarily postponed; focus is shifted to lightweight 20-min daily syntax review to preserve momentum without hurting your GPA.'
                  : 'Classes are currently suspended! Your weekly capacity expands to 34h. LifeOS has dynamically accelerated your portfolio building and early resume applications by 3 weeks.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveSection('ai')}
            className="text-xs font-bold underline shrink-0 mt-1"
          >
            Discuss in AI Agent
          </button>
        </div>
      )}

      {/* Career Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E9DDFB] text-purple-900 border border-purple-200">
              Target Career Profile
            </span>
            <h3 className="text-xl font-extrabold text-stone-900 mt-1.5">{lifeState.career.targetRole}</h3>
            <p className="text-xs text-stone-500 mt-0.5">Timeline: {lifeState.career.targetTimeline}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
              <span className="text-[11px] text-stone-500 block">Projects</span>
              <span className="text-base font-extrabold text-stone-900">{lifeState.career.projectsCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
              <span className="text-[11px] text-stone-500 block">Certifications</span>
              <span className="text-base font-extrabold text-stone-900">{lifeState.career.certificationsCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-stone-500 block">Weekly Commitment</span>
              <span className="text-base font-extrabold text-stone-900">{lifeState.schedule.weeklyAvailableHours}h</span>
            </div>
          </div>
        </div>

        {/* Current Skills & Skill Gap Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Current Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {lifeState.career.currentSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#DDF3E4]/40 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>

            {/* Resume Highlights */}
            <div className="pt-3 border-t border-stone-100 space-y-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Resume Overview
              </span>
              <ul className="text-xs text-stone-600 space-y-1">
                {lifeState.career.resumeHighlights.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Skill Gap Analysis */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FFF9F2] border border-amber-200/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              AI Identified Gaps for {lifeState.career.targetRole}
            </h4>
            <p className="text-xs text-stone-600">
              LifeOS cross-references current industry internship postings with your profile to surface exact missing qualifications:
            </p>
            <div className="space-y-2 pt-1">
              {lifeState.career.skillGaps.map((gap, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-amber-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{gap}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    High Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Career Roadmap: Month 1 -> Month 2 -> Month 3 -> Month 4 */}
        <div className="pt-4 border-t border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-extrabold text-stone-900">
                Dynamic Career Roadmap
              </h4>
            </div>
            <span className="text-xs text-stone-400 font-medium">
              Adapts automatically to schedule shifts
            </span>
          </div>

          {/* Milestone Pipeline cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifeState.career.roadmap.map((milestone, idx) => {
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in_progress';

              return (
                <div
                  key={milestone.id || idx}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                    isCompleted
                      ? 'bg-[#DDF3E4]/30 border-emerald-200'
                      : isInProgress
                      ? 'bg-white border-purple-300 ring-2 ring-purple-100 shadow-xs'
                      : 'bg-stone-50/70 border-stone-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-stone-800">
                        {milestone.month}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-purple-100 text-purple-900 animate-pulse'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-stone-900 leading-snug">
                      {milestone.focus}
                    </h5>

                    <ul className="space-y-1.5 pt-2 border-t border-stone-200/50">
                      {milestone.items.map((item, i) => (
                        <li key={i} className="text-[11px] text-stone-600 flex items-start gap-1.5 leading-tight">
                          <span className="text-stone-400 font-bold">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {milestone.hoursPerWeek}h / week
                    </span>
                    <span className="text-stone-400">Phase {idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
