import type { Entity } from '#/interfaces/api';

export type AlertState = 'ok' | 'firing';

export type AlertImpact = 'degraded' | 'outage';

export type ObservabilityAlert = Entity & {
  organizationId: string;
  name: string;
  monitorIds: string;
  consecutiveFailures: number;
  consecutiveRecoveries: number;
  evalIntervalSeconds: number;
  state: AlertState;
  enabled: boolean;
  statusPageTitle?: string;
  statusPageImpact?: AlertImpact;
  lastEvaluatedAt?: string;
  nextEvaluationAt?: string;
};

export type CreateAlertInput = {
  name: string;
  monitorIds: string[];
  consecutiveFailures?: number;
  consecutiveRecoveries?: number;
  evalIntervalSeconds?: number;
  statusPageTitle?: string;
  statusPageImpact?: AlertImpact;
};

export type SetAlertStatusPageInput = {
  publicTitle: string;
  impact: AlertImpact;
  componentIds: string[];
};
