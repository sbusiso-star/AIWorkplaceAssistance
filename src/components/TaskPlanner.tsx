import { useState } from 'react';
import { ListChecks, Sparkles, Plus, Trash2, Calendar, Flag, Clock } from 'lucide-react';
import { Card, SectionTitle, Badge, LoadingDots, SkeletonLines, Disclaimer, EmptyState } from '@/components/ui';
import { planTasks, withDelay, type TaskInput, type TaskPlanOutput } from '@/lib/ai';

const today = new Date();
const defaultDue = new Date(today.getTime() + 3 * 86400000).toISOString().slice(0, 10);

export function TaskPlanner() {
  const [tasks, setTasks] = useState<TaskInput[]>([
    { text: '', due: defaultDue, priority: 'medium', estimate: 2 },
  ]);
  const [output, setOutput] = useState<TaskPlanOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const addTask = () =>
    setTasks([...tasks, { text: '', due: defaultDue, priority: 'medium', estimate: 2 }]);

  const removeTask = (i: number) => setTasks(tasks.filter((_, idx) => idx !== i));

  const updateTask = (i: number, patch: Partial<TaskInput>) =>
    setTasks(tasks.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const handlePlan = async () => {
    const valid = tasks.filter((t) => t.text.trim());
    if (valid.length === 0) return;
    setLoading(true);
    setOutput(null);
    const result = await withDelay(planTasks(valid));
    setOutput(result);
    setLoading(false);
  };

  const priorityColor: Record<string, 'rose' | 'amber' | 'accent'> = {
    high: 'rose',
    medium: 'amber',
    low: 'accent',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionTitle
        title="AI Task Planner"
        subtitle="List your tasks and let AI prioritize and schedule them into time blocks."
        icon={<ListChecks className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="space-y-3">
            <p className="label">Your Tasks</p>
            {tasks.map((task, i) => (
              <div key={i} className="rounded-xl border border-ink-200 p-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    className="input flex-1"
                    placeholder={`Task ${i + 1} — e.g. Review quarterly report`}
                    value={task.text}
                    onChange={(e) => updateTask(i, { text: e.target.value })}
                  />
                  {tasks.length > 1 && (
                    <button onClick={() => removeTask(i)} className="btn-ghost p-2 text-ink-400 hover:text-rose-600" aria-label="Remove task">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-ink-500 flex items-center gap-1 mb-1"><Calendar className="h-3 w-3" /> Due</label>
                    <input type="date" className="input text-sm" value={task.due} onChange={(e) => updateTask(i, { due: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink-500 flex items-center gap-1 mb-1"><Flag className="h-3 w-3" /> Priority</label>
                    <select className="input text-sm" value={task.priority} onChange={(e) => updateTask(i, { priority: e.target.value as TaskInput['priority'] })}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-ink-500 flex items-center gap-1 mb-1"><Clock className="h-3 w-3" /> Hours</label>
                    <input type="number" min={0.5} step={0.5} className="input text-sm" value={task.estimate} onChange={(e) => updateTask(i, { estimate: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addTask} className="btn-outline w-full px-4 py-2.5 text-sm">
              <Plus className="h-4 w-4" /> Add Task
            </button>

            <button onClick={handlePlan} disabled={loading || tasks.every((t) => !t.text.trim())} className="btn-primary w-full px-5 py-2.5 text-sm">
              <Sparkles className="h-4 w-4" /> {loading ? 'Planning…' : 'Generate Schedule'}
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink-900 mb-4">Optimized Schedule</h3>

          {loading && (
            <div className="space-y-4">
              <SkeletonLines lines={2} />
              <div className="h-px bg-ink-100" />
              <SkeletonLines lines={5} />
              <LoadingDots label="Optimizing your day" />
            </div>
          )}

          {!loading && !output && (
            <EmptyState icon={<ListChecks className="h-8 w-8" />} title="Your AI schedule will appear here" hint="Add tasks and generate a plan." />
          )}

          {!loading && output && (
            <div className="animate-slide-in space-y-4">
              <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-4 text-white shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-100 mb-1">AI Recommendation</p>
                <p className="text-sm leading-relaxed">{output.recommendation}</p>
              </div>

              <div className="space-y-2.5">
                {output.schedule.map((task, i) => (
                  <div key={task.id} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 hover:shadow-soft transition-all">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 text-sm font-semibold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{task.text}</p>
                      <p className="text-xs text-ink-500">{task.slot}</p>
                    </div>
                    <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>
                    <span className="text-[11px] text-ink-400 shrink-0">{task.estimate}h</span>
                  </div>
                ))}
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
