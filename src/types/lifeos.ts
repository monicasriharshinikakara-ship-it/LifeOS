export type GoalCategory = 'career' | 'learning' | 'fitness' | 'finance' | 'project' | 'personal';

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetMonth?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetDate: string;
  progress: number;
  description: string;
  milestones: GoalMilestone[];
  isPriority?: boolean;
}

export interface LearningItem {
  id: string;
  name: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetLevel: 'Intermediate' | 'Advanced' | 'Expert';
  progress: number;
  targetDate: string;
  hoursPerWeek: number;
  connectedGoal: string;
  skills: string[];
}

export interface CareerMilestone {
  id: string;
  month: string;
  focus: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  hoursPerWeek: number;
  items: string[];
}

export interface CareerProfile {
  targetRole: string;
  targetTimeline: string;
  currentSkills: string[];
  skillGaps: string[];
  resumeHighlights: string[];
  projectsCount: number;
  certificationsCount: number;
  experience: string;
  careerGoal: string;
  roadmap: CareerMilestone[];
  mode: 'standard' | 'exam_mode' | 'vacation_sprint';
}

export interface ExpenseCategory {
  category: string;
  amount: number;
}

export interface PlannedPurchase {
  id: string;
  title: string;
  amount: number;
  targetMonths: number;
  savedSoFar: number;
  category: string;
}

export interface FinanceState {
  monthlyIncome: number;
  monthlyExpenses: number;
  expenseCategories: ExpenseCategory[];
  savingsGoal: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
  };
  plannedPurchases: PlannedPurchase[];
}

export type CommitmentType = 'class' | 'exam' | 'work' | 'internship' | 'project' | 'personal' | 'vacation';

export interface CommitmentItem {
  id: string;
  title: string;
  type: CommitmentType;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  impact: string;
  isActive: boolean;
}

export interface TodayTask {
  id: string;
  title: string;
  time: string;
  category: 'career' | 'learning' | 'college' | 'personal';
  completed: boolean;
  connectedTo: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  date: string;
  type: 'academic' | 'career' | 'finance' | 'milestone';
  urgency: 'urgent' | 'moderate' | 'upcoming';
}

export interface ScheduleState {
  weeklyAvailableHours: number;
  baseWeeklyCapacity: number;
  commitments: CommitmentItem[];
  todayTasks: TodayTask[];
  deadlines: DeadlineItem[];
}

export interface AIFocus {
  summary: string;
  topPriorities: string[];
  relationshipInsight: string;
  lastUpdated: string;
}

export interface ReplanningHistoryItem {
  id: string;
  date: string;
  trigger: string;
  explanation: string;
  timeDelta: string;
  status: 'applied';
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  isOnboarded: boolean;
}

export interface LifeState {
  profile: UserProfile;
  goals: Goal[];
  learning: LearningItem[];
  career: CareerProfile;
  finance: FinanceState;
  schedule: ScheduleState;
  aiFocus: AIFocus;
  replanningHistory: ReplanningHistoryItem[];
}

export interface ProposedPlanChange {
  type: 'roadmap_update' | 'schedule_update' | 'goal_update' | 'learning_update' | 'finance_update';
  title: string;
  description: string;
  timeDeltaDescription?: string;
  reasoning?: string;
  payload: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  reasoningSummary?: string;
  proposedChange?: ProposedPlanChange | null;
  suggestedReplies?: string[];
}
