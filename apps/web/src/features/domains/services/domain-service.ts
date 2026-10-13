import type {
  ConnectDNSProviderInput,
  DNSProviderCredential,
} from '#/interfaces/dns-provider';
import type { Domain, DomainVerificationMethod } from '#/interfaces/domain';
import { apiClient } from '#/lib/api-client';

export function getDomains(organizationId: string) {
  return apiClient.get<Domain[]>(
    `/api/v1/organizations/${organizationId}/domains`,
  );
}

export function createDomain(
  organizationId: string,
  input: {
    hostname: string;
    verificationMethod: DomainVerificationMethod;
    tunnelId?: string;
  },
) {
  return apiClient.post<{ domain: Domain; verificationToken: string }>(
    `/api/v1/organizations/${organizationId}/domains`,
    input,
  );
}

export function verifyDomain(domainId: string, token?: string) {
  return apiClient.post<void>(
    `/api/v1/domains/${domainId}/verify`,
    token ? { token } : {},
  );
}

export function deleteDomain(domainId: string) {
  return apiClient.delete<void>(`/api/v1/domains/${domainId}`);
}

export function listDNSProviders(organizationId: string) {
  return apiClient.get<DNSProviderCredential[]>(
    `/api/v1/organizations/${organizationId}/dns-providers`,
  );
}

export function connectDNSProvider(
  organizationId: string,
  input: ConnectDNSProviderInput,
) {
  return apiClient.post<DNSProviderCredential>(
    `/api/v1/organizations/${organizationId}/dns-providers`,
    input,
  );
}

export function deleteDNSProvider(
  organizationId: string,
  credentialId: string,
) {
  return apiClient.delete<void>(
    `/api/v1/organizations/${organizationId}/dns-providers/${credentialId}`,
  );
}
