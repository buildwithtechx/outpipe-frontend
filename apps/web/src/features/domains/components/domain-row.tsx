import { useState } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import type { Domain } from '#/interfaces/domain';
import type { useDomainMutations } from '../hooks/use-domain-mutations';
import { CopyButton } from './copy-button';

type VerifyMutation = ReturnType<typeof useDomainMutations>['verify'];
type RemoveMutation = ReturnType<typeof useDomainMutations>['remove'];

export function DomainRow({
  domain,
  verify,
  remove,
  bundleSize,
}: {
  domain: Domain;
  verify: VerifyMutation;
  remove: RemoveMutation;
  bundleSize?: number;
}) {
  const [token, setToken] = useState('');
  const challengeHost = `_outpipe-challenge.${domain.hostname.replace(/^\*\./, '')}`;
  const delegationHost = `_acme-challenge.${domain.hostname.replace(/^\*\./, '')}`;
  const isDelegated = domain.verificationMethod === 'dns-delegation';
  const needsToken =
    domain.status === 'pending' &&
    domain.verificationMethod !== 'dns-automation' &&
    !isDelegated;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-sm text-white/85">{domain.hostname}</p>
          {domain.dnsProvider && (
            <span className="rounded-full border border-indigo-300/30 bg-indigo-300/10 px-2 py-0.5 text-[11px] text-indigo-200">
              {domain.dnsProvider}
            </span>
          )}
          {domain.bundleGroup && (bundleSize ?? 0) > 1 && (
            <span
              className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/55"
              title={`Bundle group ${domain.bundleGroup}`}
            >
              bundle · {bundleSize}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-white/40">
          {domain.verificationMethod} verification
        </p>
        {domain.status === 'pending' && !isDelegated && (
          <p className="mt-1 font-mono text-xs text-white/55">
            TXT host: {challengeHost}
          </p>
        )}
        {domain.status === 'pending' && isDelegated && (
          <div className="mt-2 grid max-w-md gap-1.5">
            <p className="font-mono text-xs text-white/55">
              CNAME {delegationHost}
              {domain.delegationTarget ? ` → ${domain.delegationTarget}` : ''}
            </p>
            {domain.delegationTarget && (
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={domain.delegationTarget}
                  aria-label={`Delegation target for ${domain.hostname}`}
                  className="h-8 font-mono text-xs"
                />
                <CopyButton
                  value={domain.delegationTarget}
                  label={`delegation target for ${domain.hostname}`}
                />
              </div>
            )}
          </div>
        )}
        {domain.certificateExpiresAt && (
          <p className="mt-1 text-xs text-white/40">
            Certificate expires{' '}
            {new Date(domain.certificateExpiresAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
          {domain.status}
        </span>
        {needsToken && (
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const trimmed = token.trim();
              if (trimmed)
                verify.mutate({ domainId: domain.id, token: trimmed });
            }}
          >
            <Input
              aria-label={`Verification token for ${domain.hostname}`}
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Token"
              className="h-8 w-28 text-xs"
            />
            <Button
              type="submit"
              variant="outline"
              className="h-8 text-xs"
              disabled={verify.isPending || !token.trim()}
            >
              Verify
            </Button>
          </form>
        )}
        {(domain.verificationMethod === 'dns-automation' || isDelegated) &&
          domain.status === 'pending' && (
            <Button
              type="button"
              variant="outline"
              className="h-8 text-xs"
              disabled={verify.isPending}
              onClick={() => verify.mutate({ domainId: domain.id })}
            >
              Verify now
            </Button>
          )}
        <Button
          type="button"
          variant="ghost"
          className="h-8 text-xs text-rose-300 hover:text-rose-200"
          disabled={remove.isPending}
          onClick={() => remove.mutate(domain.id)}
          aria-label={`Delete ${domain.hostname}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
