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
import { useDNSProviders } from '../hooks/use-dns-providers';

export function DNSProviderSection({
  organizationId,
}: {
  organizationId: string;
}) {
  const providers = useDNSProviders(organizationId);
  const [token, setToken] = useState('');
  const [label, setLabel] = useState('');

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
      <h2 className="text-lg font-medium">DNS automation</h2>
      <p className="mt-2 text-sm text-white/55">
        Connect a Cloudflare API token with Zone DNS edit scope to let Outpipe
        publish verification records automatically. Tokens are write-only and
        never shown again.
      </p>
      <form
        className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmedToken = token.trim();
          const trimmedLabel = label.trim();
          if (!trimmedToken || !trimmedLabel) return;
          providers.connect.mutate(
            {
              provider: 'cloudflare',
              token: trimmedToken,
              label: trimmedLabel,
            },
            {
              onSuccess: () => {
                setToken('');
                setLabel('');
              },
            },
          );
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="dns-provider" className="text-white/70">
            Provider
          </Label>
          <Select value="cloudflare">
            <SelectTrigger
              id="dns-provider"
              className="rounded-xl border-white/10 bg-black/40 text-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloudflare">Cloudflare</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <Button
          type="submit"
          className="self-end"
          disabled={
            providers.connect.isPending || !token.trim() || !label.trim()
          }
        >
          {providers.connect.isPending ? 'Connecting…' : 'Connect provider'}
        </Button>
      </form>
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
