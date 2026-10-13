import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DomainVerificationMethod } from '#/interfaces/domain';
import {
  createDomain,
  deleteDomain,
  verifyDomain,
} from '../services/domain-service';

export function useDomainMutations(organizationId: string | undefined) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['domains', organizationId] });

  const create = useMutation({
    mutationFn: (input: {
      hostname: string;
      verificationMethod: DomainVerificationMethod;
    }) => createDomain(organizationId ?? '', input),
    onSuccess: invalidate,
  });

  const verify = useMutation({
    mutationFn: (input: { domainId: string; token?: string }) =>
      verifyDomain(input.domainId, input.token),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (domainId: string) => deleteDomain(domainId),
    onSuccess: invalidate,
  });

  return { create, verify, remove };
}
