import {
  CAPTURE_RULE_METHODS,
  type CaptureRule,
} from '#/interfaces/capture-policy';

export function parseCaptureRules(
  raw: string | null | undefined,
): CaptureRule[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CaptureRule =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CaptureRule).id === 'string',
    );
  } catch {
    return [];
  }
}

export function stringifyCaptureRules(rules: CaptureRule[]): string {
  return JSON.stringify(rules);
}

export function validCaptureRuleId(id: string) {
  const trimmed = id.trim();
  return trimmed.length > 0 && trimmed.length <= 64;
}

export function validCapturePathPrefix(prefix: string) {
  const trimmed = prefix.trim();
  return trimmed.startsWith('/') && trimmed.length <= 256;
}

export function validCaptureMethods(methods: string[]) {
  if (methods.length === 0 || methods.length > 7) return false;
  const allowed = new Set<string>(CAPTURE_RULE_METHODS);
  return methods.every((method) => allowed.has(method));
}

export function validCaptureRules(rules: CaptureRule[]) {
  if (rules.length > 64) return false;
  const seen = new Set<string>();
  for (const rule of rules) {
    if (!validCaptureRuleId(rule.id)) return false;
    if (seen.has(rule.id.trim())) return false;
    seen.add(rule.id.trim());
    if (!validCapturePathPrefix(rule.pathPrefix)) return false;
    if (!validCaptureMethods(rule.methods)) return false;
  }
  return true;
}

export function newCaptureRule(): CaptureRule {
  return {
    id: `rule-${Math.random().toString(36).slice(2, 8)}`,
    methods: ['GET'],
    pathPrefix: '/',
    capture: true,
  };
}
