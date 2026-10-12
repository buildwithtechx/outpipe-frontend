import { Link } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';

export interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  limit: number;
  currentPlan: string;
  resourceName: string;
  orgSlug?: string;
  selfHosted?: boolean;
}

export function LimitModal({
  isOpen,
  onClose,
  title,
  description,
  limit,
  currentPlan,
  resourceName,
  orgSlug,
  selfHosted = false,
}: LimitModalProps) {
  const planName =
    currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-white/10 bg-[#0d0d10] text-white sm:max-w-md">
        <DialogHeader className="gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-400">
            {selfHosted
              ? "This installation's capacity has been reached. Contact your administrator to change the limit."
              : description}
          </p>

          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                {selfHosted ? 'Managed by' : 'Current Plan'}
              </span>
              <span className="text-sm font-medium text-white capitalize">
                {selfHosted ? 'Your installation' : planName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                {resourceName} Limit
              </span>
              <span className="text-sm font-medium text-white">{limit}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 flex gap-3 sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            {selfHosted ? 'Close' : 'Cancel'}
          </Button>
          {!selfHosted && orgSlug && (
            <Link to="/$orgSlug/billing" params={{ orgSlug }} onClick={onClose}>
              <Button variant="default" className="w-full sm:w-auto">
                Upgrade Plan
              </Button>
            </Link>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
