import {
  HOSTED_PLAN_LIMITS,
  isUnlimitedPlanLimit,
  resolveHostedPlan,
} from '@outpipe/shared';
import { AlertTriangle, Info } from 'lucide-react';

export interface BillingUsageMetricsProps {
  planKey?: string;
  tunnelCount?: number;
  domainCount?: number;
  subdomainCount?: number;
  memberCount?: number;
  bandwidthBytes?: number;
  telemetryBytes?: number;
}

export function formatBillingBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / 1024 ** index;
  return `${value.toLocaleString('en-US', { maximumFractionDigits: 1 })} ${units[index]}`;
}

export function calculateUsageSummary(
  value: number | undefined,
  limit: number | undefined,
  planKey: string,
) {
  const actual =
    value === undefined || !Number.isFinite(value) ? 0 : Math.max(0, value);
  const unlimited = limit !== undefined && isUnlimitedPlanLimit(planKey, limit);
  const percentage =
    unlimited || limit === undefined || limit <= 0
      ? undefined
      : Math.min(100, (actual / limit) * 100);

  return { actual, unlimited, percentage };
}

interface MetricCardProps {
  label: string;
  value?: number;
  limit?: number;
  planKey: string;
  formatValue?: (n: number) => string;
}

function MetricCard({
  label,
  value,
  limit,
  planKey,
  formatValue = (n: number) => n.toLocaleString('en-US'),
}: MetricCardProps) {
  const { actual, unlimited, percentage } = calculateUsageSummary(
    value,
    limit,
    planKey,
  );

  let barColor = 'bg-indigo-500';
  if (percentage !== undefined) {
    if (percentage >= 100) {
      barColor = 'bg-rose-500';
    } else if (percentage >= 80) {
      barColor = 'bg-amber-400';
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-white/70">{label}</span>
        <span className="text-xs font-semibold text-white">
          {formatValue(actual)}
          <span className="font-normal text-white/40">
            {unlimited
              ? ' / Unlimited'
              : limit === undefined
                ? ''
                : limit === 0
                  ? ' (Not included)'
                  : ` / ${formatValue(limit)}`}
          </span>
        </span>
      </div>

      <div className="mt-3">
        {percentage === undefined ? (
          <p className="text-[11px] text-white/40">
            {unlimited
              ? 'No plan limit'
              : limit === 0
                ? 'Not included in this plan'
                : 'Usage allowance active'}
          </p>
        ) : (
          <div className="space-y-1.5">
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-white/10"
              aria-hidden="true"
            >
              <div
                className={`h-full transition-all duration-300 ${barColor}`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/40">
              <span>{Math.round(percentage)}% used</span>
              {percentage >= 100 && (
                <span className="font-medium text-rose-400">Limit reached</span>
              )}
              {percentage >= 80 && percentage < 100 && (
                <span className="font-medium text-amber-300">Near limit</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function BillingUsageMetrics({
  planKey = 'free',
  tunnelCount = 0,
  domainCount = 0,
  subdomainCount = 0,
  memberCount = 1,
  bandwidthBytes = 0,
  telemetryBytes = 0,
}: BillingUsageMetricsProps) {
  const resolvedPlan = resolveHostedPlan(planKey);
  const config = HOSTED_PLAN_LIMITS[resolvedPlan];

  const bandwidthLimit = config.bandwidthPerMonth;
  const telemetryLimit = config.telemetryBytesPerMonth;

  const bandwidthExceeded =
    bandwidthLimit > 0 && bandwidthBytes >= bandwidthLimit;
  const bandwidthNearLimit =
    bandwidthLimit > 0 &&
    bandwidthBytes >= bandwidthLimit * 0.8 &&
    !bandwidthExceeded;

  const telemetryExceeded =
    telemetryLimit > 0 && telemetryBytes >= telemetryLimit;
  const telemetryNearLimit =
    telemetryLimit > 0 &&
    telemetryBytes >= telemetryLimit * 0.8 &&
    !telemetryExceeded;

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Current usage</h2>
          <p className="text-xs text-white/50">
            Active resources and monthly allowances in this workspace.
          </p>
        </div>
        <span className="text-[11px] text-white/40">
          Resets on the 1st of each month (UTC)
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Active tunnels"
          value={tunnelCount}
          limit={config.maxTunnels}
          planKey={resolvedPlan}
        />
        <MetricCard
          label="Custom domains"
          value={domainCount}
          limit={config.maxDomains}
          planKey={resolvedPlan}
        />
        <MetricCard
          label="Reserved subdomains"
          value={subdomainCount}
          limit={config.maxSubdomains}
          planKey={resolvedPlan}
        />
        <MetricCard
          label="Team members"
          value={memberCount}
          limit={config.maxMembers}
          planKey={resolvedPlan}
        />
        <MetricCard
          label="Monthly bandwidth"
          value={bandwidthBytes}
          limit={config.bandwidthPerMonth}
          planKey={resolvedPlan}
          formatValue={formatBillingBytes}
        />
        <MetricCard
          label="Monthly telemetry"
          value={telemetryBytes}
          limit={config.telemetryBytesPerMonth}
          planKey={resolvedPlan}
          formatValue={formatBillingBytes}
        />
      </div>

      {bandwidthExceeded && (
        <div
          role="status"
          className="mt-4 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300"
        >
          <AlertTriangle className="size-4 shrink-0" />
          <p>
            Tunnel bandwidth allowance reached. Traffic is restricted until the
            monthly reset or a plan upgrade.
          </p>
        </div>
      )}

      {bandwidthNearLimit && (
        <div
          role="status"
          className="mt-4 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3.5 text-xs text-amber-300"
        >
          <Info className="size-4 shrink-0" />
          <p>
            You have used at least 80% of this month’s tunnel bandwidth
            allowance.
          </p>
        </div>
      )}

      {telemetryExceeded && (
        <div
          role="status"
          className="mt-4 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300"
        >
          <AlertTriangle className="size-4 shrink-0" />
          <p>
            Telemetry allowance reached. Ingestion is paused until the monthly
            reset or a plan upgrade.
          </p>
        </div>
      )}

      {telemetryNearLimit && (
        <div
          role="status"
          className="mt-4 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3.5 text-xs text-amber-300"
        >
          <Info className="size-4 shrink-0" />
          <p>You have used at least 80% of this month’s telemetry allowance.</p>
        </div>
      )}
    </section>
  );
}
