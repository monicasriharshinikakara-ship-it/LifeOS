import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  BookOpen,
  Plus,
  Clock,
  Sparkles,
  Link2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { LearningItem } from '../../types/lifeos';

export const LearningView: React.FC = () => {
  const { lifeState, updateSkillProgress, addLearningSkill, triggerReplanning, setActiveSection } = useLifeOS();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New skill form
  const [skillName, setSkillName] = useState('');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [targetLevel, setTargetLevel] = useState<'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [targetDate, setTargetDate] = useState('2026-11-30');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    addLearningSkill({
      name: skillName,
      currentLevel,
      targetLevel,
      progress: 15,
      hoursPerWeek,
      targetDate,
      connectedGoal: lifeState.career.targetRole || 'Software Engineering Internship',
      skills: ['Fundamentals', 'Applied Exercises'],
    });

    setSkillName('');
    setShowAddModal(false);
  };

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'Beginner':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced':
      case 'Expert':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Learning & Skill Progression</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-blue-900">
              {lifeState.learning.length} Active Tracks
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            Connected directly to your career goal:{' '}
            <strong className="text-stone-800">{lifeState.career.targetRole}</strong>. No busywork, only high-signal skills.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => triggerReplanning('course_completed')}
            className="px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs border border-emerald-200 flex items-center gap-1.5 transition-all shadow-2xs"
            title="Mark Python course completed and advance roadmap"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Simulate: "Finished Python"</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* AI Career Connection Callout */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#DCEBFA]/50 via-[#FFF9F2] to-[#E9DDFB]/40 border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-blue-200 flex items-center justify-center shrink-0">
            <Link2 className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
              <span>Target Role Skill Alignment</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 text-blue-800">
                100% Focused
              </span>
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Your current skills are organized into a logical interview pipeline:{' '}
              <span className="font-semibold text-stone-800">
                Python Foundations → DSA Patterns → Intermediate SQL → Full-Stack Projects.
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveSection('career')}
          className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 shrink-0 self-end md:self-auto hover:underline"
        >
          <span>View Career Gap Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lifeState.learning.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4 hover:border-blue-200 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-stone-900 leading-tight">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelColor(item.currentLevel)}`}>
                    Current: {item.currentLevel}
                  </span>
                  <span className="text-stone-300">→</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelColor(item.targetLevel)}`}>
                    Target: {item.targetLevel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold text-stone-900">{item.progress}%</span>
                <span className="text-[10px] text-stone-400 block">Mastery</span>
              </div>
            </div>

            {/* Interactive Progress Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 font-medium">Update Progress:</span>
                <span className="font-bold text-stone-700">{item.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={item.progress}
                onChange={(e) => updateSkillProgress(item.id, Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-stone-100 rounded-lg"
              />
            </div>

            {/* Badges / Topic tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.skills.map((sub, i) => (
                <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                  {sub}
                </span>
              ))}
            </div>

            {/* Footer with hours and target date */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {item.hoursPerWeek}h / week allocated
              </span>
              <span>Target: {item.targetDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-stone-900">Add Learning Goal</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-xl text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Subject / Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Learning, System Design, React..."
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Current Level</label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Level</label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Weekly Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
                >
                  Save Skill Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
