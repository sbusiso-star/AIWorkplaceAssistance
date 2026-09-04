import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User } from 'lucide-react';
import { Card, SectionTitle, Disclaimer } from '@/components/ui';
import { chatbotReply, withDelay, type ChatMessage } from '@/lib/ai';

const suggestions = [
  'Help me write a follow-up email',
  'Summarize my meeting notes',
  'Plan my day with 5 tasks',
  'Research a topic for me',
];

export function ChatbotInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI Workplace Productivity Assistant. Ask me anything, or try one of the suggestions below to get started.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const reply = await withDelay(chatbotReply(trimmed), 800);
    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: reply, ts: Date.now() }]);
    setLoading(false);
  };

  return (
    <div className="space-y-5 animate-fade-in flex flex-col h-[calc(100vh-7rem)]">
      <SectionTitle
        title="AI Chatbot"
        subtitle="Ask questions, get structured guidance, and navigate your AI tools."
        icon={<MessageSquare className="h-5 w-5" />}
      />

      <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <Avatar role="assistant" />
              <div className="rounded-2xl rounded-tl-sm bg-ink-100 px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary-500 animate-dot-bounce" style={{ animationDelay: '0s' }} />
                  <span className="h-2 w-2 rounded-full bg-primary-500 animate-dot-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="h-2 w-2 rounded-full bg-primary-500 animate-dot-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="chip border border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition"
              >
                <Sparkles className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-ink-200 p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <input
              className="input flex-1"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} className="btn-primary px-4 py-2.5 text-sm">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2">
            <Disclaimer />
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 animate-slide-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar role={msg.role} />
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm bg-primary-600 text-white'
            : 'rounded-tl-sm bg-ink-100 text-ink-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: 'user' | 'assistant' }) {
  if (role === 'user') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-600">
        <User className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white">
      <Sparkles className="h-4 w-4" />
    </div>
  );
}
