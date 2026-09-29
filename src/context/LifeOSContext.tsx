import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LifeState,
  ChatMessage,
  ProposedPlanChange,
  Goal,
  LearningItem,
  CommitmentItem,
  CareerMilestone,
  PlannedPurchase,
} from '../types/lifeos';
import { initialDemoLifeState } from '../data/demoData';

interface LifeOSContextType {
  lifeState: LifeState;
  activeSection: string;
  setActiveSection: (section: string) => void;
  chatMessages: ChatMessage[];
  isAiThinking: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  proposedChange: ProposedPlanChange | null;
  setProposedChange: (change: ProposedPlanChange | null) => void;
  
  // Actions
  askAI: (messageText: string) => Promise<void>;
  triggerReplanning: (trigger: 'exams' | 'vacation' | 'course_completed' | 'custom', details?: string) => Promise<void>;
  applyProposedChange: (change: ProposedPlanChange) => void;
  cancelProposedChange: () => void;
  resetToDemo: () => void;
  completeOnboarding: (userData: any) => void;
  refreshAIFocus: () => Promise<void>;
  
  // Entity CRUD
  toggleTask: (taskId: string) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  addGoal: (goal: Partial<Goal>) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  addLearningSkill: (item: Partial<LearningItem>) => void;
  updateSkillProgress: (skillId: string, progress: number) => void;
  addCommitment: (commitment: Partial<CommitmentItem>) => void;
  removeCommitment: (id: string) => void;
  addPlannedPurchase: (purchase: Partial<PlannedPurchase>) => void;
  updateCareerProfile: (updates: Partial<LifeState['career']>) => void;
}

