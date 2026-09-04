// AI engine: structured prompt templates + mock generation logic.
// Each feature builds a structured "prompt" and produces professional,
// deterministic-ish outputs so the prototype is fully functional offline.

export type Tone = 'professional' | 'friendly' | 'persuasive' | 'urgent' | 'empathetic';
export type Audience = 'executive' | 'team' | 'client' | 'vendor' | 'general';

export interface EmailInput {
  topic: string;
  keyPoints: string;
  tone: Tone;
  audience: Audience;
  senderName: string;
  recipientName: string;
}

export interface EmailOutput {
  subject: string;
  body: string;
}

const toneDescriptors: Record<Tone, string> = {
  professional: 'formal, clear, and business-appropriate',
  friendly: 'warm and approachable while staying respectful',
  persuasive: 'compelling and outcome-driven, emphasizing value',
  urgent: 'direct and time-sensitive with clear calls to action',
  empathetic: 'understanding and human-centered',
};

const audienceContext: Record<Audience, string> = {
  executive: 'senior leadership who need concise, high-impact information',
  team: 'internal colleagues who need actionable detail and context',
  client: 'an external client who needs reassurance and clear value',
  vendor: 'a third-party vendor who needs precise requirements',
  general: 'a general professional audience',
};

export function generateEmail(input: EmailInput): EmailOutput {
  const { topic, keyPoints, tone, audience, senderName, recipientName } = input;
  const greeting = recipientName.trim() ? `Hi ${recipientName.trim()},` : 'Hello,';
  const points = keyPoints
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const intro = `I'm writing to you regarding ${topic.trim() || 'an important matter'}.`;
  const bodyPoints =
    points.length > 0
      ? `Here are the key points:\n\n${points.map((p) => `• ${p}`).join('\n')}`
      : `I'd like to share a few important details and next steps.`;

  const closing =
    tone === 'urgent'
      ? "Given the time sensitivity, I'd appreciate your input by end of day."
      : tone === 'persuasive'
      ? 'I believe this is a strong opportunity and would welcome your go-ahead to proceed.'
      : tone === 'empathetic'
      ? "I understand this may raise questions — I'm happy to discuss whenever works for you."
      : 'Please let me know if you have any questions or need further detail.';

  const signoff = recipientName.trim() ? 'Best regards,' : 'Kind regards,';

  const subject = `${topic.trim() ? capitalize(topic.trim()) : 'Update'} — ${capitalize(tone)}`;
  const body = `${greeting}\n\n${intro} ${bodyPoints}\n\n${closing}\n\n${signoff}\n${senderName.trim() || 'Your Name'}`;

  void toneDescriptors[tone];
  void audienceContext[audience];
  return { subject, body };
}

// ---- Meeting Summarizer ----

export interface MeetingOutput {
  summary: string;
  keyPoints: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
  decisions: string[];
}

export function summarizeMeeting(notes: string, meetingTitle: string): MeetingOutput {
  const lines = notes
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const actionKeywords = ['action', 'follow up', 'follow-up', 'todo', 'to do', 'will', 'should', 'need to', 'must', 'assign', 'deadline', 'by friday', 'by monday', 'by next', 'due'];
  const decisionKeywords = ['decided', 'agreed', 'approved', 'concluded', 'finalized', 'locked in'];
  const deadlineMatch = /(by\s+\w+|due\s+\w+|before\s+\w+|next\s+\w+)/i;

  const actionItems: MeetingOutput['actionItems'] = [];
  const decisions: string[] = [];
  const keyPoints: string[] = [];

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (actionKeywords.some((k) => lower.includes(k))) {
      const ownerMatch = line.match(/@?\b([A-Z][a-z]+)\b/);
      const dl = line.match(deadlineMatch);
      actionItems.push({
        task: line.replace(/^[-•*\d.)\s]+/, '').trim(),
        owner: ownerMatch ? ownerMatch[1] : 'Unassigned',
        deadline: dl ? capitalize(dl[0]) : 'This week',
      });
    } else if (decisionKeywords.some((k) => lower.includes(k))) {
      decisions.push(line.replace(/^[-•*\d.)\s]+/, '').trim());
    } else {
      keyPoints.push(line.replace(/^[-•*\d.)\s]+/, '').trim());
    }
  });

  if (actionItems.length === 0 && lines.length > 0) {
    actionItems.push({ task: 'Review meeting notes and confirm next steps', owner: 'Facilitator', deadline: 'This week' });
  }

  const summary =
    lines.length === 0
      ? 'No notes were provided. Paste your meeting transcript or notes to generate a summary.'
      : `The meeting${meetingTitle.trim() ? ` on "${meetingTitle.trim()}"` : ''} covered ${keyPoints.length} discussion point(s), resulted in ${decisions.length} decision(s), and produced ${actionItems.length} action item(s). Key themes: ${keyPoints.slice(0, 3).join('; ') || 'general discussion'}.`;

  return {
    summary,
    keyPoints: keyPoints.slice(0, 10),
    actionItems: actionItems.slice(0, 10),
    decisions: decisions.slice(0, 8),
  };
}

// ---- Task Planner ----

export interface TaskInput {
  text: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  estimate: number; // hours
}

export interface PlannedTask extends TaskInput {
  id: string;
  slot: string;
  urgencyScore: number;
}

export interface TaskPlanOutput {
  schedule: PlannedTask[];
  recommendation: string;
}

