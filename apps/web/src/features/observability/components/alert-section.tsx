import { QueryFeedback } from '#/components/feedback/query-feedback';
import { useMonitors } from '#/features/uptime/hooks/use-uptime';
import { useAlertMutations, useAlerts } from '../hooks/use-alerts';
import { AlertCreateForm } from './alert-create-form';
import { AlertRow } from './alert-row';

export function AlertSection({ orgId }: { orgId: string }) {
  const alertsQuery = useAlerts(orgId);
  const { data: alerts = [] } = alertsQuery;
  const monitorsQuery = useMonitors(orgId);
  const { data: monitors = [] } = monitorsQuery;
  const mutations = useAlertMutations(orgId);
  const monitorNames = new Map(monitors.map((m) => [m.id, m.name]));

  return (
    <QueryFeedback query={alertsQuery} label="alerts">
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <AlertCreateForm addAlert={mutations.addAlert} monitors={monitors} />
        <div className="rounded-xl border border-white/10 bg-white/5">
          {alerts.length === 0 ? (
            <p className="p-8 text-center text-xs text-white/40">
              No alerts yet. Create one to page the status page when monitors
              fail consecutively.
            </p>
          ) : (
            alerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                monitors={monitors}
                mutations={mutations}
                monitorNames={monitorNames}
              />
            ))
          )}
        </div>
      </div>
    </QueryFeedback>
  );
}
