import { useState } from 'react';
import { Button } from '#/components/ui/button';

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-7 shrink-0 text-xs"
      aria-label={`Copy ${label}`}
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        };
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(value).then(done, done);
        } else {
          done();
        }
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