const LOCAL_STORAGE_KEY = 'lifeos_app_state_v1';

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lifeState, setLifeState] = useState<LifeState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved LifeOS state:', e);
    }
    return initialDemoLifeState;
  });

  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [proposedChange, setProposedChange] = useState<ProposedPlanChange | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      timestamp: 'Just now',
      content: `Hello ${lifeState.profile.name}! I am your LifeOS AI. I maintain the living connection between your career aspirations, university schedule, learning roadmap, and budget. What changes in your life would you like to discuss today?`,
      reasoningSummary: 'Monitoring 3 active goals, 18 available weekly hours, and 4-month SWE internship milestone.',
      suggestedReplies: [
        'What should I focus on this week?',
        'I have exams for the next 2 weeks',
        'I have 10 days of vacation',
        'I completed my Python course',
      ],
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lifeState));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [lifeState]);

  // Send query to LifeOS AI
  const askAI = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: messageText,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          lifeState,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: data.reply,
        reasoningSummary: data.reasoningSummary,
        proposedChange: data.proposedChanges || null,
        suggestedReplies: data.suggestedReplies || [],
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      if (data.proposedChanges && data.proposedChanges.type !== 'none') {
        setProposedChange(data.proposedChanges);
      }
    } catch (error) {
      console.warn('API error, handling gracefully with client reasoning engine:', error);
      // Client-side fallback
      handleLocalAiResponse(messageText);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleLocalAiResponse = (messageText: string) => {
    const lower = messageText.toLowerCase();
    let reply = `I've analyzed your request in the context of your overall life schedule and goals.`;
    let reasoning = `Cross-referenced schedule availability, active career milestone, and learning progress.`;
    let change: ProposedPlanChange | null = null;
    let suggestions = ['What should I focus on this week?', 'Check my savings progress'];

    if (lower.includes('exam')) {
      reply = `Your upcoming exam period will reduce your available career-prep time for the next 2 weeks. I've designed an adjusted roadmap that lowers your weekly prep hours and shifts deep project coding until exams finish.`;
      reasoning = `Exams drop available hours from 18h to 8h/week. Reducing technical load prevents academic GPA decline.`;
      change = {
        type: 'roadmap_update',
        title: 'Shift Roadmap to Exam Mode (2 Weeks)',
        description: 'Lower weekly career commitment to 8h/week and move heavy portfolio work post-exams.',
        timeDeltaDescription: 'Available career prep time adjusted to 8h/week during exams.',
        payload: { trigger: 'exams', weeklyHours: 8 },
      };
      suggestions = ['Apply Exam Mode', 'What light reviews should I do?'];
    } else if (lower.includes('vacation')) {
      reply = `A 10-day vacation provides ~35 free hours per week! I've prepared a Vacation Project Sprint to accelerate your full-stack project and resume preparation.`;
      reasoning = `With no university lectures, dedicating 4 hours/day provides a 3-week head start on applications.`;
      change = {
        type: 'roadmap_update',
        title: 'Activate Vacation Project Sprint (10 Days)',
        description: 'Increase available preparation time to 34h/week and complete live deployment of your portfolio project.',
        timeDeltaDescription: 'Available time surged to 34h/week.',
        payload: { trigger: 'vacation', weeklyHours: 34 },
      };
      suggestions = ['Apply Vacation Sprint', 'What project should I build?'];
    } else if (lower.includes('python') || lower.includes('finished') || lower.includes('completed')) {
      reply = `Milestone complete! Your Python course is finished. I have updated your skill mastery and moved your roadmap to SQL & end-to-end project building.`;
      reasoning = `Foundational skill verified. Shifting study hours into building builds concrete interview leverage.`;
      change = {
        type: 'learning_update',
        title: 'Complete Python Course & Advance Roadmap',
        description: 'Set Python to 100% progress, advance Month 1 milestone to completed, and unlock Month 2 Project Phase.',
        payload: { skill: 'Python', progress: 100 },
      };
      suggestions = ['Apply changes', 'Show my updated career roadmap'];
    } else if (lower.includes('focus') || lower.includes('right now')) {
      reply = `Right now, your top priority is LeetCode Tree problems (Assignment due Oct 2) alongside your ongoing university coursework. Keep your evening 2-hour coding block uninterrupted.`;
      reasoning = `Upcoming academic deadline aligns with your Month 1 DSA career goal.`;
      suggestions = ['Show today tasks', 'Review schedule'];
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: reply,
      reasoningSummary: reasoning,
      proposedChange: change,
      suggestedReplies: suggestions,
    };

    setChatMessages((prev) => [...prev, aiMsg]);
    if (change) {
      setProposedChange(change);
    }
  };

  // Specific replan trigger (exams, vacation, course completed)
  const triggerReplanning = async (trigger: 'exams' | 'vacation' | 'course_completed' | 'custom', details?: string) => {
    setIsAiThinking(true);
    try {
      const res = await fetch('/api/ai/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerType: trigger, details, lifeState }),
      });
      const data = await res.json();

      const change: ProposedPlanChange = {
        type: trigger === 'course_completed' ? 'learning_update' : 'roadmap_update',
        title: trigger === 'exams' ? 'Exam Mode Adaptation (2 Weeks)' : trigger === 'vacation' ? 'Vacation Project Sprint (10 Days)' : 'Course Completion & Milestone Advance',
        description: data.explanation || 'Adjusted roadmap and schedule distribution.',
        timeDeltaDescription: data.timeDeltaDescription,
        reasoning: data.relationshipSummary,
        payload: {
          trigger,
          newRoadmap: data.newRoadmap,
          suggestedCommitment: data.suggestedCommitment,
        },
      };

      setProposedChange(change);

      // Also add to chat log for full conversational context
      setChatMessages((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: trigger === 'exams' ? 'I have exams for the next 2 weeks.' : trigger === 'vacation' ? 'I have a 10-day vacation.' : 'I completed my Python course.',
        },
        {
          id: `ai-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: data.explanation,
          reasoningSummary: data.relationshipSummary,
          proposedChange: change,
        },
      ]);
    } catch (e) {
      console.warn('Replanning request fallback:', e);
      // Run local replan
      if (trigger === 'exams') {
        handleLocalAiResponse('I have exams for the next 2 weeks');
      } else if (trigger === 'vacation') {
        handleLocalAiResponse('I have 10 days of vacation');
      } else if (trigger === 'course_completed') {
        handleLocalAiResponse('I completed my Python course');
      }
    } finally {
      setIsAiThinking(false);
    }
  };

  // Apply proposed change to the state
  const applyProposedChange = (change: ProposedPlanChange) => {
    setLifeState((prev) => {
      let updatedCareer = { ...prev.career };
      let updatedSchedule = { ...prev.schedule };
      let updatedLearning = [...prev.learning];
      let updatedGoals = [...prev.goals];

      if (change.payload?.trigger === 'exams' || change.title.toLowerCase().includes('exam')) {
        updatedCareer.mode = 'exam_mode';
        if (change.payload?.newRoadmap) {
          updatedCareer.roadmap = change.payload.newRoadmap;
        } else {
          updatedCareer.roadmap = updatedCareer.roadmap.map((m, idx) => {
            if (idx === 0) {
              return {
                ...m,
                month: 'Month 1 (Exam Period: Light Mode)',
                focus: 'Exam Priority & Daily 20m Syntax Review',
                hoursPerWeek: 6,
                items: [
                  'Maintain 20m daily spaced repetition (Python / SQL)',
                  'Prioritize university course exams and sleep',
                  'Heavy project coding shifted to post-exams',
                ],
              };
            }
            if (idx === 1) {
              return {
                ...m,
                month: 'Month 1 (Post-Exams Ramp-up)',
                focus: 'Accelerated Project Development',
                hoursPerWeek: 22,
              };
            }
            return m;
          });
        }

        updatedSchedule.weeklyAvailableHours = 8;
        // Add exam commitment if not present
        if (!updatedSchedule.commitments.some((c) => c.type === 'exam')) {
          updatedSchedule.commitments = [
            {
              id: `c-exam-${Date.now()}`,
              title: 'Semester Midterm Exams',
              type: 'exam',
              startDate: '2026-10-01',
              endDate: '2026-10-15',
              hoursPerDay: 5,
              impact: 'Temporarily reduces available career prep to 8 hrs/week',
              isActive: true,
            },
            ...updatedSchedule.commitments,
          ];
        }
      } else if (change.payload?.trigger === 'vacation' || change.title.toLowerCase().includes('vacation')) {
        updatedCareer.mode = 'vacation_sprint';
        if (change.payload?.newRoadmap) {
          updatedCareer.roadmap = change.payload.newRoadmap;
        } else {
          updatedCareer.roadmap = [
            {
              id: `cm-vac-${Date.now()}`,
              month: 'Vacation Sprint (10 Days)',
              focus: 'Intensive Full-Stack Project Build & Live Deploy',
              status: 'in_progress',
              hoursPerWeek: 34,
              items: [
                'Full-stack app implementation with database schema',
                'Deploy live demo with documentation & GitHub showcase',
                'Early resume polish & 10 high-priority applications',
              ],
            },
            ...updatedCareer.roadmap.slice(1),
          ];
        }

        updatedSchedule.weeklyAvailableHours = 34;
        if (!updatedSchedule.commitments.some((c) => c.type === 'vacation')) {
          updatedSchedule.commitments = [
            {
              id: `c-vac-${Date.now()}`,
              title: '10-Day Academic Vacation Window',
              type: 'vacation',
              startDate: '2026-10-16',
              endDate: '2026-10-26',
              hoursPerDay: 0,
              impact: 'Zero class conflicts (+18 hrs/week available)',
              isActive: true,
            },
            ...updatedSchedule.commitments.filter((c) => c.type !== 'exam'),
          ];
        }
      } else if (change.payload?.skill === 'Python' || change.title.toLowerCase().includes('python')) {
        updatedLearning = updatedLearning.map((l) =>
          l.name.toLowerCase().includes('python') ? { ...l, progress: 100, currentLevel: 'Advanced' } : l
        );
        updatedCareer.roadmap = updatedCareer.roadmap.map((m, idx) => {
          if (idx === 0) return { ...m, status: 'completed', focus: 'Python Mastery [COMPLETED]' };
          if (idx === 1) return { ...m, status: 'in_progress' };
          return m;
        });
        updatedCareer.projectsCount = Math.max(updatedCareer.projectsCount, 3);
        if (!updatedCareer.currentSkills.includes('Advanced Python')) {
          updatedCareer.currentSkills = [...updatedCareer.currentSkills, 'Advanced Python'];
        }
      }

      const logItem = {
        id: `rh-${Date.now()}`,
        date: 'Just now',
        trigger: change.title,
        explanation: change.description,
        timeDelta: change.timeDeltaDescription || 'Roadmap & schedule harmonized.',
        status: 'applied' as const,
      };

      return {
        ...prev,
        career: updatedCareer,
        schedule: updatedSchedule,
        learning: updatedLearning,
        goals: updatedGoals,
        replanningHistory: [logItem, ...prev.replanningHistory],
        aiFocus: {
          ...prev.aiFocus,
          summary: `LifeOS adapted your roadmap to: ${change.title}.`,
          relationshipInsight: change.reasoning || prev.aiFocus.relationshipInsight,
          lastUpdated: 'Just now',
        },
      };
    });

    setProposedChange(null);
  };

  const cancelProposedChange = () => {
    setProposedChange(null);
  };

  const resetToDemo = () => {
    setLifeState(initialDemoLifeState);
    setProposedChange(null);
    setChatMessages([
      {
        id: 'm-reset',
        sender: 'assistant',
        timestamp: 'Just now',
        content: `Welcome back to the Alex demo profile. LifeOS is ready with 4-month SWE internship goals, academic schedule, and Python/DSA learning tracks.`,
        suggestedReplies: [
          'What should I focus on this week?',
          'I have exams for the next 2 weeks',
          'I have 10 days of vacation',
          'I completed my Python course',
        ],
      },
    ]);
  };

  const completeOnboarding = (userData: any) => {
    const hours = Number(userData.availableHours) || 18;
    const newGoals: Goal[] = [
      {
        id: `g-${Date.now()}`,
        title: userData.mainGoal || 'Get an Internship in 4 Months',
        category: 'career',
        targetDate: '2026-12-31',
        progress: 25,
        description: `Primary life focus: ${userData.mainGoal}`,
        isPriority: true,
        milestones: [
          { id: 'm1', title: 'Targeted Skill Mastery', completed: false, targetMonth: 'Month 1' },
          { id: 'm2', title: 'Build & Deploy Portfolio Projects', completed: false, targetMonth: 'Month 2' },
          { id: 'm3', title: 'Resume Polish & Applications', completed: false, targetMonth: 'Month 3' },
          { id: 'm4', title: 'Interviews & Offer Securing', completed: false, targetMonth: 'Month 4' },
        ],
      },
    ];

    setLifeState((prev) => ({
      ...prev,
      profile: {
        name: userData.name || 'Friend',
        role: userData.role || 'Aspiring Professional',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        isOnboarded: true,
      },
      career: {
        ...prev.career,
        targetRole: userData.mainGoal || 'Software Engineer',
        currentSkills: userData.skills ? userData.skills.split(',').map((s: string) => s.trim()) : prev.career.currentSkills,
      },
      schedule: {
        ...prev.schedule,
        weeklyAvailableHours: hours,
      },
      goals: newGoals,
    }));

    setShowOnboarding(false);
  };

  const refreshAIFocus = async () => {
    try {
      const res = await fetch('/api/ai/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lifeState }),
      });
      if (res.ok) {
        const data = await res.json();
        setLifeState((prev) => ({
          ...prev,
          aiFocus: {
            summary: data.summary,
            topPriorities: data.topPriorities || prev.aiFocus.topPriorities,
            relationshipInsight: data.relationshipInsight || prev.aiFocus.relationshipInsight,
            lastUpdated: 'Just now',
          },
        }));
      }
    } catch (e) {
      console.warn('Failed to refresh AI focus:', e);
    }
  };

  const toggleTask = (taskId: string) => {
    setLifeState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        todayTasks: prev.schedule.todayTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      },
    }));
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setLifeState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m));
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...g, milestones: updatedMilestones, progress };
      }),
    }));
  };

  const addGoal = (goal: Partial<Goal>) => {
    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      title: goal.title || 'New Goal',
      category: goal.category || 'personal',
      targetDate: goal.targetDate || '2026-12-31',
      progress: 0,
      description: goal.description || '',
      milestones: goal.milestones || [
        { id: `m-${Date.now()}-1`, title: 'Define actionable steps', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Midpoint progress review', completed: false },
        { id: `m-${Date.now()}-3`, title: 'Achieve target outcome', completed: false },
      ],
      isPriority: goal.isPriority ?? false,
    };
    setLifeState((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }));
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setLifeState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goalId ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g)),
    }));
  };

  const addLearningSkill = (item: Partial<LearningItem>) => {
    const newItem: LearningItem = {
      id: `l-${Date.now()}`,
      name: item.name || 'New Subject',
      currentLevel: item.currentLevel || 'Beginner',
      targetLevel: item.targetLevel || 'Intermediate',
      progress: item.progress || 10,
      targetDate: item.targetDate || '2026-12-01',
      hoursPerWeek: item.hoursPerWeek || 4,
      connectedGoal: item.connectedGoal || prevCareerGoalTitle(lifeState),
      skills: item.skills || ['Fundamentals'],
    };
    setLifeState((prev) => ({
      ...prev,
      learning: [...prev.learning, newItem],
    }));
  };

  const updateSkillProgress = (skillId: string, progress: number) => {
    setLifeState((prev) => ({
      ...prev,
      learning: prev.learning.map((l) => (l.id === skillId ? { ...l, progress: Math.min(100, Math.max(0, progress)) } : l)),
    }));
  };

  const addCommitment = (commitment: Partial<CommitmentItem>) => {
    const newCommitment: CommitmentItem = {
      id: `c-${Date.now()}`,
      title: commitment.title || 'New Commitment',
      type: commitment.type || 'personal',
      startDate: commitment.startDate || new Date().toISOString().split('T')[0],
      endDate: commitment.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      hoursPerDay: commitment.hoursPerDay || 3,
      impact: commitment.impact || 'Requires daily dedicated block',
      isActive: true,
    };

    // Calculate effect on available hours
    setLifeState((prev) => {
      const addedDailyHours = newCommitment.hoursPerDay;
      const weeklyReduction = newCommitment.type === 'vacation' ? -16 : addedDailyHours * 5;
      const updatedAvailable = Math.max(4, prev.schedule.weeklyAvailableHours - weeklyReduction);

      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          weeklyAvailableHours: newCommitment.type === 'vacation' ? 34 : updatedAvailable,
          commitments: [newCommitment, ...prev.schedule.commitments],
        },
      };
    });
  };

  const removeCommitment = (id: string) => {
    setLifeState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        commitments: prev.schedule.commitments.filter((c) => c.id !== id),
      },
    }));
  };

  const addPlannedPurchase = (purchase: Partial<PlannedPurchase>) => {
    const newP: PlannedPurchase = {
      id: `p-${Date.now()}`,
      title: purchase.title || 'New Equipment',
      amount: purchase.amount || 10000,
      targetMonths: purchase.targetMonths || 3,
      savedSoFar: 0,
      category: purchase.category || 'Productivity',
    };
    setLifeState((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        plannedPurchases: [...prev.finance.plannedPurchases, newP],
      },
    }));
  };

  const updateCareerProfile = (updates: Partial<LifeState['career']>) => {
    setLifeState((prev) => ({
      ...prev,
      career: { ...prev.career, ...updates },
    }));
  };

  return (
    <LifeOSContext.Provider
      value={{
        lifeState,
        activeSection,
        setActiveSection,
        chatMessages,
        isAiThinking,
        showOnboarding,
        setShowOnboarding,
        proposedChange,
        setProposedChange,
        askAI,
        triggerReplanning,
        applyProposedChange,
        cancelProposedChange,
        resetToDemo,
        completeOnboarding,
        refreshAIFocus,
        toggleTask,
        toggleGoalMilestone,
        addGoal,
        updateGoalProgress,
        addLearningSkill,
        updateSkillProgress,
        addCommitment,
        removeCommitment,
        addPlannedPurchase,
        updateCareerProfile,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};

function prevCareerGoalTitle(state: LifeState) {
  return state.career?.careerGoal || state.career?.targetRole || 'Career Roadmap';
}
