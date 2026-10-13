import { HOSTED_PLAN_LIMITS, resolveHostedPlan } from '@outpipe/shared';
import { useState } from 'react';
import { LimitModal } from '#/components/feedback';
import { useBilling } from '#/features/billing/hooks/use-billing';
import { useOrganization } from '#/features/organizations/hooks/use-organization';
import { ConnectDomainForm } from './components/connect-domain-form';
import { DNSProviderSection } from './components/dns-provider-section';
import { DomainLimitWarning } from './components/domain-limit-warning';
import { DomainList } from './components/domain-list';
import { useDomainMutations } from './hooks/use-domain-mutations';
import { useDomains } from './hooks/use-domains';

export function DomainsPage({ orgSlug }: { orgSlug: string }) {
  const sanitizedSlug = orgSlug.trim();
  const organizationQuery = useOrganization(sanitizedSlug);
  const organizationId = organizationQuery.organization?.id;

  const query = useDomains(organizationId);
  const mutations = useDomainMutations(organizationId);
  const billingQuery = useBilling(organizationId);

  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  if (organizationQuery.isLoading || query.isLoading) {
    return <p className="p-8 text-sm text-white/55">Loading domains…</p>;
  }

  if (
    organizationQuery.isError ||
    query.isError ||
    !organizationQuery.organization ||
    !organizationId
  ) {
    return (
      <p className="p-8 text-sm text-rose-200">We could not load domains.</p>
    );
  }

  const domains = query.data ?? [];
  const planKey = resolveHostedPlan(billingQuery.data?.plan?.key);
  const domainLimit = HOSTED_PLAN_LIMITS[planKey]?.maxDomains ?? 0;
  const isAtLimit = domains.length >= domainLimit;

  return (
    <div className="w-full max-w-6xl space-y-6 pb-12 text-white">
      <header className="border-b border-white/10 pb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          {organizationQuery.organization.name}
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Domains</h1>
        <p className="mt-3 text-sm text-white/55">
          Stable hostnames for previews and production-like callbacks.
        </p>
      </header>

      <DomainLimitWarning
        isAtLimit={isAtLimit}
        domainLimit={domainLimit}
        currentPlan={planKey}
        orgSlug={sanitizedSlug}
      />

      <ConnectDomainForm
        create={mutations.create}
        isAtLimit={isAtLimit}
        onLimitReached={() => setIsLimitModalOpen(true)}
      />

      <DNSProviderSection organizationId={organizationId} />

      <DomainList
        domains={domains}
        verify={mutations.verify}
        remove={mutations.remove}
      />

      <LimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title="Custom domain limit reached"
        description={
          domainLimit === 0
            ? 'Custom domains are available on paid plans. Upgrade your workspace to connect your own domain.'
            : `Your ${planKey} plan includes ${domainLimit} custom domain${domainLimit === 1 ? '' : 's'}. Upgrade to connect another address.`
        }
        limit={domainLimit}
        currentPlan={planKey}
        resourceName="Custom Domain"
        orgSlug={sanitizedSlug}
      />
    </div>
  );
}
