import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  GraduationCap,
  Plane,
  Briefcase,
  User,
  AlertCircle,
  X,
} from 'lucide-react';
import { CommitmentItem, CommitmentType } from '../../types/lifeos';

export const ScheduleView: React.FC = () => {
  const { lifeState, addCommitment, removeCommitment, triggerReplanning, setActiveSection } = useLifeOS();
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New commitment form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CommitmentType>('exam');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [hoursPerDay, setHoursPerDay] = useState(5);
  const [impact, setImpact] = useState('Reduces free evening hours');

  const { weeklyAvailableHours, commitments, todayTasks, deadlines } = lifeState.schedule;

  const handleAddCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCommitment({
      title,
      type,
      startDate,
      endDate,
      hoursPerDay,
      impact,
      isActive: true,
    });

    // If it's an exam or vacation, trigger replanning modal
    if (type === 'exam') {
      triggerReplanning('exams');
    } else if (type === 'vacation') {
      triggerReplanning('vacation');
    }

    setTitle('');
    setShowAddModal(false);
  };

  const getTypeIcon = (t: CommitmentType) => {
    switch (t) {
      case 'exam':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'vacation':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'class':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'work':
      case 'internship':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-stone-600" />;
    }
  };

  const getTypeBadge = (t: CommitmentType) => {
    switch (t) {
      case 'exam':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'vacation':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'class':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'work':
      case 'internship':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Schedule & Time Intelligence</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FBE4D5] text-amber-900">
              {weeklyAvailableHours}h Available / Week
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            LifeOS monitors your classes, exams, and vacations to adjust how much time you can realistically give to career goals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'weekly' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'daily' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Today's View
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add Commitment</span>
          </button>
        </div>
      </div>

      {/* Available Capacity Breakdown Card */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FBE4D5] to-[#E9DDFB] flex items-center justify-center border border-amber-200">
              <Clock className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">Weekly Time Allocation Model</h3>
              <p className="text-xs text-stone-500">
                Total 168h - (Sleep 56h + College {commitments.find((c) => c.type === 'class')?.hoursPerDay ? commitments.find((c) => c.type === 'class')!.hoursPerDay * 5 : 25}h + Life Routines 25h)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs font-bold text-stone-600">Net Career Prep Window:</span>
            <span className="text-lg font-extrabold text-stone-900 bg-[#E9DDFB]/50 px-3 py-1 rounded-xl border border-purple-200">
              {weeklyAvailableHours} Hours / Week
            </span>
          </div>
        </div>

        {/* Progress Bar of Weekly Hours */}
        <div className="space-y-1.5">
          <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex">
            <div title="Sleep (56h)" className="bg-stone-300 h-full w-[33%]" />
            <div title="Classes & Study (40h)" className="bg-indigo-300 h-full w-[24%]" />
            <div title="Living Essentials (25h)" className="bg-amber-200 h-full w-[15%]" />
            <div
              title={`Career & Goal Prep (${weeklyAvailableHours}h)`}
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(28, (weeklyAvailableHours / 168) * 100)}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-400"></span> Sleep (56h)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> University Lectures</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Living & Meals</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 font-bold"></span> Net Career Window ({weeklyAvailableHours}h)</span>
          </div>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'weekly' ? (
        <div className="space-y-6">
          {/* Weekly Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {daysOfWeek.map((day, i) => {
              const isWeekend = i >= 5;
              return (
                <div
                  key={day}
                  className={`p-3.5 rounded-2xl border ${
                    isWeekend ? 'bg-[#FFF9F2]/60 border-amber-100' : 'bg-white border-stone-200'
                  } space-y-2.5 min-h-[160px] flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                      <span className="text-xs font-bold text-stone-900">{day.slice(0, 3)}</span>
                      <span className="text-[10px] font-semibold text-stone-400">
                        {isWeekend ? '4.0h free' : '2.5h free'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {!isWeekend && (
                        <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-900 font-semibold">
                          9AM - 2PM Classes
                        </div>
                      )}

                      {/* Show active commitment if any */}
                      {commitments
                        .filter((c) => c.type === 'exam')
                        .map((c) => (
                          <div key={c.id} className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px] text-rose-900 font-bold">
                            Exam Prep
                          </div>
                        ))}

                      <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-900 font-semibold">
                        {isWeekend ? 'Deep Project Sprint' : 'Evening LeetCode (2h)'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-400 block text-right font-medium">Day {i + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Active Commitments List */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">Scheduled Commitments</h3>
                <p className="text-xs text-stone-500">
                  Adding an exam or vacation automatically triggers LifeOS to replan your career roadmaps.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerReplanning('exams')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 transition-colors"
                >
                  + Add 2-Week Exams
                </button>
                <button
                  onClick={() => triggerReplanning('vacation')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition-colors"
                >
                  + Add 10-Day Vacation
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {commitments.map((com) => (
                <div
                  key={com.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-purple-200 transition-all flex items-start justify-between gap-3 bg-stone-50/50 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-2xs mt-0.5">
                      {getTypeIcon(com.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(com.type)}`}>
                          {com.type}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900">{com.title}</h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">{com.impact}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{com.startDate} → {com.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-extrabold text-stone-800 bg-white px-2.5 py-1 rounded-xl border border-stone-200">
                      {com.hoursPerDay}h/day
                    </span>
                    <button
                      onClick={() => removeCommitment(com.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove commitment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Daily View */
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-stone-900">Today's Focus & Timeline</h3>
          <div className="space-y-3">
            {todayTasks.map((t) => (
              <div key={t.id} className="p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-stone-900">{t.title}</p>
                  <p className="text-[11px] text-stone-500">Connected to: {t.connectedTo}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700">
                  {t.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Commitment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-stone-900">Add Schedule Commitment</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-xl text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCommitment} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Commitment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Exams, Summer Vacation, Part-time Work..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CommitmentType)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="exam">Exam Block</option>
                    <option value="vacation">Vacation / Break</option>
                    <option value="class">College Course / Class</option>
                    <option value="work">Work / Job</option>
                    <option value="personal">Personal / Family</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Hours / Day Impact</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 5 exams over 14 days, library study blocks"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>LifeOS AI will dynamically adapt your career roadmaps around these dates.</span>
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
                  Add & Replan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
