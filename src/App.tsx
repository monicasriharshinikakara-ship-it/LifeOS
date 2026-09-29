/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LifeOverviewBar } from './components/dashboard/LifeOverviewBar';
import { AIFocusCard } from './components/dashboard/AIFocusCard';
import { TodayOverview } from './components/dashboard/TodayOverview';
import { GoalsView } from './components/goals/GoalsView';
import { LearningView } from './components/learning/LearningView';
import { CareerView } from './components/career/CareerView';
import { FinanceView } from './components/finance/FinanceView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { ProgressView } from './components/progress/ProgressView';
import { AIAgentView } from './components/ai/AIAgentView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { Sparkles, ArrowRight, Check, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeSection, setActiveSection, proposedChange, applyProposedChange, cancelProposedChange } = useLifeOS();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-purple-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Global AI Action Notification Banner if changes were proposed while outside AI tab */}
      {proposedChange && activeSection !== 'ai' && (
        <div className="bg-gradient-to-r from-purple-100 via-amber-100 to-emerald-100 border-b border-purple-200 px-4 py-2.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-stone-800">
              <span className="p-1 rounded-md bg-purple-200 text-purple-900 font-bold shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold">{proposedChange.title}:</span>
              <span className="truncate max-w-md">{proposedChange.description}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveSection('ai')}
                className="font-bold underline text-purple-950 px-2 hover:text-purple-700"
              >
                Inspect in AI
              </button>
              <button
                onClick={cancelProposedChange}
                className="p-1 rounded-md text-stone-500 hover:text-stone-800 hover:bg-white/50"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyProposedChange(proposedChange)}
                className="px-3 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center gap-1 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apply Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Body with Sidebar + View Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <LifeOverviewBar />
              <AIFocusCard />
              <TodayOverview />
            </div>
          )}

          {activeSection === 'goals' && <GoalsView />}
          {activeSection === 'learning' && <LearningView />}
          {activeSection === 'career' && <CareerView />}
          {activeSection === 'finance' && <FinanceView />}
          {activeSection === 'schedule' && <ScheduleView />}
          {activeSection === 'progress' && <ProgressView />}
          {activeSection === 'ai' && <AIAgentView />}
        </main>
      </div>

      {/* Onboarding / Setup Modal */}
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <LifeOSProvider>
      <MainContent />
    </LifeOSProvider>
  );
}
