import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Sliders,
  X,
  Edit2,
} from 'lucide-react';
import { Goal, GoalCategory } from '../../types/lifeos';

export const GoalsView: React.FC = () => {
  const { lifeState, toggleGoalMilestone, addGoal, updateGoalProgress, setActiveSection } = useLifeOS();
  const [selectedGoalId, setSelectedGoalId] = useState<string>(lifeState.goals[0]?.id || '');
  const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('career');
  const [newTargetDate, setNewTargetDate] = useState('2026-12-31');
  const [newDescription, setNewDescription] = useState('');
  const [useAIRoadmap, setUseAIRoadmap] = useState(true);

  const selectedGoal = lifeState.goals.find((g) => g.id === selectedGoalId) || lifeState.goals[0];

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let generatedMilestones: { id: string; title: string; completed: boolean; targetMonth?: string }[] = [
      { id: `m-${Date.now()}-1`, title: 'Phase 1: Foundations & Preparation', completed: false, targetMonth: 'Month 1' },
      { id: `m-${Date.now()}-2`, title: 'Phase 2: Project Execution & Practice', completed: false, targetMonth: 'Month 2' },
      { id: `m-${Date.now()}-3`, title: 'Phase 3: Refinement & Validation', completed: false, targetMonth: 'Month 3' },
      { id: `m-${Date.now()}-4`, title: 'Phase 4: Final Outcome & Review', completed: false, targetMonth: 'Month 4' },
    ];

    if (newCategory === 'career') {
      generatedMilestones = [
        { id: `m-${Date.now()}-1`, title: 'Month 1: Technical Foundations (Python/SQL)', completed: false, targetMonth: 'Month 1' },
        { id: `m-${Date.now()}-2`, title: 'Month 2: Flagship Project & GitHub', completed: false, targetMonth: 'Month 2' },
        { id: `m-${Date.now()}-3`, title: 'Month 3: Resume + LinkedIn + Applications', completed: false, targetMonth: 'Month 3' },
        { id: `m-${Date.now()}-4`, title: 'Month 4: Technical Interviews & Offers', completed: false, targetMonth: 'Month 4' },
      ];
    } else if (newCategory === 'learning') {
      generatedMilestones = [
        { id: `m-${Date.now()}-1`, title: 'Core Syntax & Concepts (Week 1-2)', completed: false, targetMonth: 'Month 1' },
        { id: `m-${Date.now()}-2`, title: 'Intermediate Exercises & Problem Sets', completed: false, targetMonth: 'Month 2' },
        { id: `m-${Date.now()}-3`, title: 'Mini-project validation', completed: false, targetMonth: 'Month 3' },
      ];
    }

    addGoal({
      title: newTitle,
      category: newCategory,
      targetDate: newTargetDate,
      description: newDescription || `Major life objective: ${newTitle}`,
      milestones: generatedMilestones,
      isPriority: true,
    });

    setNewTitle('');
    setNewDescription('');
    setShowAddGoalModal(false);
  };

  const filteredGoals =
    filterCategory === 'all'
      ? lifeState.goals
      : lifeState.goals.filter((g) => g.category === filterCategory);

  const getCategoryBadge = (cat: GoalCategory) => {
    switch (cat) {
      case 'career':
        return 'bg-[#E9DDFB] text-purple-900 border-purple-200';
      case 'learning':
        return 'bg-[#DCEBFA] text-blue-900 border-blue-200';
      case 'finance':
        return 'bg-[#DDF3E4] text-emerald-900 border-emerald-200';
      case 'fitness':
        return 'bg-[#FBE4D5] text-amber-900 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Life Goals & AI Roadmaps</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E9DDFB] text-purple-900">
              {lifeState.goals.length} Active
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            High-level ambitions broken down into actionable monthly roadmaps synchronized with your schedule.
          </p>
        </div>

        <button
          onClick={() => setShowAddGoalModal(true)}
          className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>New Life Goal</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'career', 'learning', 'finance', 'fitness', 'personal'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Goals List & Detailed AI Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Goals Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {filteredGoals.map((goal) => {
            const isSelected = selectedGoal?.id === goal.id;
            return (
              <div
                key={goal.id}
                onClick={() => setSelectedGoalId(goal.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-white border-purple-300 ring-2 ring-purple-100 shadow-sm'
                    : 'bg-white/80 hover:bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(
                        goal.category
                      )}`}
                    >
                      {goal.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 leading-snug">{goal.title}</h3>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-purple-600 translate-x-1' : 'text-stone-300'
                    }`}
                  />
                </div>

                <p className="text-xs text-stone-500 line-clamp-2">{goal.description}</p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] text-stone-400">Roadmap Progress</span>
                    <span className="font-extrabold text-stone-800">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-stone-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    Target: {goal.targetDate}
                  </span>
                  <span>{goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} milestones</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: AI Generated & Editable Roadmap (7 cols) */}
        <div className="lg:col-span-7">
          {selectedGoal ? (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(
                        selectedGoal.category
                      )}`}
                    >
                      {selectedGoal.category}
                    </span>
                    <span className="text-xs text-stone-400">Target: {selectedGoal.targetDate}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-stone-900">{selectedGoal.title}</h3>
                  <p className="text-xs text-stone-500 mt-1">{selectedGoal.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#E9DDFB]/30 border border-purple-200/60 text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                    AI Roadmap
                  </span>
                  <span className="text-xl font-extrabold text-stone-900">{selectedGoal.progress}%</span>
                </div>
              </div>

              {/* Milestones / Roadmap Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Actionable Roadmap Milestones
                  </h4>
                  <span className="text-[11px] text-stone-400">Click to check off completed steps</span>
                </div>

                <div className="space-y-3">
                  {selectedGoal.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      onClick={() => toggleGoalMilestone(selectedGoal.id, milestone.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        milestone.completed
                          ? 'bg-[#DDF3E4]/30 border-emerald-200/80 text-stone-600'
                          : 'bg-white hover:bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button className="shrink-0 transition-colors">
                          {milestone.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-stone-300" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            {milestone.targetMonth && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                                {milestone.targetMonth}
                              </span>
                            )}
                            <span
                              className={`text-xs font-bold ${
                                milestone.completed ? 'line-through text-stone-500' : 'text-stone-900'
                              }`}
                            >
                              {milestone.title}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl shrink-0 ${
                          milestone.completed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {milestone.completed ? 'Completed' : `Step ${index + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationship with other life areas */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-amber-200/60 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>How LifeOS Connects This Goal</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  This goal is tied to your <strong className="text-stone-900">18h/week</strong> schedule allocation and{' '}
                  <strong className="text-stone-900">{lifeState.learning.length} active learning tracks</strong>. If your college exam
                  schedule changes, LifeOS automatically shifts milestone timelines to avoid academic stress.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 bg-white rounded-3xl border border-stone-200 text-stone-400">
              Select a goal to view its AI roadmap
            </div>
          )}
        </div>
      </div>

      {/* New Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-stone-900">Create New Life Goal</h3>
              </div>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Get an Internship in 4 Months, Learn Python..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="career">Career</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                    <option value="fitness">Fitness</option>
                    <option value="project">Project</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what success looks like..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#E9DDFB]/40 border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-semibold text-purple-950">
                    Auto-generate AI 4-stage roadmap
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={useAIRoadmap}
                  onChange={(e) => setUseAIRoadmap(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
                >
                  Create Goal & Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
