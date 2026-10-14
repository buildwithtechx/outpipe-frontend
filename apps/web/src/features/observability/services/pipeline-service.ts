import { apiClient } from '#/lib/api-client';

export interface QueueHealth {
  queue: string;
  depth: number;
  oldestAgeSecs?: number;
  deadLettered: number;
  healthy: boolean;
}

export interface PipelineHealth {
  organizationId: string;
  queues: QueueHealth[];
  healthy: boolean;
  checkedAt: string;
}

export interface DeadLetter {
  queue: string;
  id: string;
  eventType: string;
  attempts: number;
  lastError: string;
  updatedAt: string;
}

export function getPipelineHealth(organizationId: string) {
  return apiClient.get<PipelineHealth>(
    `/api/v1/organizations/${organizationId}/observability/pipelines`,
  );
}

export function getDeadLetters(organizationId: string, limit = 25) {
  return apiClient.get<DeadLetter[]>(
    `/api/v1/organizations/${organizationId}/observability/dead-letters?limit=${limit}`,
  );
}
