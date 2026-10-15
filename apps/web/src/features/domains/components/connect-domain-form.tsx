import { useState } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import type { DomainVerificationMethod } from '#/interfaces/domain';
import type { useDomainMutations } from '../hooks/use-domain-mutations';
import { CopyButton } from './copy-button';

type CreateMutation = ReturnType<typeof useDomainMutations>['create'];
type CreateBundleMutation = ReturnType<
  typeof useDomainMutations
>['createBundle'];

function stripWildcard(hostname: string) {
  return hostname.replace(/^\*\./, '');
}

export function ConnectDomainForm({
  create,
  createBundle,
  isAtLimit,
  onLimitReached,
}: {
  create: CreateMutation;
  createBundle: CreateBundleMutation;
  isAtLimit: boolean;
  onLimitReached: () => void;
}) {
  const [hostname, setHostname] = useState('');
  const [verificationMethod, setVerificationMethod] =
    useState<DomainVerificationMethod>('dns');
  const [bundleMode, setBundleMode] = useState(false);
  const [delegated, setDelegated] = useState(false);
  const trimmedHostname = hostname.trim().toLowerCase();
  const isWildcard = trimmedHostname.startsWith('*.');
  const effectiveMethod: DomainVerificationMethod = isWildcard
    ? 'dns-automation'
    : verificationMethod;
  const apexHostname = stripWildcard(trimmedHostname);
  const challengeHost = trimmedHostname
    ? `_outpipe-challenge.${apexHostname}`
    : '';
  const delegationHost = apexHostname ? `_acme-challenge.${apexHostname}` : '';
  const useBundleEndpoint = bundleMode && !isWildcard && apexHostname !== '';
  const pending =
    create.isPending || createBundle.isPending || !trimmedHostname;
  const createdDelegationTarget = create.data?.domain.delegationTarget;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isAtLimit) {
      onLimitReached();
      return;
    }
    if (!trimmedHostname) return;
    if (useBundleEndpoint) {
      createBundle.mutate({
        hostname: apexHostname,
        wildcard: true,
        delegated,
      });
      return;
    }
    create.mutate({
      hostname: trimmedHostname,
      verificationMethod: delegated ? 'dns-delegation' : effectiveMethod,
    });
  }

  return (
    <section className="mt-8 rounded-2xl border border-indigo-300/20 bg-indigo-300/[0.04] p-6">
      <h2 className="text-lg font-medium">Connect a domain</h2>
      <form
        className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px_auto]"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-2">
          <Label htmlFor="domain-hostname" className="text-white/70">
            Hostname
          </Label>
          <Input
            id="domain-hostname"
            required
            maxLength={253}
            value={hostname}
            onChange={(event) => setHostname(event.target.value)}
            placeholder="api.example.com or *.example.com"
            className="rounded-xl border-white/10 bg-black/40 text-white"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="domain-method" className="text-white/70">
            Verification
          </Label>
          <Select
            value={delegated ? 'dns-delegation' : effectiveMethod}
            onValueChange={(value) => {
              if (value === 'dns-delegation') {
                setDelegated(true);
              } else {
                setDelegated(false);
                setVerificationMethod(value as DomainVerificationMethod);
              }
            }}
            disabled={isWildcard}
          >
            <SelectTrigger
              id="domain-method"
              className="rounded-xl border-white/10 bg-black/40 text-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dns">DNS TXT</SelectItem>
              <SelectItem value="http">HTTP</SelectItem>
              <SelectItem value="dns-automation">DNS automated</SelectItem>
              <SelectItem value="dns-delegation">DNS delegation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="self-end" disabled={pending}>
          {create.isPending || createBundle.isPending
            ? 'Connecting…'
            : 'Connect domain'}
        </Button>
      </form>
      <div className="mt-3 flex flex-col gap-2 text-xs text-white/55">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={bundleMode}
            disabled={isWildcard}
            onChange={(event) => setBundleMode(event.target.checked)}
            className="size-3.5 accent-indigo-500"
          />
          Create apex + wildcard bundle (example.com plus *.example.com)
        </label>
        {!isWildcard && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={delegated}
              onChange={(event) => setDelegated(event.target.checked)}
              className="size-3.5 accent-indigo-500"
            />
            Use CNAME delegation (no API token needed)
          </label>
        )}
      </div>
      {isWildcard && (
        <p className="mt-3 text-xs text-white/45">
          Wildcard hostnames require automated DNS verification. Connect a DNS
          provider below first.
        </p>
      )}
      {delegated && !isWildcard && (
        <p className="mt-3 text-xs text-white/45">
          Delegated verification points{' '}
          <span className="font-mono">
            _acme-challenge.{apexHostname || '<host>'}
          </span>{' '}
          at the Outpipe challenge zone with a CNAME, then verify below. No
          provider token is required.
        </p>
      )}
      {(create.isError || createBundle.isError) && (
        <p role="alert" className="mt-3 text-xs text-rose-300">
          Could not connect the domain. Check the hostname and try again.
        </p>
      )}
      {create.data?.verificationToken && (
        <div className="mt-4 grid gap-2">
          <Label htmlFor="domain-token" className="text-white/70">
            DNS verification token
          </Label>
          <Input
            id="domain-token"
            readOnly
            value={create.data.verificationToken}
            className="font-mono text-white"
          />
          <p className="font-mono text-xs text-white/55">
            TXT host: {challengeHost}
          </p>
          <p className="text-xs text-white/45">
            {effectiveMethod === 'dns-automation'
              ? 'Outpipe will publish this TXT record automatically with your connected DNS provider, then verify below.'
              : 'Add this token as a TXT record at the host above, then verify the domain below.'}
          </p>
        </div>
      )}
      {create.data && delegated && createdDelegationTarget && (
        <div className="mt-4 grid gap-2">
          <Label className="text-white/70">
            Delegation target (CNAME value)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={createdDelegationTarget}
              aria-label="Delegation CNAME target"
              className="font-mono text-white"
            />
            <CopyButton
              value={createdDelegationTarget}
              label="delegation target"
            />
          </div>
          <p className="font-mono text-xs text-white/55">
            CNAME host: {delegationHost} → {createdDelegationTarget}
          </p>
          <p className="text-xs text-white/45">
            Create the CNAME above, then verify the domain below. Status
            refreshes automatically.
          </p>
        </div>
      )}
      {createBundle.data && createBundle.data.length > 0 && (
        <div className="mt-4 grid gap-2">
          <p className="text-xs text-white/70">
            Bundle created ({createBundle.data.length} domains). Status
            refreshes automatically.
          </p>
          {createBundle.data.map((domain) => (
            <div
              key={domain.id}
              className="rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <p className="font-mono text-xs text-white/85">
                {domain.hostname}
              </p>
              {domain.delegationTarget ? (
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    readOnly
                    value={domain.delegationTarget}
                    aria-label={`Delegation target for ${domain.hostname}`}
                    className="h-8 font-mono text-xs text-white"
                  />
                  <CopyButton
                    value={domain.delegationTarget}
                    label={`delegation target for ${domain.hostname}`}
                  />
                </div>
              ) : null}
              {domain.delegationTarget && (
                <p className="mt-1 font-mono text-[11px] text-white/55">
                  CNAME _acme-challenge.
                  {domain.hostname.replace(/^\*\./, '')} →{' '}
                  {domain.delegationTarget}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
