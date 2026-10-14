import type {
  StatusPageSubscriber,
  SubscriberListResult,
  UptimeCheck,
  UptimeIncident,
  UptimeIncidentUpdate,
  UptimeMonitor,
  UptimeStatusPage,
} from '#/interfaces';
import { apiClient } from '#/lib/api-client';

export type {
  StatusPageSubscriber,
  SubscriberListResult,
  UptimeCheck,
  UptimeIncident,
  UptimeIncidentUpdate,
  UptimeMonitor,
  UptimeStatusPage,
};

export function getMonitors(organizationId: string) {
  return apiClient.get<UptimeMonitor[]>(
    `/api/v1/organizations/${organizationId}/uptime/monitors`,
  );
}

export function createMonitor(
  organizationId: string,
  input: {
    name: string;
    type: 'http' | 'https' | 'tcp' | 'icmp';
    target: string;
    interval_seconds?: number;
    timeout_seconds?: number;
    expected_status_code?: number;
    body_regex?: string;
    max_latency_ms?: number;
  },
) {
  return apiClient.post<UptimeMonitor>(
    `/api/v1/organizations/${organizationId}/uptime/monitors`,
    {
      name: input.name,
      protocol: input.type,
      url: input.target,
      intervalSeconds: input.interval_seconds,
      timeoutSeconds: input.timeout_seconds,
      expectedStatusCode: input.expected_status_code,
      bodyRegex: input.body_regex,
      maxLatencyMs: input.max_latency_ms,
    },
  );
}

export function deleteMonitor(organizationId: string, monitorId: string) {
  return apiClient.delete<void>(
    `/api/v1/organizations/${organizationId}/uptime/monitors/${monitorId}`,
  );
}

export function testMonitor(organizationId: string, monitorId: string) {
  return apiClient.post<UptimeCheck>(
    `/api/v1/organizations/${organizationId}/uptime/monitors/${monitorId}/probe`,
    {},
  );
}

export function getMonitorChecks(
  organizationId: string,
  monitorId: string,
  limit = 50,
) {
  return apiClient.get<UptimeCheck[]>(
    `/api/v1/organizations/${organizationId}/uptime/monitors/${monitorId}/checks?limit=${limit}`,
  );
}

export function getIncidents(organizationId: string) {
  return apiClient.get<UptimeIncident[]>(
    `/api/v1/organizations/${organizationId}/uptime/incidents`,
  );
}

export function createIncident(
  organizationId: string,
  input: {
    title: string;
    severity: 'minor' | 'major' | 'critical';
    message: string;
  },
) {
  return apiClient.post<UptimeIncident>(
    `/api/v1/organizations/${organizationId}/uptime/incidents`,
    input,
  );
}

export function updateIncident(
  organizationId: string,
  incidentId: string,
  input: {
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    message: string;
  },
) {
  return apiClient.post<UptimeIncidentUpdate>(
    `/api/v1/organizations/${organizationId}/uptime/incidents/${incidentId}/updates`,
    input,
  );
}

export function getStatusPageConfig(organizationId: string) {
  return apiClient
    .get<
      Omit<UptimeStatusPage, 'isPublic' | 'subscriptionsEnabled'> & {
        published: boolean;
        subscriptionsEnabled: boolean;
      }
    >(`/api/v1/organizations/${organizationId}/uptime/status-page`)
    .then((page) => ({ ...page, isPublic: page.published }));
}

export function updateStatusPageConfig(
  organizationId: string,
  input: {
    slug: string;
    title: string;
    description: string;
    is_public: boolean;
    customDomain?: string;
  },
) {
  return apiClient
    .post<
      Omit<UptimeStatusPage, 'isPublic' | 'subscriptionsEnabled'> & {
        published: boolean;
        subscriptionsEnabled: boolean;
      }
    >(`/api/v1/organizations/${organizationId}/uptime/status-page`, {
      slug: input.slug,
      title: input.title,
      description: input.description,
      published: input.is_public,
      customDomain: input.customDomain,
    })
    .then((page) => ({ ...page, isPublic: page.published }));
}

export function listSubscribers(
  organizationId: string,
  input?: { q?: string; status?: string; limit?: number; cursor?: string },
) {
  const params = new URLSearchParams();
  if (input?.q) params.set('q', input.q);
  if (input?.status) params.set('status', input.status);
  if (input?.limit) params.set('limit', String(input.limit));
  if (input?.cursor) params.set('cursor', input.cursor);
  const query = params.toString();
  return apiClient.get<SubscriberListResult>(
    `/api/v1/organizations/${organizationId}/uptime/status-page/subscribers${query ? `?${query}` : ''}`,
  );
}

export function setSubscriptionsEnabled(
  organizationId: string,
  enabled: boolean,
) {
  return apiClient.patch<{ subscriptionsEnabled: boolean }>(
    `/api/v1/organizations/${organizationId}/uptime/status-page/subscriptions`,
    { subscriptionsEnabled: enabled },
  );
}

export function removeSubscriber(organizationId: string, subscriberId: string) {
  return apiClient.delete<void>(
    `/api/v1/organizations/${organizationId}/uptime/status-page/subscribers/${subscriberId}`,
  );
}

export function managerUnsubscribe(
  organizationId: string,
  subscriberId: string,
) {
  return apiClient.post<StatusPageSubscriber>(
    `/api/v1/organizations/${organizationId}/uptime/status-page/subscribers/${subscriberId}/unsubscribe`,
    {},
  );
}

export function setSubscriberScope(
  organizationId: string,
  subscriberId: string,
  componentIds: string[],
) {
  return apiClient.put<StatusPageSubscriber>(
    `/api/v1/organizations/${organizationId}/uptime/status-page/subscribers/${subscriberId}/scope`,
    { componentIds },
  );
}
