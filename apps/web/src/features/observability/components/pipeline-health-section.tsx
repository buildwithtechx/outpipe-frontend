import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { QueryFeedback } from '#/components/feedback/query-feedback';
import { Card } from '#/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { useDeadLetters, usePipelineHealth } from '../hooks/use-pipeline';

function formatAge(secs?: number) {
  if (secs === undefined) return '—';
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m`;
  return `${Math.floor(secs / 3600)}h`;
}

export function PipelineHealthSection({ orgId }: { orgId: string }) {
  const health = usePipelineHealth(orgId);
  const deadLetters = useDeadLetters(orgId);
  const queues = health.data?.queues ?? [];
  const letters = deadLetters.data ?? [];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Pipeline health</h2>
        {health.data && (
          <span
            className={`flex items-center gap-1.5 text-xs ${health.data.healthy ? 'text-emerald-400' : 'text-amber-400'}`}
          >
            {health.data.healthy ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <AlertTriangle className="size-3.5" />
            )}
            {health.data.healthy ? 'All pipelines flowing' : 'Attention needed'}
          </span>
        )}
      </div>
      <QueryFeedback query={health} label="pipeline health">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {queues.map((queue) => (
            <Card
              key={queue.queue}
              className={`border-white/10 p-4 ${queue.healthy ? 'bg-white/5' : 'bg-amber-500/10 border-amber-500/30'}`}
            >
              <p className="text-xs text-white/50">{queue.queue}</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {queue.depth}
                <span className="ml-2 text-xs font-normal text-white/40">
                  queued
                </span>
              </p>
              <p className="mt-1 text-xs text-white/50">
                oldest {formatAge(queue.oldestAgeSecs)} · dead-lettered{' '}
                {queue.deadLettered}
              </p>
            </Card>
          ))}
        </div>
      </QueryFeedback>
      <Tabs defaultValue="dead-letters" className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="dead-letters" className="text-xs">
            Dead letters ({letters.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dead-letters" className="mt-0">
          <QueryFeedback query={deadLetters} label="dead letters">
            {letters.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-xs text-white/50">
                No dead-lettered deliveries. Failed exports and webhook
                deliveries that exhaust retries will appear here.
              </p>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-left text-xs text-white/70">
                  <thead className="bg-white/5 text-white/50 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-medium">Queue</th>
                      <th className="px-4 py-3 font-medium">Event</th>
                      <th className="px-4 py-3 font-medium">Attempts</th>
                      <th className="px-4 py-3 font-medium">Last error</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {letters.map((letter) => (
                      <tr key={`${letter.queue}-${letter.id}`}>
                        <td className="px-4 py-3 font-mono text-white/60">
                          {letter.queue}
                        </td>
                        <td className="px-4 py-3 font-mono text-white/80">
                          {letter.eventType}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {letter.attempts}
                        </td>
                        <td className="px-4 py-3 text-white/50 max-w-xs truncate">
                          {letter.lastError || '—'}
                        </td>
                        <td className="px-4 py-3 text-white/40">
                          {new Date(letter.updatedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </QueryFeedback>
        </TabsContent>
      </Tabs>
    </section>
  );
}
