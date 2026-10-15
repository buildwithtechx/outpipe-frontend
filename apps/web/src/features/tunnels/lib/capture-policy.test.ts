import { expect, it } from 'vitest';
import {
  parseCaptureRules,
  stringifyCaptureRules,
  validCaptureRules,
} from './capture-policy';

it('parses and validates capture rules', () => {
  expect(parseCaptureRules('[]')).toEqual([]);
  expect(parseCaptureRules(null)).toEqual([]);
  expect(parseCaptureRules('bad')).toEqual([]);
  const rules = parseCaptureRules(
    '[{"id":"a","methods":["GET"],"pathPrefix":"/api","capture":true}]',
  );
  expect(rules).toHaveLength(1);
  expect(validCaptureRules(rules)).toBe(true);
  expect(stringifyCaptureRules(rules)).toContain('/api');
  expect(
    validCaptureRules([
      { id: 'a', methods: ['BREW'], pathPrefix: '/', capture: true },
    ]),
  ).toBe(false);
  expect(
    validCaptureRules([
      { id: 'a', methods: ['GET'], pathPrefix: 'api', capture: true },
    ]),
  ).toBe(false);
  expect(
    validCaptureRules([
      { id: 'a', methods: ['GET'], pathPrefix: '/', capture: true },
      { id: 'a', methods: ['POST'], pathPrefix: '/', capture: false },
    ]),
  ).toBe(false);
  expect(
    validCaptureRules(
      Array.from({ length: 65 }, (_, i) => ({
        id: `r${i}`,
        methods: ['GET'],
        pathPrefix: '/',
        capture: true,
      })),
    ),
  ).toBe(false);
});
