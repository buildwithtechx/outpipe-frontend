import type { Entity } from '#/interfaces/api';

export type DNSProviderName = 'cloudflare';

export type DNSProviderCredential = Entity & {
  organizationId: string;
  provider: DNSProviderName;
  label: string;
  lastFour: string;
};

export type ConnectDNSProviderInput = {
  provider: DNSProviderName;
  token: string;
  label: string;
};
