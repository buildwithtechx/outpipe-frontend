import { createFileRoute } from '@tanstack/react-router';
import { FleetsPage } from '#/features/tunnels/fleets-page';

export const Route = createFileRoute('/$orgSlug/tunnels/fleets')({
  component: FleetsRoute,
});

function FleetsRoute() {
  const { orgSlug } = Route.useParams();
  return <FleetsPage key={orgSlug} orgSlug={orgSlug} />;
}
