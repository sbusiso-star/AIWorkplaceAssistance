import { useState } from 'react';
import { Mail, Sparkles, RotateCcw } from 'lucide-react';
import { Card, SectionTitle, Badge, CopyButton, LoadingDots, SkeletonLines, Disclaimer, EmptyState } from '@/components/ui';
import { generateEmail, withDelay, type EmailInput, type EmailOutput, type Tone, type Audience } from '@/lib/ai';

const tones: Tone[] = ['professional', 'friendly', 'persuasive', 'urgent', 'empathetic'];
const audiences: Audience[] = ['executive', 'team', 'client', 'vendor', 'general'];

export function EmailGenerator() {
  const [input, setInput] = useState<EmailInput>({
    topic: '',
    keyPoints: '',
    tone: 'professional',
    audience: 'team',
    senderName: '',
    recipientName: '',
  });
  const [output, setOutput] = useState<EmailOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.topic.trim()) return;
    setLoading(true);
    setOutput(null);
    const result = await withDelay(generateEmail(input));
    setOutput(result);
    setLoading(false);
  };

  const handleReset = () => {
    setOutput(null);
    setInput({ topic: '', keyPoints: '', tone: 'professional', audience: 'team', senderName: '', recipientName: '' });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionTitle
        title="Smart Email Generator"
        subtitle="Draft polished emails by choosing a tone, audience, and key points."
        icon={<Mail className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <Card>
          <div className="space-y-4">
            <div>
              <label className="label">Email Topic</label>
              <input
                className="input"
                placeholder="e.g. Q3 product launch timeline"
                value={input.topic}
                onChange={(e) => setInput({ ...input, topic: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Your Name</label>
                <input
                  className="input"
                  placeholder="Jordan Lee"
                  value={input.senderName}
                  onChange={(e) => setInput({ ...input, senderName: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Recipient Name</label>
                <input
                  className="input"
                  placeholder="Alex Morgan"
                  value={input.recipientName}
                  onChange={(e) => setInput({ ...input, recipientName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Key Points (one per line)</label>
              <textarea
                className="input min-h-[110px] resize-y"
                placeholder={'Launch is on track for Sept 15\nNeed final designs by Sept 8\nBudget approved at $50k'}
                value={input.keyPoints}
                onChange={(e) => setInput({ ...input, keyPoints: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tone</label>
                <select className="input" value={input.tone} onChange={(e) => setInput({ ...input, tone: e.target.value as Tone })}>
                  {tones.map((t) => (
                    <option key={t} value={t}>{capitalize(t)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Audience</label>
                <select className="input" value={input.audience} onChange={(e) => setInput({ ...input, audience: e.target.value as Audience })}>
                  {audiences.map((a) => (
                    <option key={a} value={a}>{capitalize(a)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={handleGenerate} disabled={loading || !input.topic.trim()} className="btn-primary px-5 py-2.5 text-sm flex-1">
                <Sparkles className="h-4 w-4" /> {loading ? 'Generating…' : 'Generate Email'}
              </button>
              <button onClick={handleReset} className="btn-outline px-4 py-2.5 text-sm">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </Card>

        {/* Output */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink-900">Generated Email</h3>
            {output && (
              <div className="flex items-center gap-2">
                <Badge color="primary">{capitalize(input.tone)}</Badge>
                <Badge color="slate">{capitalize(input.audience)}</Badge>
              </div>
            )}
          </div>

          {loading && (
            <div className="space-y-4">
              <SkeletonLines lines={2} />
              <div className="h-px bg-ink-100" />
              <SkeletonLines lines={5} />
              <LoadingDots label="Drafting your email" />
            </div>
          )}

          {!loading && !output && (
            <EmptyState icon={<Mail className="h-8 w-8" />} title="Your email will appear here" hint="Fill in the topic and key points, then generate." />
          )}

          {!loading && output && (
            <div className="animate-slide-in">
              <div className="rounded-xl bg-ink-50 border border-ink-200 p-3.5 mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 mb-1">Subject</p>
                <p className="text-sm font-medium text-ink-900">{output.subject}</p>
              </div>
              <div className="rounded-xl border border-ink-200 p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-ink-700 leading-relaxed">{output.body}</pre>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <CopyButton text={`${output.subject}\n\n${output.body}`} label="Copy email" />
              </div>
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
