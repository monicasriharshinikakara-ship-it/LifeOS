import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertCircle,
  Target,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

export const TodayOverview: React.FC = () => {
  const { lifeState, toggleTask, setActiveSection } = useLifeOS();

  const completedTasks = lifeState.schedule.todayTasks.filter((t) => t.completed).length;
  const totalTasks = lifeState.schedule.todayTasks.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Today's Overview</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </h3>
        <span className="text-xs font-semibold text-stone-500">
          {completedTasks}/{totalTasks} tasks completed
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Tasks & Deadlines (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Today's Important Tasks</h4>
                <p className="text-xs text-stone-500">Prioritized by urgency and career roadmap connection</p>
              </div>
              <button
                onClick={() => setActiveSection('schedule')}
                className="text-xs text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>View Full Schedule</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {lifeState.schedule.todayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-stone-50/80 border-stone-200/60 opacity-60'
                      : 'bg-white hover:bg-stone-50/70 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-stone-400 hover:text-stone-800 transition-colors">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          task.completed ? 'line-through text-stone-500' : 'text-stone-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-stone-400">Linked to:</span>
                        <span className="font-semibold text-stone-600">{task.connectedTo}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 shrink-0">
                    {task.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines & Commitments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deadlines */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Upcoming Deadlines
                </h4>
                <span className="text-[11px] text-stone-400">Next 14 Days</span>
              </div>

              <div className="space-y-2">
                {lifeState.schedule.deadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className="p-3 rounded-2xl bg-[#FFF9F2] border border-amber-200/60 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-800">{dl.title}</p>
                      <span className="text-[10px] uppercase font-semibold text-amber-800">
                        {dl.type}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg shrink-0">
                      {dl.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commitments Overview */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Active Commitments
                </h4>
                <button
                  onClick={() => setActiveSection('schedule')}
                  className="text-[11px] font-semibold text-purple-700 hover:underline"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-2">
                {lifeState.schedule.commitments.map((com) => (
                  <div
                    key={com.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                      com.type === 'exam'
                        ? 'bg-rose-50 border-rose-200'
                        : com.type === 'vacation'
                        ? 'bg-sky-50 border-sky-200'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-800">{com.title}</p>
                      <p className="text-[10px] text-stone-500">{com.impact}</p>
                    </div>
                    <span className="text-[11px] font-bold text-stone-700 bg-white/80 border border-stone-200 px-2 py-0.5 rounded-lg shrink-0">
                      {com.hoursPerDay}h / day
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Available Time Gauge, Goals & Finance Snapshot */}
        <div className="space-y-6">
          {/* Available Time Gauge */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                Available Weekly Time
              </h4>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {lifeState.schedule.weeklyAvailableHours} Hours
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#E9DDFB]/30 to-[#DCEBFA]/40 border border-purple-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-600 font-medium">Free Career/Prep Window:</span>
                <span className="font-extrabold text-stone-900">
                  ~{(lifeState.schedule.weeklyAvailableHours / 7).toFixed(1)} hrs / day
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (lifeState.schedule.weeklyAvailableHours / 40) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                Calculated by subtracting required college lectures, sleep, and fixed commitments from your 168-hour week.
              </p>
            </div>
          </div>

          {/* Current Goals Mini Snapshot */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-rose-500" />
                Current Goals
              </h4>
              <button
                onClick={() => setActiveSection('goals')}
                className="text-[11px] font-semibold text-rose-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {lifeState.goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-800 truncate max-w-[180px]">{goal.title}</span>
                    <span className="font-extrabold text-stone-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Snapshot */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Savings & Purchases
              </h4>
              <button
                onClick={() => setActiveSection('finance')}
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                Planning
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#DDF3E4]/30 border border-emerald-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-600 font-medium">Goal: ₹{lifeState.finance.savingsGoal.targetAmount.toLocaleString()}</span>
                <span className="font-bold text-emerald-800">
                  ₹{lifeState.finance.savingsGoal.currentAmount.toLocaleString()} saved
                </span>
              </div>
              <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (lifeState.finance.savingsGoal.currentAmount /
                          lifeState.finance.savingsGoal.targetAmount) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Surplus allows comfortable laptop purchase in 3.5 months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
