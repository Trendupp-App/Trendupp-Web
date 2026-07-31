'use client';

import { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSecuritySettings,
  useUpdateSecurity,
  useChangePassword,
  useDeactivateAccount,
} from '@/hooks/useBrandProfileMutations';
import type { SecuritySettings } from '@/types/profile';
import DeleteAccountModal from '@/shared/DeleteAccountModal';
import { strongPasswordSchema } from '@/lib/validations/passwordRules';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

interface PrivacySecuritySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-[#1a1a2e]">{label}</p>
        {description && <p className="text-xs text-[#9a99b0] mt-0.5">{description}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-brand-pink"
      />
    </div>
  );
}

export default function PrivacySecuritySheet({ open, onOpenChange }: PrivacySecuritySheetProps) {
  const { data: settings, isLoading } = useSecuritySettings();
  const { mutate: updateSecurity } = useUpdateSecurity();
  const { mutate: changePassword, isPending: changingPassword } = useChangePassword();
  const { mutate: deactivateAccount, isPending: deactivating } = useDeactivateAccount();
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  function toggle(key: keyof SecuritySettings) {
    if (!settings) return;
    updateSecurity({ [key]: !settings[key] });
  }

  function onSubmitPassword(values: PasswordValues) {
    changePassword(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => reset() },
    );
  }

  const inputCls =
    'w-full border border-[#e8e6f0] rounded-lg h-10 px-3 pl-9 text-sm font-light text-[#1a1a2e] focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/20 placeholder:text-[#c4c2d4]';

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-[580px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-base font-semibold text-[#1a1a2e]">
              Privacy & Security
            </SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Account Security toggles — disabled pending backend support, see [[account_security_toggles_disabled]] */}
              {false && (
                <div className="flex flex-col gap-1 px-3">
                  <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider px-1 mb-1">
                    Account Security
                  </p>
                  <div className="bg-white border border-[#e8e6f0] rounded-xl divide-y divide-[#f0eef8]">
                    <ToggleRow
                      label="Two-Factor Authentication"
                      description="Extra layer of sign-in protection"
                      checked={settings?.twoFactorEnabled ?? false}
                      onChange={() => toggle('twoFactorEnabled')}
                    />
                    <ToggleRow
                      label="Biometric Login"
                      description="Use fingerprint or face ID"
                      checked={settings?.biometricLoginEnabled ?? false}
                      onChange={() => toggle('biometricLoginEnabled')}
                    />
                    <ToggleRow
                      label="Login Alerts"
                      description="Notify me of new sign-ins"
                      checked={settings?.loginAlertsEnabled ?? false}
                      onChange={() => toggle('loginAlertsEnabled')}
                    />
                  </div>
                </div>
              )}

              {/* Password change */}
              <div className="flex flex-col gap-3 px-3">
                <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider px-1">
                  Change Password
                </p>
                <form onSubmit={handleSubmit(onSubmitPassword)} className="flex flex-col gap-3">
                  {[
                    {
                      name: 'currentPassword' as const,
                      label: 'Current password',
                      placeholder: 'Enter current password',
                    },
                    {
                      name: 'newPassword' as const,
                      label: 'New password',
                      placeholder: 'Enter new password',
                    },
                    {
                      name: 'confirmPassword' as const,
                      label: 'Confirm password',
                      placeholder: 'Confirm password',
                    },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1">
                      <label className="text-sm font-light text-[#1a1a2e]">{label}</label>
                      <div className="relative">
                        <Lock
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]"
                        />
                        <input
                          {...register(name)}
                          type="password"
                          placeholder={placeholder}
                          // "new-password" (not "current-password") is the standard trick to
                          // stop browsers autofilling the user's saved password into this field.
                          autoComplete="new-password"
                          className={inputCls}
                        />
                      </div>
                      {errors[name] && (
                        <p className="text-[11px] text-red-400">{errors[name]?.message}</p>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full py-3 bg-brand-pink text-white text-sm font-medium rounded-xl hover:bg-brand-pink/90 transition-colors disabled:opacity-60"
                  >
                    {changingPassword ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              </div>

              {/* Danger zone */}
              <div className="bg-red-50 border border-red-100 rounded-xl mx-2 p-4 mb-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500" />
                  <p className="text-sm font-semibold text-red-500">Danger Zone</p>
                </div>
                <p className="text-xs text-[#9a99b0] leading-relaxed">
                  These actions are irreversible. Proceed with caution. Restore your account within
                  30 days, after which account will be deleted.
                </p>
                <button
                  onClick={() => setShowDeactivateConfirm(true)}
                  className="w-fit text-xs font-medium text-red-500 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete account
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <DeleteAccountModal
        open={showDeactivateConfirm}
        onOpenChange={setShowDeactivateConfirm}
        isPending={deactivating}
        onConfirm={(password) =>
          deactivateAccount(
            { password: password || undefined },
            { onSuccess: () => setShowDeactivateConfirm(false) },
          )
        }
      />
    </>
  );
}
