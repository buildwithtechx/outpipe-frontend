import { useState } from 'react';
import { ConfirmAction } from '#/components/feedback/confirm-action';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import type { StatusPageSubscriber } from '#/interfaces';
import {
  useMonitors,
  useSubscriberMutations,
  useSubscribers,
} from './hooks/use-uptime';

type Filter = 'all' | 'pending' | 'confirmed' | 'unsubscribed';

export function SubscribersSettings({ orgId }: { orgId: string }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const subscribers = useSubscribers(orgId, {
    status: filter,
    q: debounced || undefined,
  });
  const monitors = useMonitors(orgId);
  const mutations = useSubscriberMutations(orgId);
  const rows = subscribers.data?.subscribers ?? [];
  const counts = subscribers.data?.counts ?? {
    pending: 0,
    confirmed: 0,
    unsubscribed: 0,
  };
  const enabled = subscribers.data?.subscriptionsEnabled ?? true;

  function onSearch(value: string) {
    setQuery(value);
    window.clearTimeout((onSearch as { timer?: number }).timer);
    (onSearch as { timer?: number }).timer = window.setTimeout(
      () => setDebounced(value.trim()),
      300,
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <h2 className="font-semibold">Email subscriptions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {enabled
              ? 'Double opt-in is on. New signups confirm by email before receiving incident updates.'
              : 'Subscriptions are paused. The public signup form is disabled and pending confirmations will not complete.'}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            disabled={mutations.toggleSubscriptions.isPending}
            onChange={(event) =>
              mutations.toggleSubscriptions.mutate(event.target.checked)
            }
          />
          Subscriptions enabled
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'pending', 'confirmed', 'unsubscribed'] as Filter[]).map(
            (value) => (
              <Button
                key={value}
                variant={filter === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(value)}
              >
                {value === 'all'
                  ? `All (${rows.length})`
                  : `${value} (${counts[value] ?? 0})`}
              </Button>
            ),
          )}
          <div className="ml-auto w-full max-w-xs">
            <Label htmlFor="subscriber-search" className="sr-only">
              Search subscribers
            </Label>
            <Input
              id="subscriber-search"
              placeholder="Search by email…"
              value={query}
              onChange={(event) => onSearch(event.target.value)}
            />
          </div>
        </div>

        {subscribers.isLoading ? (
          <p role="status">Loading subscribers…</p>
        ) : subscribers.isError ? (
          <p role="alert">
            Could not load subscribers.{' '}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void subscribers.refetch()}
            >
              Try again
            </Button>
          </p>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No subscribers match this filter yet. Share your status page link to
            collect double opt-in signups.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {rows.map((subscriber) => (
              <SubscriberRow
                key={subscriber.id}
                subscriber={subscriber}
                monitors={monitors.data ?? []}
                onUnsubscribe={() =>
                  mutations.unsubscribe.mutateAsync(subscriber.id)
                }
                onRemove={() => mutations.remove.mutateAsync(subscriber.id)}
                onScope={(componentIds) =>
                  mutations.setScope.mutate({
                    subscriberId: subscriber.id,
                    componentIds,
                  })
                }
                unsubscribePending={mutations.unsubscribe.isPending}
                removePending={mutations.remove.isPending}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SubscriberRow({
  subscriber,
  monitors,
  onUnsubscribe,
  onRemove,
  onScope,
  unsubscribePending,
  removePending,
}: {
  subscriber: StatusPageSubscriber;
  monitors: { id: string; name: string }[];
  onUnsubscribe: () => Promise<unknown>;
  onRemove: () => Promise<unknown>;
  onScope: (componentIds: string[]) => void;
  unsubscribePending: boolean;
  removePending: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string[]>(subscriber.components);
  const scoped = subscriber.components.length > 0;

  return (
    <li className="space-y-2 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{subscriber.email}</p>
          <p className="text-xs text-muted-foreground">
            {subscriber.status}
            {scoped
              ? ` · ${subscriber.components.length} scoped service${subscriber.components.length === 1 ? '' : 's'}`
              : ' · all incidents'}
            {subscriber.lastSentAt
              ? ` · last notified ${new Date(subscriber.lastSentAt).toLocaleString()}`
              : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {subscriber.status === 'confirmed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelected(subscriber.components);
                setEditing((value) => !value);
              }}
            >
              {editing ? 'Close' : 'Scope'}
            </Button>
          )}
          {subscriber.status !== 'unsubscribed' && (
            <ConfirmAction
              title={`Unsubscribe ${subscriber.email}?`}
              description="They stop receiving incident emails immediately but stay listed for audit."
              label="Unsubscribe"
              pending={unsubscribePending}
              onConfirm={onUnsubscribe}
            />
          )}
          <ConfirmAction
            title={`Remove ${subscriber.email}?`}
            description="This permanently deletes the subscription record."
            label="Remove"
            pending={removePending}
            onConfirm={onRemove}
          />
        </div>
      </div>
      {editing && (
        <form
          className="space-y-2 rounded-xl border border-border p-3"
          onSubmit={(event) => {
            event.preventDefault();
            onScope(selected);
            setEditing(false);
          }}
        >
          <p className="text-xs text-muted-foreground">
            Leave everything unchecked to notify on every incident.
          </p>
          {monitors.map((monitor) => (
            <label key={monitor.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(monitor.id)}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, monitor.id]
                      : current.filter((id) => id !== monitor.id),
                  )
                }
              />
              {monitor.name}
            </label>
          ))}
          <Button type="submit" size="sm">
            Save scope
          </Button>
        </form>
      )}
    </li>
  );
}
