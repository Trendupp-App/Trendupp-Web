'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const CONFIRM_PHRASE = 'i want to delete';

interface DeleteAccountModalProps {
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => void;
}

export default function DeleteAccountModal({
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  // Reset fields whenever the dialog closes so it's fresh next time it opens.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!open) {
      setPassword('');
      setConfirmText('');
      setShowPassword(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open]);

  const isConfirmed = confirmText.trim().toLowerCase() === CONFIRM_PHRASE;

  function handleConfirm() {
    if (!isConfirmed) return;
    onConfirm(password);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={28} strokeWidth={2} className="text-red-500" />
            </div>
            <DialogTitle className="text-sm font-semibold text-[#1a1a2e]">
              Delete your account?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7a7a9a] leading-relaxed text-center">
              This action is irreversible. Your account will be restorable for 30 days, after which
              it will be permanently deleted.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-light text-[#1a1a2e]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-[#e8e6f0] rounded-lg h-10 px-3 pr-10 text-sm font-light text-[#1a1a2e] focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 placeholder:text-[#c4c2d4]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] hover:text-[#1a1a2e]"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-light text-[#1a1a2e]">
            Type <span className="font-semibold">&quot;{CONFIRM_PHRASE}&quot;</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            className="w-full border border-[#e8e6f0] rounded-lg h-10 px-3 text-sm font-light text-[#1a1a2e] focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 placeholder:text-[#c4c2d4]"
          />
        </div>

        <div className="flex gap-3 w-full mt-1">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full py-3 rounded-xl text-xs font-light border border-[#e8e6f0] text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          {isConfirmed && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="w-full py-3 rounded-xl text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-70"
            >
              {isPending ? 'Deleting…' : 'Delete account'}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
