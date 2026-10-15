import { useState } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import type { UptimeMonitor } from '#/interfaces/uptime';
import type { useAlertMutations } from '../hooks/use-alerts';
import { validAlertName, validAlertThresholds } from '../lib/alert-helpers';

type AddAlert = ReturnType<typeof useAlertMutations>['addAlert'];

export function AlertCreateForm({
  addAlert,
  monitors,
}: {
  addAlert: AddAlert;
  monitors: UptimeMonitor[];
}) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [failures, setFailures] = useState(3);
  const [recoveries, setRecoveries] = useState(2);
  const [intervalSeconds, setIntervalSeconds] = useState(60);

  const nameOk = validAlertName(name);
  const thresholdsOk = validAlertThresholds(
    failures,
    recoveries,
    intervalSeconds,
  );
  const canSubmit =
    nameOk && thresholdsOk && selected.length > 0 && !addAlert.isPending;

  function toggleMonitor(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) return;
        addAlert.mutate(
          {
            name: name.trim(),
            monitorIds: selected,
            consecutiveFailures: failures,
            consecutiveRecoveries: recoveries,
            evalIntervalSeconds: intervalSeconds,
          },
          {
            onSuccess: () => {
              setName('');
              setSelected([]);
              setFailures(3);
              setRecoveries(2);
              setIntervalSeconds(60);
            },
          },
        );
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="alert-name" className="text-white/70">
          Alert name
        </Label>
        <Input
          id="alert-name"
          required
          maxLength={255}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. API outage"
          className="rounded-xl border-white/10 bg-black/40 text-white"
        />
      </div>
      <fieldset className="grid gap-2">
        <legend className="text-xs text-white/70">Monitors</legend>
        {monitors.length === 0 ? (
          <p className="text-xs text-white/45">
            No uptime monitors yet. Add one on the Uptime page first.
          </p>
        ) : (
          <div className="grid max-h-40 gap-1.5 overflow-y-auto">
            {monitors.map((monitor) => (
              <label
                key={monitor.id}
                className="flex cursor-pointer items-center gap-2 text-xs text-white/75"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(monitor.id)}
                  onChange={() => toggleMonitor(monitor.id)}
                  className="size-3.5 accent-indigo-500"
                />
                <span className="font-medium">{monitor.name}</span>
                <span className="truncate font-mono text-white/40">
                  {monitor.url}
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>
      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="alert-failures" className="text-white/70">
            Failures
          </Label>
          <Input
            id="alert-failures"
            type="number"
            min={1}
            max={20}
            value={failures}
            onChange={(event) => setFailures(Number(event.target.value))}
            className="rounded-xl border-white/10 bg-black/40 text-white"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="alert-recoveries" className="text-white/70">
            Recoveries
          </Label>
          <Input
            id="alert-recoveries"
            type="number"
            min={1}
            max={20}
            value={recoveries}
            onChange={(event) => setRecoveries(Number(event.target.value))}
            className="rounded-xl border-white/10 bg-black/40 text-white"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="alert-interval" className="text-white/70">
            Interval (s)
          </Label>
          <Input
            id="alert-interval"
            type="number"
            min={15}
            max={3600}
            value={intervalSeconds}
            onChange={(event) => setIntervalSeconds(Number(event.target.value))}
            className="rounded-xl border-white/10 bg-black/40 text-white"
          />
        </div>
      </div>
      {addAlert.isError && (
        <p role="alert" className="text-xs text-rose-300">
          Could not create the alert. Check the name and monitors, then try
          again.
        </p>
      )}
      <Button type="submit" size="sm" disabled={!canSubmit}>
        {addAlert.isPending ? 'Creating…' : 'Create alert'}
      </Button>
    </form>
  );
}