export function planTasks(tasks: TaskInput[]): TaskPlanOutput {
  const now = new Date();
  const scored = tasks.map((t) => {
    const dueDate = new Date(t.due);
    const daysUntil = Math.max(1, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const priorityWeight = t.priority === 'high' ? 3 : t.priority === 'medium' ? 2 : 1;
    const urgencyScore = priorityWeight * 10 - daysUntil + (t.estimate > 4 ? -2 : 0);
    return { ...t, urgencyScore };
  });

  scored.sort((a, b) => b.urgencyScore - a.urgencyScore);

  const slots = ['9:00 AM – 10:30 AM', '10:45 AM – 12:15 PM', '1:00 PM – 2:30 PM', '2:45 PM – 4:15 PM', '4:30 PM – 5:30 PM'];
  const schedule: PlannedTask[] = scored.map((t, i) => ({
    ...t,
    id: `task-${i}`,
    slot: slots[i % slots.length],
  }));

  const top = schedule[0];
  const recommendation = top
    ? `Start your day with "${top.text}" scheduled at ${top.slot}. It has the highest urgency score (${top.urgencyScore}) due to its ${top.priority} priority and ${formatDue(top.due)} deadline. Block focus time and avoid context switching.`
    : 'Add tasks to generate an AI-optimized schedule.';

  return { schedule, recommendation };
}

// ---- Research Assistant ----

export interface ResearchOutput {
  insights: string[];
  summary: string;
  keyTerms: { term: string; definition: string }[];
  questions: string[];
}

export function researchTopic(topic: string, depth: 'brief' | 'detailed'): ResearchOutput {
  const clean = topic.trim() || 'the requested topic';
  const insights =
    depth === 'detailed'
      ? [
          `${capitalize(clean)} is a multifaceted area with growing relevance across industries, driven by technological adoption and shifting market expectations.`,
          `Recent trends indicate increased investment and standardization, though adoption barriers remain around cost, skills, and integration with legacy systems.`,
          `Stakeholders should prioritize a phased approach: pilot initiatives, measurable KPIs, and cross-functional alignment before scaling.`,
          `Competitive positioning favors organizations that move early while maintaining rigorous evaluation of ROI and risk.`,
        ]
      : [
          `${capitalize(clean)} is gaining traction as organizations seek efficiency and differentiation.`,
          `A phased, measurable approach is recommended to manage risk while capturing value.`,
        ];

  const summary = `${capitalize(clean)} presents a meaningful opportunity. ${depth === 'detailed' ? 'A detailed review suggests prioritizing pilot initiatives, defining clear KPIs, and aligning stakeholders before broader rollout. Key risks center on integration and skills gaps, mitigated by phased execution.' : 'Early, structured adoption with clear metrics offers the strongest path to value.'}`;

  const keyTerms = [
    { term: capitalize(clean), definition: `The core subject of this research brief.` },
    { term: 'Phased Adoption', definition: 'Rolling out initiatives in stages to validate results before scaling.' },
    { term: 'KPI', definition: 'Key Performance Indicator — a measurable signal of progress.' },
  ];

  const questions = [
    `What are the top 3 measurable outcomes we want from ${clean}?`,
    `Which pilot scope gives us the fastest signal with the least risk?`,
    `What existing systems or processes would need to integrate?`,
  ];

  return { insights, summary, keyTerms, questions };
}

// ---- Chatbot ----

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: number;
}

export function chatbotReply(userText: string): string {
  const text = userText.toLowerCase();
  if (text.includes('email')) {
    return "I can help you draft an email. Try the Smart Email Generator tab — pick a tone (e.g. professional, persuasive) and an audience, then list your key points. I'll structure the subject, greeting, body, and sign-off for you.";
  }
  if (text.includes('meet') || text.includes('notes')) {
    return "Paste your raw meeting notes into the Meeting Notes Summarizer and I'll extract key points, decisions, and action items with owners and deadlines automatically.";
  }
  if (text.includes('task') || text.includes('schedule') || text.includes('plan')) {
    return 'Use the AI Task Planner to list your tasks with due dates, priority, and effort estimates. I\'ll rank them by urgency and propose a time-blocked schedule for your day.';
  }
  if (text.includes('research') || text.includes('summari') || text.includes('insight')) {
    return 'The AI Research Assistant turns a topic into structured insights, a plain-language summary, key terms, and follow-up questions. Choose brief or detailed depth.';
  }
  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return "Hello! I'm your AI Workplace Productivity Assistant. I can help with email drafting, meeting summaries, task planning, and research. What would you like to work on?";
  }
  if (text.includes('help') || text.length < 5) {
    return "I'm here to help you work faster. I support five areas: Smart Email Generator, Meeting Notes Summarizer, AI Task Planner, AI Research Assistant, and general chat. Tell me what you're trying to accomplish and I'll point you to the right tool.";
  }
  return `Here's my take on "${userText.trim()}": This looks like a productive area to explore. I'd recommend breaking it into smaller steps, identifying the key outcome you want, and using one of the tools in the sidebar to structure your next move. Would you like me to draft an email, summarize notes, plan tasks, or research this topic?`;
}

// ---- helpers ----

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDue(due: string): string {
  const d = new Date(due);
  if (isNaN(d.getTime())) return 'upcoming';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Simulated async delay for realistic loading states
export function withDelay<T>(value: T, ms = 1100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
