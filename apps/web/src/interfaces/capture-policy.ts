import type { Entity } from '#/interfaces/api';

export const CAPTURE_RULE_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export type CaptureRuleMethod = (typeof CAPTURE_RULE_METHODS)[number];

export type CaptureRule = {
  id: string;
  methods: string[];
  pathPrefix: string;
  capture: boolean;
};

export type CapturePolicy = Entity & {
  organizationId: string;
  tunnelId: string;
  version: number;
  rules: string;
};
