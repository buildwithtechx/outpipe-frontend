import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateAlertInput,
  SetAlertStatusPageInput,
} from '#/interfaces/alert';
import {
  createAlert,
  deleteAlert,
  getAlerts,
  setAlertEnabled,
  setAlertStatusPage,
} from '../services/alert-service';

export function useAlerts(organizationId?: string) {
  return useQuery({
    queryKey: ['observability-alerts', organizationId],
    queryFn: () => getAlerts(organizationId as string),
    enabled: Boolean(organizationId),
    refetchInterval: 15000,
  });
}

export function useAlertMutations(organizationId: string) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ['observability-alerts', organizationId],
    });

  const addAlert = useMutation({
    mutationFn: (input: CreateAlertInput) => createAlert(organizationId, input),
    onSuccess: invalidate,
  });

  const removeAlert = useMutation({
    mutationFn: (alertId: string) => deleteAlert(organizationId, alertId),
    onSuccess: invalidate,
  });

  const saveStatusPage = useMutation({
    mutationFn: ({
      alertId,
      input,
    }: {
      alertId: string;
      input: SetAlertStatusPageInput;
    }) => setAlertStatusPage(organizationId, alertId, input),
    onSuccess: invalidate,
  });

  const toggleEnabled = useMutation({
    mutationFn: ({ alertId, enabled }: { alertId: string; enabled: boolean }) =>
      setAlertEnabled(organizationId, alertId, enabled),
    onSuccess: invalidate,
  });

  return { addAlert, removeAlert, saveStatusPage, toggleEnabled };
}
