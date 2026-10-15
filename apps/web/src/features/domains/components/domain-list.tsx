import type { Domain } from '#/interfaces/domain';
import type { useDomainMutations } from '../hooks/use-domain-mutations';
import { DomainRow } from './domain-row';

type Mutations = ReturnType<typeof useDomainMutations>;

export function DomainList({
  domains,
  verify,
  remove,
}: {
  domains: Domain[];
  verify: Mutations['verify'];
  remove: Mutations['remove'];
}) {
  const bundleCounts = new Map<string, number>();
  for (const domain of domains) {
    if (domain.bundleGroup) {
      bundleCounts.set(
        domain.bundleGroup,
        (bundleCounts.get(domain.bundleGroup) ?? 0) + 1,
      );
    }
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      {domains.length ? (
        domains.map((domain) => (
          <DomainRow
            key={domain.id}
            domain={domain}
            verify={verify}
            remove={remove}
            bundleSize={
              domain.bundleGroup
                ? bundleCounts.get(domain.bundleGroup)
                : undefined
            }
          />
        ))
      ) : (
        <p className="px-5 py-12 text-center text-sm text-white/50">
          No custom domains connected yet.
        </p>
      )}
    </section>
  );
}
