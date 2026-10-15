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
import type { DNSProviderName } from '#/interfaces/dns-provider';
import { useDNSProviders } from '../hooks/use-dns-providers';

export function DNSProviderSection({
  organizationId,
}: {
  organizationId: string;
}) {
  const providers = useDNSProviders(organizationId);
  const [provider, setProvider] = useState<DNSProviderName>('cloudflare');
  const [token, setToken] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [label, setLabel] = useState('');

  const isRoute53 = provider === 'route53';
  const credentialReady = isRoute53
    ? accessKeyId.trim() !== '' && secretAccessKey.trim() !== ''
    : token.trim() !== '';
  const canSubmit =
    credentialReady && label.trim() !== '' && !providers.connect.isPending;

  function credentialToken() {
    if (!isRoute53) return token.trim();
    return JSON.stringify({
      access_key_id: accessKeyId.trim(),
      secret_access_key: secretAccessKey.trim(),
      ...(sessionToken.trim() ? { session_token: sessionToken.trim() } : {}),
    });
  }

  function reset() {
    setToken('');
    setAccessKeyId('');
    setSecretAccessKey('');
    setSessionToken('');
    setLabel('');
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
      <h2 className="text-lg font-medium">DNS automation</h2>
      <p className="mt-2 text-sm text-white/55">
        {isRoute53
          ? 'Connect AWS Route53 IAM credentials with route53:ChangeResourceRecordSets scoped to the hosted zone only. Keys are write-only and never shown again.'
          : 'Connect a Cloudflare API token with Zone DNS edit scope to let Outpipe publish verification records automatically. Tokens are write-only and never shown again.'}
      </p>
      <form
        className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmedLabel = label.trim();
          const credential = credentialToken();
          if (!credential || !trimmedLabel) return;
          providers.connect.mutate(
            { provider, token: credential, label: trimmedLabel },
            { onSuccess: reset },
          );
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="dns-provider" className="text-white/70">
            Provider
          </Label>
          <Select
            value={provider}
            onValueChange={(value) => setProvider(value as DNSProviderName)}
          >
            <SelectTrigger
              id="dns-provider"
              className="rounded-xl border-white/10 bg-black/40 text-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloudflare">Cloudflare</SelectItem>
              <SelectItem value="route53">Route53</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isRoute53 ? (
          <div className="grid gap-4 sm:col-span-1 sm:grid-cols-3 sm:col-start-2 sm:col-end-4">
            <div className="grid gap-2">
              <Label htmlFor="dns-access-key" className="text-white/70">
                Access key ID
              </Label>
              <Input
                id="dns-access-key"
                required
                autoComplete="off"
                value={accessKeyId}
                onChange={(event) => setAccessKeyId(event.target.value)}
                placeholder="AKIA…"
                className="rounded-xl border-white/10 bg-black/40 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dns-secret-key" className="text-white/70">
                Secret access key
              </Label>
              <Input
                id="dns-secret-key"
                type="password"
                required
                autoComplete="new-password"
                value={secretAccessKey}
                onChange={(event) => setSecretAccessKey(event.target.value)}
                placeholder="Route53 secret"
                className="rounded-xl border-white/10 bg-black/40 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dns-session-token" className="text-white/70">
                Session token (optional)
              </Label>
              <Input
                id="dns-session-token"
                type="password"
                autoComplete="new-password"
                value={sessionToken}
                onChange={(event) => setSessionToken(event.target.value)}
                placeholder="Temporary sessions only"
                className="rounded-xl border-white/10 bg-black/40 text-white"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor="dns-token" className="text-white/70">
              API token
            </Label>
            <Input
              id="dns-token"
              type="password"
              required
              autoComplete="new-password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Cloudflare API token"
              className="rounded-xl border-white/10 bg-black/40 text-white"
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="dns-label" className="text-white/70">
            Label
          </Label>
          <Input
            id="dns-label"
            required
            maxLength={100}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. primary account"
            className="rounded-xl border-white/10 bg-black/40 text-white"
          />
        </div>
        <Button type="submit" className="self-end" disabled={!canSubmit}>
          {providers.connect.isPending ? 'Connecting…' : 'Connect provider'}
        </Button>
      </form>
      {providers.connect.isError && (
        <p role="alert" className="mt-3 text-sm text-rose-300">
          Could not connect the provider. Check the credentials and try again.
        </p>
      )}
      <div className="mt-4">
        {providers.isLoading ? (
          <p className="text-sm text-white/55">Loading providers…</p>
        ) : providers.data?.length ? (
          providers.data.map((credential) => (
            <div
              key={credential.id}
              className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 py-3 first:border-0"
            >
              <div>
                <p className="text-sm text-white/85">{credential.label}</p>
                <p className="mt-1 font-mono text-xs text-white/40">
                  {credential.provider} …{credential.lastFour}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="h-8 text-xs text-rose-300 hover:text-rose-200"
                disabled={providers.disconnect.isPending}
                onClick={() => providers.disconnect.mutate(credential.id)}
                aria-label={`Disconnect ${credential.label}`}
              >
                Disconnect
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/50">No DNS providers connected.</p>
        )}
      </div>
    </section>
  );
}
