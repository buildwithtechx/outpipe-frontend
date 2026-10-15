import { useState } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import type { AlertImpact, ObservabilityAlert } from '#/interfaces/alert';
import type { UptimeMonitor } from '#/interfaces/uptime';
import type { useAlertMutations } from '../hooks/use-alerts';

type SaveStatusPage = ReturnType<typeof useAlertMutations>['saveStatusPage'];

export function AlertStatusPageEditor({
  alert,
  monitors,
  saveStatusPage,
}: {
  alert: ObservabilityAlert;
  monitors: UptimeMonitor[];
  saveStatusPage: SaveStatusPage;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(alert.statusPageTitle ?? alert.name);
  const [impact, setImpact] = useState<AlertImpact>(
    alert.statusPageImpact ?? 'degraded',
  );
  const [selected, setSelected] = useState<string[]>(monitors.map((m) => m.id));
  const trimmedTitle = title.trim();
  const canSave = trimmedTitle.length > 0 && !saveStatusPage.isPending;

  function toggleComponent(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-7 text-xs border-white/10 bg-white/5 text-white/80"
      >
        Status page link
      </Button>
    );
  }

  return (
    <form
      className="mt-3 space-y-3 rounded-lg border border-white/10 bg-black/30 p-3 text-left"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) return;
        saveStatusPage.mutate(
          {
            alertId: alert.id,
            input: {
              publicTitle: trimmedTitle,
              impact,
              componentIds: selected,
            },
          },
          { onSuccess: () => setOpen(false) },
        );
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor={`alert-title-${alert.id}`} className="text-white/70">
          Public title
        </Label>
        <Input
          id={`alert-title-${alert.id}`}
          required
          maxLength={255}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="grid gap-2">
        <Label className="text-xs text-white/70">Impact</Label>
        <Select
          value={impact}
          onValueChange={(value) => setImpact(value as AlertImpact)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="outage">Outage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <fieldset className="grid gap-1.5">
        <legend className="text-xs text-white/70">
          Status page components
        </legend>
        {monitors.length === 0 ? (
          <p className="text-xs text-white/45">No monitors to link.</p>
        ) : (
          monitors.map((monitor) => (
            <label
              key={monitor.id}
              className="flex cursor-pointer items-center gap-2 text-xs text-white/75"
            >
              <input
                type="checkbox"
                checked={selected.includes(monitor.id)}
                onChange={() => toggleComponent(monitor.id)}
                className="size-3.5 accent-indigo-500"
              />
              {monitor.name}
            </label>
          ))
        )}
      </fieldset>
      <p className="text-[11px] text-white/40">
        Firing publishes an incident automatically; recovery annotates it.
      </p>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="h-7 text-xs text-white/60"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!canSave}
          className="h-7 text-xs"
        >
          {saveStatusPage.isPending ? 'Saving…' : 'Save link'}
        </Button>
      </div>
    </form>
  );
}
