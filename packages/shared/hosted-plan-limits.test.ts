import { describe, expect, it } from 'vitest';
import {
  HOSTED_PLAN_LIMITS,
  isUnlimitedPlanLimit,
  resolveHostedPlan,
} from './hosted-plan-limits';

describe('hosted-plan-limits', () => {
  it('resolves valid plan tiers correctly', () => {
    expect(resolveHostedPlan('free')).toBe('free');
    expect(resolveHostedPlan('ray')).toBe('ray');
    expect(resolveHostedPlan('beam')).toBe('beam');
    expect(resolveHostedPlan('pulse')).toBe('pulse');
    expect(resolveHostedPlan('unlimited')).toBe('unlimited');
  });

  it('falls back to free for unknown or empty plans', () => {
    expect(resolveHostedPlan(null)).toBe('free');
    expect(resolveHostedPlan(undefined)).toBe('free');
    expect(resolveHostedPlan('enterprise-custom')).toBe('free');
  });

  it('verifies tier limits progression', () => {
    expect(HOSTED_PLAN_LIMITS.free.maxTunnels).toBe(2);
    expect(HOSTED_PLAN_LIMITS.ray.maxTunnels).toBe(3);
    expect(HOSTED_PLAN_LIMITS.beam.maxTunnels).toBe(5);
    expect(HOSTED_PLAN_LIMITS.pulse.maxTunnels).toBe(20);

    expect(HOSTED_PLAN_LIMITS.free.maxDomains).toBe(0);
    expect(HOSTED_PLAN_LIMITS.ray.maxDomains).toBe(1);
    expect(HOSTED_PLAN_LIMITS.beam.maxDomains).toBe(5);
    expect(HOSTED_PLAN_LIMITS.pulse.maxDomains).toBe(25);
  });

  it('correctly detects unlimited limits', () => {
    expect(isUnlimitedPlanLimit('unlimited', 100)).toBe(true);
    expect(isUnlimitedPlanLimit('pulse', -1)).toBe(true);
    expect(isUnlimitedPlanLimit('free', 999_999_999)).toBe(true);
    expect(isUnlimitedPlanLimit('free', 2)).toBe(false);
  });
});
