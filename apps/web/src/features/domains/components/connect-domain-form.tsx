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

type CreateMutation = ReturnType<typeof useDomainMutations>['create'];

export function ConnectDomainForm({
  create,
  isAtLimit,
  onLimitReached,
}: {
  create: CreateMutation;
  isAtLimit: boolean;
  onLimitReached: () => void;
}) {
  const [hostname, setHostname] = useState('');
  const [verificationMethod, setVerificationMethod] =
    useState<DomainVerificationMethod>('dns');
  const trimmedHostname = hostname.trim().toLowerCase();
  const isWildcard = trimmedHostname.startsWith('*.');
  const effectiveMethod: DomainVerificationMethod = isWildcard
    ? 'dns-automation'
    : verificationMethod;
  const challengeHost = trimmedHostname
    ? `_outpipe-challenge.${trimmedHostname.replace(/^\*\./, '')}`
    : '';

  return (
    <section className="mt-8 rounded-2xl border border-indigo-300/20 bg-indigo-300/[0.04] p-6">
      <h2 className="text-lg font-medium">Connect a domain</h2>
      <form
        className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          if (isAtLimit) {
            onLimitReached();
            return;
          }
          if (!trimmedHostname) return;
          create.mutate({
            hostname: trimmedHostname,
            verificationMethod: effectiveMethod,
          });
        }}
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
            value={effectiveMethod}
            onValueChange={(value) =>
              setVerificationMethod(value as DomainVerificationMethod)
            }
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
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="self-end"
          disabled={create.isPending || !trimmedHostname}
        >
          {create.isPending ? 'Connecting…' : 'Connect domain'}
        </Button>
      </form>
      {isWildcard && (
        <p className="mt-3 text-xs text-white/45">
          Wildcard hostnames require automated DNS verification. Connect a DNS
          provider below first.
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
    </section>
  );
}
