'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUpdatePayout } from '@/hooks/useBrandProfileMutations';
import BankDetailsCard from '@/components/dashboard/payout/BankDetailsCard';
import BankChangeModal from '@/components/dashboard/payout/BankChangeModal';

export default function ProfilePaymentEdit() {
  const { user } = useAuthStore();
  const { mutate: updatePayout } = useUpdatePayout();
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const bankName = user?.bankName || '';
  const accountName = user?.bankAccountName || '';
  const accountNumber = user?.bankAccountNumber || '';

  const handleSaveBankDetails = (values: {
    bankId: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }) => {
    updatePayout({
      bankId: values.bankId,
      bankAccountNumber: values.accountNumber,
      bankAccountName: values.accountName,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[#7a7a9a] leading-relaxed font-light">
        Manage the bank account payouts are sent to.
      </p>

      <BankDetailsCard
        bankName={bankName}
        accountName={accountName}
        accountNumber={accountNumber}
        onChange={() => setIsBankModalOpen(true)}
      />

      <BankChangeModal
        key={isBankModalOpen ? 'open' : 'closed'}
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSave={handleSaveBankDetails}
        initialBankName={bankName}
        initialAccountNumber={accountNumber}
        initialAccountName={accountName}
      />
    </div>
  );
}
