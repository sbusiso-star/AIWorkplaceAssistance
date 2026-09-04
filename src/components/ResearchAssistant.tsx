import { useState } from 'react';
import { Search, Sparkles, Lightbulb, BookOpen, HelpCircle } from 'lucide-react';
import { Card, SectionTitle, Badge, CopyButton, LoadingDots, SkeletonLines, Disclaimer, EmptyState } from '@/components/ui';
import { researchTopic, withDelay, type ResearchOutput } from '@/lib/ai';

export function ResearchAssistant() {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState<'brief' | 'detailed'>('detailed');
  const [output, setOutput] = useState<ResearchOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setOutput(null);
    const result = await withDelay(researchTopic(topic, depth));
    setOutput(result);
    setLoading(false);
  };

  const copyAll = output
    ? `SUMMARY\n${output.summary}\n\nINSIGHTS\n${output.insights.map((i) => '• ' + i).join('\n')}\n\nKEY TERMS\n${output.keyTerms.map((t) => `${t.term}: ${t.definition}`).join('\n')}\n\nFOLLOW-UP QUESTIONS\n${output.questions.map((q) => '• ' + q).join('\n')}`
    : '';

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionTitle
        title="AI Research Assistant"
        subtitle="Turn any topic into structured insights, a summary, and follow-up questions."
        icon={<Search className="h-5 w-5" />}
      />

      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            placeholder="Enter a topic to research — e.g. AI adoption in healthcare"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
          />
          <select className="input sm:w-40" value={depth} onChange={(e) => setDepth(e.target.value as 'brief' | 'detailed')}>
            <option value="brief">Brief</option>
            <option value="detailed">Detailed</option>
          </select>
          <button onClick={handleResearch} disabled={loading || !topic.trim()} className="btn-primary px-5 py-2.5 text-sm whitespace-nowrap">
            <Sparkles className="h-4 w-4" /> {loading ? 'Researching…' : 'Research'}
          </button>
        </div>
      </Card>

      {!loading && !output && !topic && (
        <Card>
          <EmptyState icon={<Search className="h-8 w-8" />} title="Enter a topic above to begin" hint="Choose brief for a quick overview or detailed for a deep dive." />
        </Card>
      )}

      {loading && (
        <Card>
          <div className="space-y-4">
            <SkeletonLines lines={3} />
            <div className="h-px bg-ink-100" />
            <SkeletonLines lines={4} />
            <LoadingDots label="Gathering insights" />
          </div>
        </Card>
      )}

      {!loading && output && (
        <div className="animate-slide-in space-y-5">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge color="primary">{depth === 'brief' ? 'Brief' : 'Detailed'}</Badge>
                <h3 className="font-semibold text-ink-900">Research Brief</h3>
              </div>
              <CopyButton text={copyAll} label="Copy brief" />
            </div>
            <div className="rounded-xl bg-primary-50/60 border border-primary-100 p-4">
              <p className="text-sm text-ink-700 leading-relaxed">{output.summary}</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <div className="flex items-center gap-2 mb-3 text-accent-600">
                <Lightbulb className="h-4 w-4" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wide">Key Insights</h4>
              </div>
              <div className="space-y-3">
                {output.insights.map((insight, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 text-xs font-semibold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-ink-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-3 text-primary-600">
                <BookOpen className="h-4 w-4" />
                <h4 className="text-[11px] font-semibold uppercase tracking-wide">Key Terms</h4>
              </div>
              <div className="space-y-2.5">
                {output.keyTerms.map((t, i) => (
                  <div key={i} className="rounded-lg border border-ink-200 px-3 py-2">
                    <p className="text-sm font-medium text-ink-900">{t.term}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{t.definition}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-3 text-amber-600">
              <HelpCircle className="h-4 w-4" />
              <h4 className="text-[11px] font-semibold uppercase tracking-wide">Follow-up Questions to Explore</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {output.questions.map((q, i) => (
                <div key={i} className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-3.5">
                  <p className="text-sm text-ink-700 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </Card>

          <Disclaimer />
        </div>
      )}
    </div>
  );
}
