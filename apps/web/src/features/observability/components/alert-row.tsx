import { ConfirmAction } from '#/components/feedback/confirm-action';
import { Button } from '#/components/ui/button';
import type { ObservabilityAlert } from '#/interfaces/alert';
import type { UptimeMonitor } from '#/interfaces/uptime';
import type { useAlertMutations } from '../hooks/use-alerts';
import { parseAlertMonitorIds } from '../lib/alert-helpers';
import { AlertStatePill } from './alert-state-pill';
import { AlertStatusPageEditor } from './alert-status-page-editor';

type Mutations = ReturnType<typeof useAlertMutations>;

export function AlertRow({
  alert,
  monitors,
  mutations,
  monitorNames,
}: {
  alert: ObservabilityAlert;
  monitors: UptimeMonitor[];
  mutations: Mutations;
  monitorNames: Map<string, string>;
}) {
  const monitorIds = parseAlertMonitorIds(alert.monitorIds);

  return (
    <div className="border-b border-white/5 px-4 py-4 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-white">{alert.name}</p>
            <AlertStatePill state={alert.state} />
            {!alert.enabled && (
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/45">
                disabled
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/45">
            {monitorIds.length === 0
              ? 'No monitors linked'
              : monitorIds
                  .map((id) => monitorNames.get(id) ?? id.slice(0, 8))
                  .join(', ')}
            {' · '}
            {alert.consecutiveFailures} failures / {alert.consecutiveRecoveries}{' '}
            recoveries every {alert.evalIntervalSeconds}s
          </p>
          {alert.statusPageTitle && (
            <p className="mt-1 text-xs text-white/55">
              Status page: {alert.statusPageTitle}
              {alert.statusPageImpact ? ` (${alert.statusPageImpact})` : ''}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={mutations.toggleEnabled.isPending}
            onClick={() =>
              mutations.toggleEnabled.mutate({
                alertId: alert.id,
                enabled: !alert.enabled,
              })
            }
            aria-pressed={alert.enabled}
            className="h-7 text-xs border-white/10 bg-white/5 text-white/80"
          >
            {alert.enabled ? 'Disable' : 'Enable'}
          </Button>
          <ConfirmAction
            title={`Delete ${alert.name}?`}
            description="This removes the alert rule. Linked status page incidents stay resolved as-is."
            label="Delete"
            pending={mutations.removeAlert.isPending}
            onConfirm={() => mutations.removeAlert.mutateAsync(alert.id)}
          />
        </div>
      </div>
      <AlertStatusPageEditor
        alert={alert}
        monitors={monitors}
        saveStatusPage={mutations.saveStatusPage}
      />
    </div>
  );
}
