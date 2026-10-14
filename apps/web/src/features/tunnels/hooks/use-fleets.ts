import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkCreateFleetTunnels,
  createFleet,
  deleteFleet,
  getFleetStatus,
  listFleets,
  reconcileFleet,
  rotateFleetTokens,
} from '../services/fleet-service';

export function useFleets(organizationId?: string) {
  return useQuery({
    queryKey: ['machine-fleets', organizationId],
    queryFn: () => listFleets(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useFleetStatus(organizationId?: string, fleetId?: string) {
  return useQuery({
    queryKey: ['machine-fleet-status', organizationId, fleetId],
    queryFn: () => getFleetStatus(organizationId as string, fleetId as string),
    enabled: Boolean(organizationId && fleetId),
    refetchInterval: 15000,
  });
}

export function useFleetMutations(organizationId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['machine-fleets'] });

  const create = useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      createFleet(organizationId, input),
    onSuccess: () => invalidate(),
  });

  const remove = useMutation({
    mutationFn: (fleetId: string) => deleteFleet(organizationId, fleetId),
    onSuccess: () => invalidate(),
  });

  const bulkCreate = useMutation({
    mutationFn: ({
      fleetId,
      specs,
    }: {
      fleetId: string;
      specs: Parameters<typeof bulkCreateFleetTunnels>[2];
    }) => bulkCreateFleetTunnels(organizationId, fleetId, specs),
    onSuccess: () => {
      void invalidate();
      void queryClient.invalidateQueries({
        queryKey: ['machine-fleet-status'],
      });
    },
  });

  const rotate = useMutation({
    mutationFn: (fleetId: string) => rotateFleetTokens(organizationId, fleetId),
    onSuccess: () => {
      void invalidate();
      void queryClient.invalidateQueries({
        queryKey: ['machine-fleet-status'],
      });
    },
  });

  const reconcile = useMutation({
    mutationFn: (fleetId: string) => reconcileFleet(organizationId, fleetId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['machine-fleet-status'] }),
  });

  return { create, remove, bulkCreate, rotate, reconcile };
}
