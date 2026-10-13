import type { Entity } from '#/interfaces/api';

export type DomainStatus =
  | 'pending'
  | 'verified'
  | 'active'
  | 'failed'
  | 'revoked';

export type DomainVerificationMethod = 'dns' | 'http' | 'dns-automation';

export type Domain = Entity & {
  organizationId: string;
  tunnelId?: string;
  hostname: string;
  status: DomainStatus;
  verificationMethod: DomainVerificationMethod;
  verifiedAt?: string;
  certificateStatus: string;
  certificateExpiresAt?: string;
};
