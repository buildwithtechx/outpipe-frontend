import { Check, Copy } from 'lucide-react';
import { useCopyText } from '#/hooks/use-copy-text';

export function CopyButton({
  value,
  label = 'Copy to clipboard',
  className = '',
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const { state, copy } = useCopyText();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => copy(value)}
      className={`inline-flex items-center justify-center transition-colors hover:text-white ${className}`}
    >
      {state === 'copied' ? (
        <Check className="size-3.5 text-emerald-400" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
