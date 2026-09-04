import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';

export type ViewId =
  | 'dashboard'
  | 'email'
  | 'meeting'
  | 'planner'
  | 'research'
  | 'chat';

export interface NavItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview of your AI tools' },
  { id: 'email', label: 'Email Generator', icon: Mail, description: 'Tone + audience-based drafting' },
  { id: 'meeting', label: 'Meeting Summarizer', icon: FileText, description: 'Key points, actions, deadlines' },
  { id: 'planner', label: 'Task Planner', icon: ListChecks, description: 'Prioritization + scheduling' },
  { id: 'research', label: 'Research Assistant', icon: Search, description: 'Insights + summaries' },
  { id: 'chat', label: 'AI Chatbot', icon: MessageSquare, description: 'Ask anything, get answers' },
];
