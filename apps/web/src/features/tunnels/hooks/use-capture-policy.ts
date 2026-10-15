import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCapturePolicy, setCapturePolicy } from '../services/tunnel-service';

export function useCapturePolicy(tunnelID?: string) {
  return useQuery({
    queryKey: ['capture-policy', tunnelID],
    queryFn: () => getCapturePolicy(tunnelID as string),
    enabled: Boolean(tunnelID),
  });
}

export function useCapturePolicyMutation(tunnelID: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rulesJson: string) => setCapturePolicy(tunnelID, rulesJson),
    onSuccess: (policy) => {
      queryClient.setQueryData(['capture-policy', tunnelID], policy);
    },
  });
}
