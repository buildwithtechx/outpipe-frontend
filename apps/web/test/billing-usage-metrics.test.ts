import { describe, expect, it } from 'vitest';
import {
  calculateUsageSummary,
  formatBillingBytes,
} from '../src/features/billing/components/billing-usage-metrics';

describe('billing-usage-metrics helpers', () => {
  describe('formatBillingBytes', () => {
    it('formats 0 bytes correctly', () => {
      expect(formatBillingBytes(0)).toBe('0 B');
    });

    it('formats megabytes and gigabytes properly', () => {
      expect(formatBillingBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBillingBytes(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });
  });

  describe('calculateUsageSummary', () => {
    it('returns zero usage when value is undefined', () => {
      const result = calculateUsageSummary(undefined, 5, 'free');
      expect(result.actual).toBe(0);
      expect(result.unlimited).toBe(false);
      expect(result.percentage).toBe(0);
    });

    it('calculates percentage correctly for finite limits', () => {
      const result = calculateUsageSummary(4, 5, 'beam');
      expect(result.actual).toBe(4);
      expect(result.unlimited).toBe(false);
      expect(result.percentage).toBe(80);
    });

    it('caps percentage at 100% when exceeded', () => {
      const result = calculateUsageSummary(10, 5, 'beam');
      expect(result.actual).toBe(10);
      expect(result.percentage).toBe(100);
    });

    it('treats unlimited plans as unlimited with undefined percentage', () => {
      const result = calculateUsageSummary(50, 999_999_999, 'unlimited');
      expect(result.actual).toBe(50);
      expect(result.unlimited).toBe(true);
      expect(result.percentage).toBeUndefined();
    });

    it('handles limit 0 as undefined percentage', () => {
      const result = calculateUsageSummary(0, 0, 'free');
      expect(result.percentage).toBeUndefined();
    });
  });
});
