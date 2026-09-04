import { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { EmailGenerator } from '@/components/EmailGenerator';
import { MeetingSummarizer } from '@/components/MeetingSummarizer';
import { TaskPlanner } from '@/components/TaskPlanner';
import { ResearchAssistant } from '@/components/ResearchAssistant';
import { ChatbotInterface } from '@/components/ChatbotInterface';
import { NAV_ITEMS, type ViewId } from '@/lib/nav';

function App() {
  const [view, setView] = useState<ViewId>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (id: ViewId) => {
    setView(id);
    setMobileOpen(false);
  };

  const currentNav = NAV_ITEMS.find((n) => n.id === view);

  return (
    <div className="flex min-h-screen bg-ink-100">
      <Sidebar current={view} onNavigate={handleNavigate} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 h-16">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden btn-ghost p-2"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            {currentNav && (
              <p className="text-sm font-medium text-ink-500 hidden sm:block">FlowPilot /</p>
            )}
            <h1 className="font-display font-semibold text-ink-900 truncate">{currentNav?.label}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse-soft" />
              <span className="text-xs font-medium text-accent-700">AI Online</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-5xl">
            {view === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
            {view === 'email' && <EmailGenerator />}
            {view === 'meeting' && <MeetingSummarizer />}
            {view === 'planner' && <TaskPlanner />}
            {view === 'research' && <ResearchAssistant />}
            {view === 'chat' && <ChatbotInterface />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
