import { apiClient } from '#/lib/api-client';

export interface MachineFleet {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetDrift {
  tunnelId: string;
  name: string;
  want: string;
  got: string;
  machineOwned: boolean;
  credentialOk: boolean;
}

export interface FleetStatus {
  fleet: MachineFleet;
  tokens: { id: string; name: string; revokedAt?: string }[];
  desiredTunnels: { tunnelId: string; name: string }[];
  liveTunnels: { id: string; name: string; status: string }[];
  drift: FleetDrift[];
}

export interface FleetReconcileResult {
  reactivated: number;
  recreated: number;
  skipped: number;
  errors?: string[];
}

export function listFleets(organizationId: string) {
  return apiClient.get<MachineFleet[]>(
    `/api/v1/organizations/${organizationId}/machine-fleets`,
  );
}

export function createFleet(
  organizationId: string,
  input: { name: string; description?: string },
) {
  return apiClient.post<MachineFleet>(
    `/api/v1/organizations/${organizationId}/machine-fleets`,
    input,
  );
}

export function getFleetStatus(organizationId: string, fleetId: string) {
  return apiClient.get<FleetStatus>(
    `/api/v1/organizations/${organizationId}/machine-fleets/${fleetId}`,
  );
}

export function deleteFleet(organizationId: string, fleetId: string) {
  return apiClient.delete<void>(
    `/api/v1/organizations/${organizationId}/machine-fleets/${fleetId}`,
  );
}

export function attachFleetToken(
  organizationId: string,
  fleetId: string,
  input: { machineTokenId: string; label?: string },
) {
  return apiClient.post(
    `/api/v1/organizations/${organizationId}/machine-fleets/${fleetId}/tokens`,
    input,
  );
}

export function bulkCreateFleetTunnels(
  organizationId: string,
  fleetId: string,
  specs: {
    name: string;
    protocol?: string;
    targetHost: string;
    targetPort: number;
    publicHostname?: string;
  }[],
) {
  return apiClient.post(
    `/api/v1/organizations/${organizationId}/machine-fleets/${fleetId}/tunnels`,
    specs,
  );
}

export function rotateFleetTokens(organizationId: string, fleetId: string) {
  return apiClient.post<{
    rotated: { id: string; name: string; raw: string }[];
  }>(
    `/api/v1/organizations/${organizationId}/machine-fleets/${fleetId}/rotate`,
    {},
  );
}

export function reconcileFleet(organizationId: string, fleetId: string) {
  return apiClient.post<FleetReconcileResult>(
    `/api/v1/organizations/${organizationId}/machine-fleets/${fleetId}/reconcile`,
    {},
  );
}
