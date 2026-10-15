import { expect, it } from 'vitest';
import {
  parseAlertMonitorIds,
  validAlertName,
  validAlertThresholds,
} from './alert-helpers';

it('parses alert monitor ids from a JSON string array', () => {
  expect(parseAlertMonitorIds('["m1","m2"]')).toEqual(['m1', 'm2']);
  expect(parseAlertMonitorIds('[]')).toEqual([]);
  expect(parseAlertMonitorIds(null)).toEqual([]);
  expect(parseAlertMonitorIds('not-json')).toEqual([]);
  expect(parseAlertMonitorIds('{"a":1}')).toEqual([]);
  expect(parseAlertMonitorIds('["ok","","  "]')).toEqual(['ok']);
});

it('validates alert names and thresholds', () => {
  expect(validAlertName('  api down  ')).toBe(true);
  expect(validAlertName('   ')).toBe(false);
  expect(validAlertThresholds(3, 2, 60)).toBe(true);
  expect(validAlertThresholds(0, 2, 60)).toBe(false);
  expect(validAlertThresholds(3, 2, 5)).toBe(false);
  expect(validAlertThresholds(21, 2, 60)).toBe(false);
});
