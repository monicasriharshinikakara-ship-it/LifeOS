import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Sparkles,
  ArrowRight,
  User,
  Target,
  Clock,
  BookOpen,
  DollarSign,
  Briefcase,
  CheckCircle2,
  X,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, completeOnboarding, resetToDemo } = useLifeOS();

  const [step, setStep] = useState<'welcome' | 'wizard'>('welcome');
  const [wizardStep, setWizardStep] = useState(1);

  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('Computer Science Student');
  const [mainGoal, setMainGoal] = useState('Get a Software Engineering Internship in 4 Months');
  const [skills, setSkills] = useState('Python, SQL, HTML/CSS');
  const [commitments, setCommitments] = useState('University Classes (25h/week)');
  const [availableHours, setAvailableHours] = useState('18');
  const [learningGoal, setLearningGoal] = useState('Data Structures & Algorithms');
  const [financialGoal, setFinancialGoal] = useState('Save ₹20,000 for emergency fund');

  if (!showOnboarding) return null;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      name: name || 'Alex',
      role,
      mainGoal,
      skills,
      commitments,
      availableHours: Number(availableHours) || 18,
      learningGoal,
      financialGoal,
    });
  };

  const handleTryDemo = () => {
    resetToDemo();
    setShowOnboarding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-stone-200 space-y-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setShowOnboarding(false)}
          className="absolute top-6 right-6 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'welcome' ? (
          /* Welcome Splash Screen */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E9DDFB] via-[#DCEBFA] to-[#DDF3E4] flex items-center justify-center mx-auto shadow-md border border-purple-200">
              <Sparkles className="w-8 h-8 text-indigo-700" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">LifeOS</h1>
              <h2 className="text-lg font-bold text-stone-700">Your life, understood as one system.</h2>
              <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Goals, career, learning, finances, and time — connected by one AI that dynamically replans as your life changes.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 text-left py-2">
              <div className="p-3.5 rounded-2xl bg-[#E9DDFB]/30 border border-purple-100 space-y-1">
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-700" />
                  Connected Roadmaps
                </span>
                <p className="text-[11px] text-stone-600">
                  Career goals break into monthly milestones tied to your free time.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#DDF3E4]/30 border border-emerald-100 space-y-1">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  Dynamic Replanning
                </span>
                <p className="text-[11px] text-stone-600">
                  Exams, vacations, or completed courses automatically adapt your plans.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setStep('wizard')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-102"
              >
                <span>Build My LifeOS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleTryDemo}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FFF9F2] hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-200 transition-colors"
              >
                Try Demo LifeOS (Alex)
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step Setup Wizard */
          <form onSubmit={handleFinish} className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  Step {wizardStep} of 2
                </span>
                <h3 className="text-lg font-extrabold text-stone-900">
                  {wizardStep === 1 ? 'Profile & Primary Objective' : 'Time & Life Commitments'}
                </h3>
              </div>
            </div>

            {wizardStep === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Current Role / Status</label>
                    <input
                      type="text"
                      placeholder="e.g. CS Student"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Main Life/Career Goal *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Get a Software Engineering Internship in 4 Months"
                    value={mainGoal}
                    onChange={(e) => setMainGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Current Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, SQL, HTML"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>Next: Schedule & Budget</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Available Hours / Week</label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={availableHours}
                      onChange={(e) => setAvailableHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">Free time for career & learning</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Primary Commitments</label>
                    <input
                      type="text"
                      value={commitments}
                      onChange={(e) => setCommitments(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Learning Subject</label>
                  <input
                    type="text"
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Financial Goal / Purchase Target</label>
                  <input
                    type="text"
                    value={financialGoal}
                    onChange={(e) => setFinancialGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate My LifeOS</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
