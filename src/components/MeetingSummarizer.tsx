import { useState } from 'react';
import { FileText, Sparkles, RotateCcw, CheckSquare, Gavel, ListChecks } from 'lucide-react';
import { Card, SectionTitle, Badge, CopyButton, LoadingDots, SkeletonLines, Disclaimer, EmptyState } from '@/components/ui';
import { summarizeMeeting, withDelay, type MeetingOutput } from '@/lib/ai';

export function MeetingSummarizer() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [output, setOutput] = useState<MeetingOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setOutput(null);
    const result = await withDelay(summarizeMeeting(notes, title));
    setOutput(result);
    setLoading(false);
  };

  const handleReset = () => {
    setOutput(null);
    setTitle('');
    setNotes('');
  };

  const copyAll = output
    ? `SUMMARY\n${output.summary}\n\nKEY POINTS\n${output.keyPoints.map((p) => '• ' + p).join('\n')}\n\nDECISIONS\n${output.decisions.map((d) => '• ' + d).join('\n')}\n\nACTION ITEMS\n${output.actionItems.map((a) => `• ${a.task} — ${a.owner} (${a.deadline})`).join('\n')}`
    : '';

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionTitle
        title="Meeting Notes Summarizer"
        subtitle="Paste raw notes to extract key points, decisions, and action items."
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="space-y-4">
            <div>
              <label className="label">Meeting Title</label>
              <input className="input" placeholder="e.g. Product roadmap sync" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Meeting Notes / Transcript</label>
              <textarea
                className="input min-h-[240px] resize-y font-sans text-sm leading-relaxed"
                placeholder={'Discussed Q3 roadmap. Sarah will finalize the pricing doc by Friday.\nDecided to delay feature X to Q4.\nTom needs to follow up with the vendor by next Tuesday.\nReviewed customer feedback from last sprint.'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSummarize} disabled={loading || !notes.trim()} className="btn-primary px-5 py-2.5 text-sm flex-1">
                <Sparkles className="h-4 w-4" /> {loading ? 'Summarizing…' : 'Summarize Notes'}
              </button>
              <button onClick={handleReset} className="btn-outline px-4 py-2.5 text-sm">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-900">Summary & Actions</h3>
            {output && <CopyButton text={copyAll} label="Copy all" />}
          </div>

          {loading && (
            <div className="space-y-4">
              <SkeletonLines lines={3} />
              <div className="h-px bg-ink-100" />
              <SkeletonLines lines={4} />
              <LoadingDots label="Analyzing your notes" />
            </div>
          )}

          {!loading && !output && (
            <EmptyState icon={<FileText className="h-8 w-8" />} title="Your meeting summary will appear here" hint="Paste your notes and click summarize." />
          )}

          {!loading && output && (
            <div className="animate-slide-in space-y-4">
              <div className="rounded-xl bg-primary-50/60 border border-primary-100 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600 mb-1">Summary</p>
                <p className="text-sm text-ink-700 leading-relaxed">{output.summary}</p>
              </div>

              {output.keyPoints.length > 0 && (
                <Section icon={<ListChecks className="h-4 w-4" />} title="Key Points" color="slate">
                  <ul className="space-y-1.5">
                    {output.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-ink-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ink-400 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {output.decisions.length > 0 && (
                <Section icon={<Gavel className="h-4 w-4" />} title="Decisions" color="accent">
                  <ul className="space-y-1.5">
                    {output.decisions.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm text-ink-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-500 shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {output.actionItems.length > 0 && (
                <Section icon={<CheckSquare className="h-4 w-4" />} title="Action Items" color="amber">
                  <div className="space-y-2">
                    {output.actionItems.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white px-3 py-2">
                        <p className="flex-1 text-sm text-ink-800">{a.task}</p>
                        <Badge color="primary">{a.owner}</Badge>
                        <Badge color="rose">{a.deadline}</Badge>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}

          <div className="mt-4">
            <Disclaimer />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: 'slate' | 'accent' | 'amber';
  children: React.ReactNode;
}) {
  const colorMap = { slate: 'text-ink-500', accent: 'text-accent-600', amber: 'text-amber-600' };
  return (
    <div>
      <div className={`flex items-center gap-2 mb-2 ${colorMap[color]}`}>
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-wide">{title}</p>
      </div>
      {children}
    </div>
  );
}
