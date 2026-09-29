import React, { useState, useRef, useEffect } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Briefcase,
  BookOpen,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Check,
  X,
} from 'lucide-react';
import { ProposedPlanChange } from '../../types/lifeos';
import { N8nChatView } from '../n8n/N8nChatView';
import { Zap } from 'lucide-react';

export const AIAgentView: React.FC = () => {
  const [aiEngine, setAiEngine] = useState<'lifeos' | 'n8n'>('lifeos');
  const {
    lifeState,
    chatMessages,
    askAI,
    isAiThinking,
    proposedChange,
    applyProposedChange,
    cancelProposedChange,
    triggerReplanning,
  } = useLifeOS();

  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking, proposedChange]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isAiThinking) return;

    askAI(inputMessage);
    setInputMessage('');
  };

  const sampleScenarios = [
    {
      label: '📝 Exams for next 2 weeks',
      prompt: 'I have exams for the next 2 weeks.',
      type: 'exams' as const,
    },
    {
      label: '🌴 10-day vacation coming up',
      prompt: 'I have 10 days of vacation.',
      type: 'vacation' as const,
    },
    {
      label: '🎓 Completed my Python course',
      prompt: 'I completed my Python course.',
      type: 'course_completed' as const,
    },
    {
      label: '🧭 What should I focus on this week?',
      prompt: 'What should I focus on this week considering my commitments and goals?',
      type: 'custom' as const,
    },
    {
      label: '💻 Want to buy laptop in 3 months',
      prompt: 'I want to buy a laptop in 3 months for ₹70,000. Can my budget support this?',
      type: 'custom' as const,
    },
    {
      label: '⏱️ Only 2 hours a day available',
      prompt: 'I can only spend 2 hours a day on career preparation right now.',
      type: 'custom' as const,
    },
  ];

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col space-y-4">
      {/* Engine Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-2xl border border-stone-200">
          <button
            onClick={() => setAiEngine('lifeos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              aiEngine === 'lifeos'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span>LifeOS Central AI</span>
          </button>

          <button
            onClick={() => setAiEngine('n8n')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              aiEngine === 'n8n'
                ? 'bg-white text-amber-950 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>n8n Cloud Chatbot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>

        <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
          {aiEngine === 'lifeos' ? 'Cross-pillar Life Operating System' : 'Direct n8n webhook workflow connection'}
        </span>
      </div>

      {aiEngine === 'n8n' ? (
        <N8nChatView />
      ) : (
        <>
          {/* Header Context Strip: Shows what LifeOS AI knows right now */}
          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E9DDFB] to-[#DCEBFA] flex items-center justify-center border border-purple-200 shadow-2xs">
            <Bot className="w-5 h-5 text-purple-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-stone-900 tracking-tight">LifeOS AI</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                Connected Intelligence
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Not a generic chatbot — managing the relationships between your life pillars.
            </p>
          </div>
        </div>

        {/* Current State Chips that the AI keeps in memory */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-stone-600">
          <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {lifeState.career.targetRole}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lifeState.schedule.weeklyAvailableHours}h Free
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {lifeState.learning.length} Skills
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1">
            ₹{(lifeState.finance.monthlyIncome - lifeState.finance.monthlyExpenses).toLocaleString()} Surplus
          </span>
        </div>
      </div>

      {/* Quick Interactive Prompt Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 whitespace-nowrap pl-1">
          Scenarios:
        </span>
        {sampleScenarios.map((scen, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (scen.type === 'exams' || scen.type === 'vacation' || scen.type === 'course_completed') {
                triggerReplanning(scen.type);
              } else {
                askAI(scen.prompt);
              }
            }}
            disabled={isAiThinking}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200 transition-all whitespace-nowrap shadow-2xs hover:scale-102 flex items-center gap-1.5"
          >
            <span>{scen.label}</span>
          </button>
        ))}
      </div>

      {/* Main Conversation Area */}
      <div className="flex-1 bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 overflow-y-auto space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}>
              <div
                className={`max-w-2xl p-4 rounded-3xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-br-xs shadow-xs'
                    : 'bg-[#FFF9F2] text-stone-900 border border-amber-200/60 rounded-bl-xs shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 opacity-70 text-[11px] font-semibold">
                  <span>{isUser ? lifeState.profile.name : 'LifeOS AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>

              {/* AI Relationship Reasoning Box (No hidden COT, clear high-signal explanation) */}
              {!isUser && msg.reasoningSummary && (
                <div className="max-w-xl p-3 rounded-2xl bg-[#E9DDFB]/30 border border-purple-200 text-xs text-purple-950 flex items-start gap-2 shadow-2xs">
                  <div className="p-1 rounded-lg bg-purple-100 text-purple-800 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-purple-950">Interconnected Life Reasoning: </span>
                    <span className="opacity-90">{msg.reasoningSummary}</span>
                  </div>
                </div>
              )}

              {/* Suggested replies pills */}
              {!isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-2 pt-1">
                  {msg.suggestedReplies.map((replyText, i) => (
                    <button
                      key={i}
                      onClick={() => askAI(replyText)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-purple-100 text-stone-600 hover:text-purple-900 border border-stone-200/80 transition-colors"
                    >
                      {replyText}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAiThinking && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-sm animate-pulse">
            <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-700">LifeOS is analyzing your system...</p>
              <p className="text-[10px] text-stone-400">Evaluating goals, available hours, and roadmap impact</p>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Proposed Changes Interactive Review Card (Required in #12 AI Actions) */}
      {proposedChange && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-amber-50 to-emerald-50 border-2 border-purple-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-bottom-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 border border-purple-300">
                Action Proposed by AI
              </span>
              <h4 className="text-sm font-extrabold text-stone-900">{proposedChange.title}</h4>
            </div>
            <p className="text-xs text-stone-700 leading-snug">{proposedChange.description}</p>
            {proposedChange.timeDeltaDescription && (
              <p className="text-[11px] font-semibold text-stone-500">
                Time Impact: {proposedChange.timeDeltaDescription}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={cancelProposedChange}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-white/80 border border-stone-300 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={() => applyProposedChange(proposedChange)}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-stone-900 hover:bg-stone-800 text-white shadow-sm flex items-center gap-1.5 transition-transform hover:scale-102"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tell LifeOS what changed: e.g. 'I have exams for 2 weeks', 'Finished course', 'I want to buy a laptop'..."
          disabled={isAiThinking}
          className="flex-1 px-4 py-3 rounded-2xl bg-white border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isAiThinking}
          className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-transform hover:scale-102 shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
        </>
      )}
    </div>
  );
};
