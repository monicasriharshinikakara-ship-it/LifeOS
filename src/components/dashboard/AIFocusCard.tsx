import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2, Link2 } from 'lucide-react';

export const AIFocusCard: React.FC = () => {
  const { lifeState, setActiveSection, refreshAIFocus, isAiThinking } = useLifeOS();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E9DDFB]/60 via-[#FFF9F2] to-[#DCEBFA]/50 border border-purple-200/80 p-6 shadow-sm">
      {/* Decorative background blur glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-purple-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-40 h-40 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-purple-200 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-700 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-stone-900 tracking-tight">AI Focus</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                Weekly Synthesis
              </span>
            </div>
            <p className="text-xs text-stone-500">Cross-referencing schedule, coursework, and internship roadmap</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={refreshAIFocus}
            disabled={isAiThinking}
            title="Refresh AI Focus"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-white/80 border border-stone-200/60 text-xs flex items-center gap-1 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiThinking ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline text-[11px] font-medium">Re-evaluate</span>
          </button>

          <button
            onClick={() => setActiveSection('ai')}
            className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask LifeOS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main AI Summary Quote */}
      <div className="p-4 rounded-2xl bg-white/90 border border-purple-100 shadow-2xs space-y-3">
        <blockquote className="text-stone-800 font-medium text-sm md:text-base leading-relaxed">
          "{lifeState.aiFocus.summary}"
        </blockquote>

        {/* Relationship Insight Callout */}
        <div className="flex items-start gap-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <div className="p-1 rounded-lg bg-indigo-50 text-indigo-700 mt-0.5">
            <Link2 className="w-3 h-3" />
          </div>
          <div>
            <span className="font-bold text-stone-800">Interconnected Reality: </span>
            <span>{lifeState.aiFocus.relationshipInsight}</span>
          </div>
        </div>
      </div>

      {/* Top 3 Focus Priorities this week */}
      <div className="mt-4 pt-4 border-t border-purple-100/70 grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {lifeState.aiFocus.topPriorities.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-white/60 border border-stone-200/50 flex items-center gap-2 text-xs font-semibold text-stone-700"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
