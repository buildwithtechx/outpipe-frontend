import { Link } from '@tanstack/react-router';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export interface SubdomainLimitWarningProps {
  isAtLimit: boolean;
  subdomainLimit: number;
  currentPlan: string;
  orgSlug: string;
  instanceOwned?: boolean;
}

export function SubdomainLimitWarning({
  isAtLimit,
  subdomainLimit,
  currentPlan,
  orgSlug,
  instanceOwned = false,
}: SubdomainLimitWarningProps) {
  if (!isAtLimit) return null;

  const planName =
    currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase();
  const subdomainLabel = subdomainLimit === 1 ? 'subdomain' : 'subdomains';

  return (
    <aside
      role="status"
      className="flex flex-col gap-3 rounded-xl border border-amber-400/15 bg-amber-400/4 px-4 py-3 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
          <AlertTriangle className="size-4" />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-xs font-medium text-zinc-200">
              Reserved address limit reached
            </p>
            <span className="text-[10px] text-zinc-600" aria-hidden="true">
              /
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-amber-300/80">
              {subdomainLimit} of {subdomainLimit} used
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">
            {instanceOwned
              ? `This installation allows ${subdomainLimit} reserved ${subdomainLabel}. Contact your administrator to increase capacity.`
              : `Your ${planName} plan includes ${subdomainLimit} reserved ${subdomainLabel}. Upgrade to reserve more addresses.`}
          </p>
        </div>
      </div>

      {!instanceOwned && (
        <Link
          to="/$orgSlug/billing"
          params={{ orgSlug }}
          className="group flex w-fit shrink-0 items-center gap-1.5 text-xs font-medium text-amber-300 transition-colors hover:text-white"
        >
          View plans
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </aside>
  );
}
