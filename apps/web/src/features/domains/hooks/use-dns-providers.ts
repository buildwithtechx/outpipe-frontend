import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ConnectDNSProviderInput } from '#/interfaces/dns-provider';
import {
  connectDNSProvider,
  deleteDNSProvider,
  listDNSProviders,
} from '../services/domain-service';

export function useDNSProviders(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['dns-providers', organizationId],
    queryFn: () => listDNSProviders(organizationId as string),
    enabled: Boolean(organizationId),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ['dns-providers', organizationId],
    });

  const connect = useMutation({
    mutationFn: (input: ConnectDNSProviderInput) =>
      connectDNSProvider(organizationId ?? '', input),
    onSuccess: invalidate,
  });

  const disconnect = useMutation({
    mutationFn: (credentialId: string) =>
      deleteDNSProvider(organizationId ?? '', credentialId),
    onSuccess: invalidate,
  });

  return { ...query, connect, disconnect };
}
