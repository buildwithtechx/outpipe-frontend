import { useState } from 'react';
import { ConfirmAction } from '#/components/feedback/confirm-action';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { useOrganization } from '#/features/organizations/hooks/use-organization';
import {
  useFleetMutations,
  useFleetStatus,
  useFleets,
} from './hooks/use-fleets';

export function FleetsPage({ orgSlug }: { orgSlug: string }) {
  const organizationQuery = useOrganization(orgSlug);
  const orgId = organizationQuery.organization?.id;
  const fleets = useFleets(orgId);
  const mutations = useFleetMutations(orgId ?? '');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  if (organizationQuery.isLoading || fleets.isLoading)
    return <p role="status">Loading fleets…</p>;
  if (!orgId) return <p role="alert">Workspace not found.</p>;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Machine fleets
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Operate machine tunnels in bulk — create, rotate, and reconcile
            toward desired state.
          </p>
        </div>
      </header>
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">New fleet</h2>
        <form
          className="mt-4 flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            mutations.create.mutate(
              { name: name.trim() },
              { onSuccess: () => setName('') },
            );
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="fleet-name">Fleet name</Label>
            <Input
              id="fleet-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="edge-nodes"
              maxLength={120}
            />
          </div>
          <Button type="submit" disabled={mutations.create.isPending}>
            {mutations.create.isPending ? 'Creating…' : 'Create fleet'}
          </Button>
        </form>
      </section>
      <section className="space-y-4">
        {(fleets.data ?? []).map((fleet) => (
          <Card key={fleet.id} className="space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{fleet.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {fleet.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelected(selected === fleet.id ? null : fleet.id)
                  }
                >
                  {selected === fleet.id ? 'Hide' : 'Status'}
                </Button>
                <ConfirmAction
                  title={`Delete fleet ${fleet.name}?`}
                  description="This removes the fleet record and token attachments. Live tunnels are left untouched."
                  label="Delete"
                  pending={mutations.remove.isPending}
                  onConfirm={() => mutations.remove.mutateAsync(fleet.id)}
                />
              </div>
            </div>
            {selected === fleet.id && orgId && (
              <FleetStatusDetail orgId={orgId} fleetId={fleet.id} />
            )}
          </Card>
        ))}
        {(fleets.data ?? []).length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No fleets yet. Create one to group machine tunnels under a shared
            credential.
          </p>
        )}
      </section>
    </div>
  );
}

function FleetStatusDetail({
  orgId,
  fleetId,
}: {
  orgId: string;
  fleetId: string;
}) {
  const status = useFleetStatus(orgId, fleetId);
  const mutations = useFleetMutations(orgId);
  if (status.isLoading) return <p role="status">Loading status…</p>;
  if (status.isError || !status.data)
    return <p role="alert">Could not load fleet status.</p>;
  const data = status.data;
  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <p className="text-sm text-muted-foreground">
        {data.tokens.length} token(s) · {data.desiredTunnels.length} desired ·{' '}
        {data.liveTunnels.length} live · {data.drift.length} drifted
      </p>
      {data.drift.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {data.drift.map((drift) => (
            <li
              key={drift.tunnelId}
              className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"
            >
              <span>
                {drift.name}{' '}
                <span className="font-mono text-xs text-muted-foreground">
                  want {drift.want} got {drift.got}
                  {!drift.credentialOk && ' · credential stale'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={mutations.reconcile.isPending}
          onClick={() => mutations.reconcile.mutate(fleetId)}
        >
          {mutations.reconcile.isPending ? 'Reconciling…' : 'Reconcile'}
        </Button>
        <ConfirmAction
          title="Rotate fleet credentials?"
          description="New machine tokens are issued, tunnels are re-pointed, and old tokens are revoked — with zero manual steps."
          label="Rotate"
          pending={mutations.rotate.isPending}
          onConfirm={() => mutations.rotate.mutateAsync(fleetId)}
        />
      </div>
      {mutations.rotate.data && (
        <p className="rounded-xl bg-black/40 p-3 font-mono text-xs text-emerald-200">
          Rotated {mutations.rotate.data.rotated.length} token(s). Store the new
          raw values now — they are shown once.
        </p>
      )}
    </div>
  );
}
