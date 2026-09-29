import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Home,
  Target,
  BookOpen,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
  Bot,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, lifeState } = useLifeOS();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Life Dashboard', icon: Home },
    { id: 'goals', label: 'Goals', icon: Target, badge: `${lifeState.goals.length}` },
    { id: 'learning', label: 'Learning', icon: BookOpen, badge: `${lifeState.learning.length}` },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'schedule', label: 'Schedule', icon: Calendar, badge: `${lifeState.schedule.weeklyAvailableHours}h` },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'ai', label: 'LifeOS AI', icon: Bot, badge: 'Live', color: 'text-purple-600' },
    { id: 'n8n', label: 'n8n Chatbot', icon: Zap, badge: 'Live', color: 'text-amber-600' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white/70 backdrop-blur-md border-r border-stone-200/80 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation List */}
        <nav className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
            System Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isAI = item.id === 'ai';
            const isN8n = item.id === 'n8n';

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? isAI
                      ? 'bg-gradient-to-r from-[#E9DDFB] to-[#DCEBFA] text-purple-950 shadow-xs border border-purple-200'
                      : isN8n
                      ? 'bg-gradient-to-r from-[#FFF9F2] to-[#FBE4D5] text-amber-950 shadow-xs border border-amber-200'
                      : 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-xl transition-colors ${
                      isActive
                        ? isAI
                          ? 'bg-white/80 text-purple-700'
                          : isN8n
                          ? 'bg-white/80 text-amber-700'
                          : 'bg-white/20 text-white'
                        : 'text-stone-500 group-hover:text-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? isAI
                          ? 'bg-purple-200 text-purple-900'
                          : isN8n
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-white/20 text-white'
                        : isAI
                        ? 'bg-purple-100 text-purple-700 font-bold'
                        : isN8n
                        ? 'bg-amber-100 text-amber-800 font-bold animate-pulse'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic State Card */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-amber-200/60 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Life Capacity
            </span>
            <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {lifeState.schedule.weeklyAvailableHours}h / week
            </span>
          </div>

          <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((lifeState.schedule.weeklyAvailableHours / 45) * 100))}%`,
              }}
            />
          </div>

          <p className="text-[11px] text-amber-900/80 leading-snug">
            {lifeState.career.mode === 'exam_mode'
              ? '⚠️ Exams active: Career workload temporarily reduced to 8h.'
              : lifeState.career.mode === 'vacation_sprint'
              ? '🚀 Vacation sprint: 34h weekly unlocked for portfolio build.'
              : 'Steady college rhythm: 18h dedicated to SWE internship prep.'}
          </p>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-stone-200/60 text-xs text-stone-500 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-stone-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Life Engine
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            Harmonized
          </span>
        </div>
        <p className="text-[10px] text-stone-400">
          Goals + Career + Learning + Schedule synchronized.
        </p>
      </div>
    </aside>
  );
};
