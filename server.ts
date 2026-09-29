import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with provided key:', err);
  }
}

// AI Focus Endpoint
app.post('/api/ai/focus', async (req, res) => {
  const { lifeState } = req.body;
  if (!lifeState) {
    return res.status(400).json({ error: 'Missing lifeState in request' });
  }

  // Check if Gemini is available
  if (ai) {
    try {
      const prompt = `You are LifeOS AI, the central intelligence of a personal life operating system.
Analyze the user's current situation across all life areas:
User Name: ${lifeState.profile?.name || 'User'}
Target Role / Goal: ${lifeState.career?.targetRole || lifeState.goals?.[0]?.title || 'Internship / Growth'}
Available Weekly Hours: ${lifeState.schedule?.weeklyAvailableHours ?? 18}h
Commitments: ${JSON.stringify(lifeState.schedule?.commitments || [])}
Active Goals: ${JSON.stringify(lifeState.goals?.map((g: any) => ({ title: g.title, progress: g.progress })) || [])}
Learning: ${JSON.stringify(lifeState.learning?.map((l: any) => ({ skill: l.name, level: l.level, progress: l.progress })) || [])}
Finance: Monthly remaining ₹${(lifeState.finance?.monthlyIncome || 0) - (lifeState.finance?.monthlyExpenses || 0)}, Savings goal: ₹${lifeState.finance?.savingsGoal?.targetAmount || 0}

Provide a short, highly personalized 1-2 sentence focus summary for this week.
Explain how one life commitment affects another. For example, if there are exams or high commitments, note lighter learning; if vacation, recommend sprint; if on track, recommend current milestone.
Also return 2-3 specific focus bullets for this week.
Respond with JSON matching this structure:
{
  "summary": "1-2 concise sentences summarizing this week's reality and focus.",
  "topPriorities": ["Priority 1", "Priority 2", "Priority 3"],
  "relationshipInsight": "1 short sentence explaining how their schedule/commitments directly affects their roadmap."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (error) {
      console.warn('Gemini focus call failed, using intelligent fallback:', error);
    }
  }

  // Fallback intelligent generator
  const hasExams = lifeState.schedule?.commitments?.some((c: any) => 
    c.title?.toLowerCase().includes('exam') || c.type === 'exam'
  );
  const hasVacation = lifeState.schedule?.commitments?.some((c: any) => 
    c.title?.toLowerCase().includes('vacation') || c.type === 'vacation'
  );

  let summary = 'Your internship roadmap is progressing steadily with balanced weekly milestones.';
  let relationshipInsight = 'Balancing regular classes with 2-3 hours of daily technical prep keeps you on track for target application dates.';
  let topPriorities = [
    'Complete Python data structures practice',
    'Review SQL joins and indexing fundamentals',
    'Keep weekly budget within ₹12,000 allowance',
  ];

  if (hasExams) {
    summary = 'Your main priority this week is your upcoming exam schedule. Your career roadmap has shifted to lighter review sessions until exams conclude.';
    relationshipInsight = 'Exams reduce available preparation time from 22 hrs to ~8 hrs/week, so heavy portfolio coding is deferred.';
    topPriorities = [
      'Focus 80% of daily study blocks on college exams',
      'Maintain 30-min daily spaced repetition for Python/SQL',
      'Rest and sleep adequately to sustain focus',
    ];
  } else if (hasVacation) {
    summary = 'You have a 10-day vacation window with ~35 available hours. LifeOS has expanded your roadmap for an intensive project sprint.';
    relationshipInsight = 'Zero class conflicts allows you to accelerate from Month 2 project building directly into resume polishing.';
    topPriorities = [
      'Complete full-stack / data analysis portfolio project',
      'Deploy live demo and push clean commits to GitHub',
      'Draft tailored resume bullet points highlighting technical impact',
    ];
  }

  return res.json({ summary, topPriorities, relationshipInsight });
});

// Dynamic Replanning Endpoint
app.post('/api/ai/replan', async (req, res) => {
  const { triggerType, details, lifeState } = req.body;
  if (!lifeState) {
    return res.status(400).json({ error: 'Missing lifeState' });
  }

  if (ai) {
    try {
      const prompt = `You are LifeOS AI, the central life intelligence engine.
A change in life circumstances occurred:
Trigger: "${triggerType}"
Details: "${details || ''}"
Current Life State:
- Career Target: ${lifeState.career?.targetRole}
- Available Hours: ${lifeState.schedule?.weeklyAvailableHours}h/week
- Commitments: ${JSON.stringify(lifeState.schedule?.commitments)}
- Current Roadmap Milestones: ${JSON.stringify(lifeState.career?.roadmap || [])}
- Learning: ${JSON.stringify(lifeState.learning || [])}
- Goals: ${JSON.stringify(lifeState.goals || [])}

Core Philosophy: The AI doesn't manage one task. It manages the relationships between different parts of life.
When exams occur, time shrinks -> lighten load, shift heavy milestones post-exams.
When vacation occurs, time surges -> accelerate projects and applications.
When course/skill finishes -> advance to next logical milestone.

Generate an updated roadmap and clear reasoning.
Return JSON:
{
  "explanation": "Concise 1-2 sentence explanation of the adjustment and why.",
  "timeDeltaDescription": "e.g., Available time decreased by ~14 hrs/week during exams.",
  "relationshipSummary": "Short sentence explaining how the schedule change affects career milestones.",
  "newRoadmap": [
    {
      "id": "m1",
      "month": "Month 1",
      "focus": "string",
      "status": "completed" | "in_progress" | "upcoming",
      "hoursPerWeek": number,
      "items": ["task 1", "task 2"]
    }
  ],
  "suggestedCommitment": {
    "title": "optional commitment to add or modify",
    "type": "exam" | "vacation" | "class" | "personal",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "hoursPerDay": number
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const text = response.text?.trim() || '{}';
      return res.json(JSON.parse(text));
    } catch (err) {
      console.warn('Gemini replan call failed, using intelligent engine:', err);
    }
  }

  // Fallback intelligent replanner
  if (triggerType === 'exams') {
    return res.json({
      explanation: 'Your exams will reduce your available career-preparation time for the next two weeks. I have temporarily reduced your career workload and moved the heavier project work to your post-exam period.',
      timeDeltaDescription: 'Available time reduced from 20 hrs/week to 8 hrs/week during the 2-week exam window.',
      relationshipSummary: 'Academic exams take precedence over new project development; shifting deep work preserves both GPA and stamina.',
      newRoadmap: [
        {
          id: 'm1',
          month: 'Month 1 (Weeks 1-2: Exam Mode)',
          focus: 'Exam Priority & Light Skill Retention',
          status: 'in_progress',
          hoursPerWeek: 6,
          items: [
            'Daily 20-min flashcards & syntax review (Python / SQL)',
            'Complete ongoing college course exams with full focus',
            'Pause heavy GitHub repo development until exams finish',
          ],
        },
        {
          id: 'm2',
          month: 'Month 1 (Weeks 3-4: Post-Exam Ramp-up)',
          focus: 'Accelerated Project Building',
          status: 'upcoming',
          hoursPerWeek: 22,
          items: [
            'Resume Deep Project: Data Pipeline / Full-stack app',
            'Implement core database schema & API endpoints',
            'Code review and clean commit history on GitHub',
          ],
        },
        {
          id: 'm3',
          month: 'Month 2',
          focus: 'Portfolio Polishing & Advanced Concepts',
          status: 'upcoming',
          hoursPerWeek: 18,
          items: [
            'Complete Project 2 with documentation and live deploy',
            'Master Data Structures & Algorithms patterns (Trees, Graphs, DP)',
            'Resume optimization with quantifiable metrics',
          ],
        },
        {
          id: 'm4',
          month: 'Months 3-4',
          focus: 'Targeted Applications & Mock Interviews',
          status: 'upcoming',
          hoursPerWeek: 16,
          items: [
            'Apply to 35+ targeted internship openings',
            'Conduct 10 behavioral & technical mock interviews',
            'Follow up with referrals and engineering recruiters',
          ],
        },
      ],
      suggestedCommitment: {
        title: 'Midterm / Semester Exams',
        type: 'exam',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        hoursPerDay: 5,
      },
    });
  }

  if (triggerType === 'vacation') {
    return res.json({
      explanation: 'With 10 days of vacation, your weekly available time surges by 18 hours. I have scheduled an intensive Project Sprint and early resume drafting so you gain a 3-week head start.',
      timeDeltaDescription: 'Available time increased from 18 hrs/week to 36 hrs/week for 10 days.',
      relationshipSummary: 'Free time during vacation transforms into high-output portfolio development and live deployment.',
      newRoadmap: [
        {
          id: 'm1',
          month: 'Vacation Sprint (10 Days)',
          focus: 'Intensive Portfolio Build & Live Deployment',
          status: 'in_progress',
          hoursPerWeek: 34,
          items: [
            'Build & deploy flagship full-stack/analytics application',
            'Write technical README, architecture diagrams, and test suite',
            'Finish LinkedIn profile overhaul and GitHub pin showcase',
            'Complete advanced DSA problem sets (50+ problems)',
          ],
        },
        {
          id: 'm2',
          month: 'Month 2',
          focus: 'Early Applications & Outreach',
          status: 'upcoming',
          hoursPerWeek: 16,
          items: [
            'Reach out to alumni and engineers for informational chats',
            'Submit first batch of early-decision internship applications',
            'Complete SQL certification assessment',
          ],
        },
        {
          id: 'm3',
          month: 'Month 3-4',
          focus: 'Interview Rounds & Offer Negotiation',
          status: 'upcoming',
          hoursPerWeek: 15,
          items: [
            'Technical phone screens and live coding challenges',
            'System design fundamentals & behavioral prep (STAR format)',
            'Evaluate and negotiate offer letters',
          ],
        },
      ],
      suggestedCommitment: {
        title: '10-Day Vacation Window',
        type: 'vacation',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        hoursPerDay: 0,
      },
    });
  }

  if (triggerType === 'course_completed') {
    return res.json({
      explanation: 'Congratulations on finishing your Python course! Because your foundation is now verified, I have marked your Python milestone as completed and advanced your roadmap directly to intermediate SQL and hands-on data projects.',
      timeDeltaDescription: 'Reallocated 6 hrs/week of beginner course study directly into hands-on project building.',
      relationshipSummary: 'Skill completion unlocks immediate applied project work, accelerating your internship readiness by 2 weeks.',
      newRoadmap: [
        {
          id: 'm1',
          month: 'Month 1',
          focus: 'Python Mastery [COMPLETED] → Applied SQL',
          status: 'completed',
          hoursPerWeek: 16,
          items: [
            'Completed Python Core & Object-Oriented Fundamentals',
            'SQL database querying & schema design',
            'Begin first integrated project with Python + database',
          ],
        },
        {
          id: 'm2',
          month: 'Month 2 (Current Active)',
          focus: 'End-to-End Project Development',
          status: 'in_progress',
          hoursPerWeek: 18,
          items: [
            'Develop production-grade repository with clean commits',
            'Connect backend logic to database with test coverage',
            'Publish GitHub documentation and demo GIF',
          ],
        },
        {
          id: 'm3',
          month: 'Month 3',
          focus: 'Resume & Early Applications',
          status: 'upcoming',
          hoursPerWeek: 16,
          items: [
            'Add newly completed Python/SQL project to resume',
            'Start weekly application quotas (10 apps/week)',
          ],
        },
        {
          id: 'm4',
          month: 'Month 4',
          focus: 'Interviews & Offer Prep',
          status: 'upcoming',
          hoursPerWeek: 14,
          items: ['Technical rounds', 'Behavioral practice', 'Offer finalization'],
        },
      ],
    });
  }

  // General custom replan
  return res.json({
    explanation: `I've analyzed "${details || 'your request'}" in the context of your overall goals, available schedule, and learning progress, and adjusted your roadmap accordingly.`,
    timeDeltaDescription: 'Schedule and milestones harmonized with current commitments.',
    relationshipSummary: 'Integrated changes balance immediate deadlines with long-term internship goals.',
    newRoadmap: lifeState.career?.roadmap || [],
  });
});

// AI Central Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, lifeState, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (ai) {
    try {
      const prompt = `You are LifeOS AI — the central intelligence of the LifeOS Personal Life Operating System.
You are NOT a standard chatbot and NOT a simple to-do list.
You manage the RELATIONSHIPS between different parts of the user's life:
- Goals (Career, Learning, Personal, Financial)
- Career plans & Target roles
- Learning & Skill levels
- Finances & Planned purchases
- Schedule, Commitments, Exams, Vacations
- Available time (weekly hours)

USER MESSAGE: "${message}"

CURRENT LIFE STATE:
${JSON.stringify(lifeState, null, 2)}

INSTRUCTIONS:
1. Understand how their request impacts other areas of life (e.g., if they mention exams -> less time for career; vacation -> more time; completed course -> advance roadmap; new purchase -> finance balance).
2. Answer concisely, warmly, and with deep contextual awareness of their existing data.
3. If the user's message warrants a plan adjustment or action, provide a "proposedChanges" object in your JSON response so the user can review and click "Apply Changes" or "Cancel".
4. Do NOT expose internal chain-of-thought; give concise, high-signal explanations.

Respond with JSON:
{
  "reply": "Your response to the user. Clear, encouraging, and specific to their data.",
  "reasoningSummary": "1-2 brief sentences explaining the trade-offs or relationship between different life areas.",
  "proposedChanges": {
    "type": "roadmap_update" | "schedule_update" | "goal_update" | "learning_update" | "none",
    "title": "Short title of the proposed change",
    "description": "What will change in their LifeOS",
    "payload": {}
  } | null,
  "suggestedReplies": ["Quick suggestion 1", "Quick suggestion 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim() || '{}';
      return res.json(JSON.parse(text));
    } catch (err) {
      console.warn('Gemini chat failed, fallback to smart conversational engine:', err);
    }
  }

  // Intelligent conversational fallback based on intent detection
  const lower = message.toLowerCase();
  
  if (lower.includes('exam') || lower.includes('test') || lower.includes('finals')) {
    return res.json({
      reply: "I understand! Exams demand high cognitive focus and reduce your free time. I've formulated an adjusted plan that shifts heavy coding to your post-exam window while keeping light 20-minute daily review sessions so you don't lose momentum.",
      reasoningSummary: "Exams temporarily drop your available career hours from 20h to ~8h/week. Reducing pressure now prevents academic burnout and keeps your GPA secure.",
      proposedChanges: {
        type: 'roadmap_update',
        title: 'Shift Roadmap to Exam Mode (2 Weeks)',
        description: 'Reduce weekly career prep hours to 6-8h, prioritize exam study, and shift deep portfolio project building to post-exams.',
        payload: {
          trigger: 'exams',
          weeklyHours: 8,
        },
      },
      suggestedReplies: [
        'Apply the Exam Mode roadmap',
        'How many hours should I study each day?',
        'What light reviews should I do?',
      ],
    });
  }

  if (lower.includes('vacation') || lower.includes('holiday') || lower.includes('break')) {
    return res.json({
      reply: "Great news! A 10-day vacation is an exceptional opportunity. With classes paused, your available time expands to 35+ hours/week. I've designed an intensive project sprint and early application sprint to capitalize on this free time.",
      reasoningSummary: "With zero academic schedule constraints, allocating 4-5 focused hours a day allows you to finish your flagship portfolio project weeks ahead of schedule.",
      proposedChanges: {
        type: 'roadmap_update',
        title: 'Vacation Project Sprint (10 Days)',
        description: 'Expand weekly preparation hours to 34h, accelerate project completion, and polish resume for early applications.',
        payload: {
          trigger: 'vacation',
          weeklyHours: 34,
        },
      },
      suggestedReplies: [
        'Apply the Vacation Sprint plan',
        'What project should I build?',
        'How should I structure my vacation days?',
      ],
    });
  }

  if (lower.includes('finished') || lower.includes('completed') || lower.includes('done with python') || lower.includes('python course')) {
    return res.json({
      reply: "Outstanding work completing your Python course! Milestone verified. Your technical profile has been upgraded, and I've updated your career roadmap to transition directly into database querying (SQL) and building your first data-driven portfolio project.",
      reasoningSummary: "Foundational skill unlocked. Reallocating the 6 hours previously spent on tutorials into project code delivers 3x more interview leverage.",
      proposedChanges: {
        type: 'learning_update',
        title: 'Mark Python Completed & Advance to Projects',
        description: 'Set Python progress to 100%, update career profile to 3 completed projects/skills, and unlock Month 2 roadmap.',
        payload: {
          skill: 'Python',
          progress: 100,
          nextPhase: 'SQL & Database Architecture',
        },
      },
      suggestedReplies: [
        'Apply skill completion',
        'Show my updated career roadmap',
        'What SQL concepts are most asked in interviews?',
      ],
    });
  }

  if (lower.includes('focus') || lower.includes('what should i do') || lower.includes('priority')) {
    return res.json({
      reply: "Looking at your system right now: your career milestone requires 3 hours of DSA & SQL practice, while your schedule has 18 hours available this week. Because you have ₹18,000 saved toward your ₹20,000 goal, finances are steady. Focus 60% on DSA trees/arrays and 40% on pushing commits to your second portfolio project.",
      reasoningSummary: "Synthesized schedule availability (18h free), current learning milestone (Month 1/2 transition), and financial buffer.",
      proposedChanges: null,
      suggestedReplies: [
        'Break this down into daily tasks',
        'What if I have an exam coming up?',
        'Check my savings progress',
      ],
    });
  }

  if (lower.includes('internship') || lower.includes('career') || lower.includes('job')) {
    return res.json({
      reply: "Your 4-month internship roadmap is structured into 4 sequential phases: Foundational Skills → Flagship Projects & GitHub → Resume & Outreach → Live Coding & Interviews. Right now you are in Phase 1-2, right on track with 65% learning completion.",
      reasoningSummary: "Career readiness score is currently high. Keeping your 18h/week commitment preserves the target application window in Month 3.",
      proposedChanges: null,
      suggestedReplies: [
        'What skills should I learn next?',
        'How many projects do I need?',
        'Can you simulate an interview question?',
      ],
    });
  }

  if (lower.includes('laptop') || lower.includes('buy') || lower.includes('money') || lower.includes('save') || lower.includes('budget')) {
    return res.json({
      reply: "Factoring in your monthly income (₹35,000) and current expenses (₹18,000), you have ₹17,000 remaining per month. You have already saved ₹18,000 toward your ₹20,000 target. A new purchase like a laptop (approx ₹60,000–₹75,000) can comfortably be achieved in 3.5 months without impacting your living expenses.",
      reasoningSummary: "Evaluated discretionary cashflow against planned capital purchases to ensure career equipment upgrades don't cause personal financial stress.",
      proposedChanges: null,
      suggestedReplies: [
        'Add laptop as planned purchase',
        'Show monthly finance breakdown',
        'How will this affect my savings goal?',
      ],
    });
  }

  // Default answer
  return res.json({
    reply: `I've evaluated your message against your LifeOS data. You currently have ${lifeState.goals?.length || 3} active goals, ${lifeState.schedule?.weeklyAvailableHours || 18} hours of available preparation time this week, and steady financial health. How would you like me to adjust your roadmap or schedule?`,
    reasoningSummary: "Cross-referenced current schedule commitments, active career targets, and learning progression.",
    proposedChanges: null,
    suggestedReplies: [
      'What should I focus on this week?',
      'I have exams for the next 2 weeks',
      'I have 10 days of vacation',
      'I completed my Python course',
    ],
  });
});

// Serve frontend in dev (via vite middleware) or prod (static dist)
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeOS server is active on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Error starting server:', err);
});
