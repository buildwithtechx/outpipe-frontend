import type { AlertState } from '#/interfaces/alert';

const STATE_STYLES: Record<AlertState, string> = {
  ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  firing: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
};

export function AlertStatePill({ state }: { state: AlertState }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATE_STYLES[state]}`}
    >
      {state}
    </span>
  );
}
