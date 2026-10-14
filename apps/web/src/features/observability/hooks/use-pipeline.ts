import { useQuery } from '@tanstack/react-query';
import {
  getDeadLetters,
  getPipelineHealth,
} from '../services/pipeline-service';

export function usePipelineHealth(organizationId?: string) {
  return useQuery({
    queryKey: ['pipeline-health', organizationId],
    queryFn: () => getPipelineHealth(organizationId as string),
    enabled: Boolean(organizationId),
    refetchInterval: 30000,
  });
}

export function useDeadLetters(organizationId?: string, limit = 25) {
  return useQuery({
    queryKey: ['dead-letters', organizationId, limit],
    queryFn: () => getDeadLetters(organizationId as string, limit),
    enabled: Boolean(organizationId),
    refetchInterval: 30000,
  });
}
