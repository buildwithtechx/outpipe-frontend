import type {
  CreateAlertInput,
  ObservabilityAlert,
  SetAlertStatusPageInput,
} from '#/interfaces/alert';
import { apiClient } from '#/lib/api-client';

export type { CreateAlertInput, ObservabilityAlert, SetAlertStatusPageInput };

function alertsPath(organizationId: string) {
  return `/api/v1/organizations/${encodeURIComponent(organizationId)}/observability/alerts`;
}

export function getAlerts(organizationId: string) {
  return apiClient.get<ObservabilityAlert[]>(alertsPath(organizationId));
}

export function createAlert(organizationId: string, input: CreateAlertInput) {
  return apiClient.post<ObservabilityAlert>(alertsPath(organizationId), {
    name: input.name,
    monitorIds: input.monitorIds,
    consecutiveFailures: input.consecutiveFailures ?? 3,
    consecutiveRecoveries: input.consecutiveRecoveries ?? 2,
    evalIntervalSeconds: input.evalIntervalSeconds ?? 60,
    statusPageTitle: input.statusPageTitle,
    statusPageImpact: input.statusPageImpact,
  });
}

export function deleteAlert(organizationId: string, alertId: string) {
  return apiClient.delete<void>(
    `${alertsPath(organizationId)}/${encodeURIComponent(alertId)}`,
  );
}

export function setAlertStatusPage(
  organizationId: string,
  alertId: string,
  input: SetAlertStatusPageInput,
) {
  return apiClient.patch<ObservabilityAlert>(
    `${alertsPath(organizationId)}/${encodeURIComponent(alertId)}/status-page`,
    {
      publicTitle: input.publicTitle,
      impact: input.impact,
      componentIds: input.componentIds,
    },
  );
}

export function setAlertEnabled(
  organizationId: string,
  alertId: string,
  enabled: boolean,
) {
  return apiClient.patch<ObservabilityAlert>(
    `${alertsPath(organizationId)}/${encodeURIComponent(alertId)}/enabled`,
    { enabled },
  );
}
