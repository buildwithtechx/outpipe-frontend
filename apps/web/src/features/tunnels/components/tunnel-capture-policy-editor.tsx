import { useState } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import {
  CAPTURE_RULE_METHODS,
  type CaptureRule,
} from '#/interfaces/capture-policy';
import type { Tunnel } from '#/interfaces/tunnel';
import {
  useCapturePolicy,
  useCapturePolicyMutation,
} from '../hooks/use-capture-policy';
import {
  newCaptureRule,
  parseCaptureRules,
  stringifyCaptureRules,
  validCaptureRules,
} from '../lib/capture-policy';

export function TunnelCapturePolicyEditor({ tunnel }: { tunnel: Tunnel }) {
  const policyQuery = useCapturePolicy(tunnel.id);
  const mutation = useCapturePolicyMutation(tunnel.id);
  const serverRules = parseCaptureRules(policyQuery.data?.rules);
  const [draft, setDraft] = useState<CaptureRule[] | null>(null);
  const rules = draft ?? serverRules;
  const valid = validCaptureRules(rules);
  const dirty =
    draft !== null &&
    stringifyCaptureRules(draft) !== (policyQuery.data?.rules ?? '[]');

  function updateRule(index: number, patch: Partial<CaptureRule>) {
    setDraft(
      rules.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)),
    );
  }

  function toggleMethod(index: number, method: string) {
    const current = rules[index]?.methods ?? [];
    const next = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    updateRule(index, { methods: next });
  }

  if (policyQuery.isLoading)
    return <p role="status">Loading capture policy…</p>;

  return (
    <div className="mt-6 rounded-xl border border-white/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Capture policy</h2>
        {typeof policyQuery.data?.version === 'number' && (
          <span className="text-xs text-white/45">
            v{policyQuery.data.version}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-white/60">
        First matching rule wins. Requests matching no rule are denied while
        rules exist; an empty rule list captures everything.
      </p>
      {policyQuery.isError && (
        <div role="alert" className="mt-2">
          <p className="text-sm text-rose-300">
            Could not load the capture policy.
          </p>
          <button
            type="button"
            onClick={() => void policyQuery.refetch()}
            className="mt-1 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}
      <div className="mt-3 space-y-3">
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3"
          >
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <div className="grid gap-1.5">
                <Label
                  htmlFor={`capture-rule-id-${index}`}
                  className="text-xs text-white/70"
                >
                  Rule ID
                </Label>
                <Input
                  id={`capture-rule-id-${index}`}
                  value={rule.id}
                  maxLength={64}
                  onChange={(event) =>
                    updateRule(index, { id: event.target.value })
                  }
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label
                  htmlFor={`capture-rule-prefix-${index}`}
                  className="text-xs text-white/70"
                >
                  Path prefix
                </Label>
                <Input
                  id={`capture-rule-prefix-${index}`}
                  value={rule.pathPrefix}
                  maxLength={256}
                  placeholder="/api"
                  onChange={(event) =>
                    updateRule(index, { pathPrefix: event.target.value })
                  }
                  className="h-8 font-mono text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs text-white/70">Action</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateRule(index, { capture: !rule.capture })}
                  aria-pressed={rule.capture}
                  className="h-8 text-xs"
                >
                  {rule.capture ? 'Allow' : 'Deny'}
                </Button>
              </div>
            </div>
            <fieldset className="flex flex-wrap gap-2">
              <legend className="sr-only">Methods for {rule.id}</legend>
              {CAPTURE_RULE_METHODS.map((method) => (
                <label
                  key={method}
                  className="flex cursor-pointer items-center gap-1 text-[11px] text-white/70"
                >
                  <input
                    type="checkbox"
                    checked={rule.methods.includes(method)}
                    onChange={() => toggleMethod(index, method)}
                    className="size-3.5 accent-indigo-500"
                  />
                  {method}
                </label>
              ))}
            </fieldset>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDraft(rules.filter((_, i) => i !== index))}
                className="h-7 text-xs text-rose-300 hover:text-rose-200"
                aria-label={`Remove rule ${rule.id}`}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        {rules.length === 0 && (
          <p className="rounded-lg border border-dashed border-white/10 p-4 text-xs text-white/50">
            No rules: every captured request is allowed.
          </p>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={rules.length >= 64}
          onClick={() => setDraft([...rules, newCaptureRule()])}
          className="h-8 text-xs"
        >
          Add rule
        </Button>
        <Button
          type="button"
          disabled={!valid || !dirty || mutation.isPending}
          onClick={() => mutation.mutate(stringifyCaptureRules(rules))}
          className="h-8 text-xs"
        >
          {mutation.isPending ? 'Saving…' : 'Save policy'}
        </Button>
        {dirty && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDraft(null)}
            className="h-8 text-xs text-white/60"
          >
            Reset
          </Button>
        )}
      </div>
      {!valid && (
        <p role="alert" className="mt-2 text-xs text-rose-300">
          Each rule needs a unique ID, a path prefix starting with /, 1–7 known
          methods, and at most 64 rules total.
        </p>
      )}
      {mutation.isError && (
        <p role="alert" className="mt-2 text-xs text-rose-300">
          Policy could not be saved. Fix validation errors and try again.
        </p>
      )}
      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-white/55">
          Raw JSON preview
        </summary>
        <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-black/50 p-3 font-mono text-[11px] text-white/70">
          {JSON.stringify(rules, null, 2)}
        </pre>
      </details>
    </div>
  );
}
