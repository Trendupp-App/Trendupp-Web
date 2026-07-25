'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PayoutHeader from '@/components/brand-payout/PayOutHeader';
import PayoutBalanceCard from '@/components/brand-payout/PayoutBalanceCard';
import PayoutTabs, { type PayoutTab } from '@/components/brand-payout/PayoutTabs';
import TransactionsTab from '@/components/brand-payout/TransactionsTab';
import EscrowsTab from '@/components/brand-payout/EscrowsTab';
import NeedingFundingTab from '@/components/brand-payout/NeedingFundingTab';
import BankDetailsCard from '@/components/dashboard/payout/BankDetailsCard';
import BankChangeModal from '@/components/dashboard/payout/BankChangeModal';
import { useBrandPayoutDashboard } from '@/hooks/usePayout';
import { useMyCampaigns } from '@/hooks/useCampaign';
import { useUpdatePayout } from '@/hooks/useBrandProfileMutations';
import { useAuthStore } from '@/store/authStore';
import type { Campaign } from '@/types/campaign';
import { cn } from '@/lib/utils';

const TRANSACTIONS_LIMIT = 20;

export default function BrandPayoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: updatePayout } = useUpdatePayout();

  const [activeTab, setActiveTab] = useState<PayoutTab>('transactions');
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const { data, isLoading, isError } = useBrandPayoutDashboard({
    page: transactionsPage,
    limit: TRANSACTIONS_LIMIT,
  });

  const needingFundingEnabled = activeTab === 'needing-funding';
  const {
    data: submittedCampaigns = [],
    isLoading: submittedLoading,
    isError: submittedError,
  } = useMyCampaigns('submitted', needingFundingEnabled);
  const {
    data: pendingPaymentCampaigns = [],
    isLoading: pendingPaymentLoading,
    isError: pendingPaymentError,
  } = useMyCampaigns('pending_payment', needingFundingEnabled);

  const needingFundingCampaigns = useMemo(() => {
    const byId = new Map<string, Campaign>();
    for (const c of [...submittedCampaigns, ...pendingPaymentCampaigns]) byId.set(c.id, c);
    return Array.from(byId.values());
  }, [submittedCampaigns, pendingPaymentCampaigns]);
  const needingFundingLoading = submittedLoading || pendingPaymentLoading;
  const needingFundingHasError = submittedError || pendingPaymentError;

  const summary = data?.summary;
  const transactions = data?.transactions;
  const escrow = data?.escrow;

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

  function handleContinue(campaign: Campaign) {
    router.push(`/brand/campaign/create?draft=${campaign.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PayoutHeader />

      {summary && <PayoutBalanceCard summary={summary} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PayoutTabs active={activeTab} onChange={setActiveTab} />

          {isLoading && activeTab !== 'needing-funding' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[84px] bg-white border border-[#e8e6f0]/70 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && isError && activeTab !== 'needing-funding' && (
            <div className="text-center py-10 border border-dashed border-red-200 bg-red-50/40 rounded-3xl text-sm font-light text-red-500">
              Could not load payout data. Please try again shortly.
            </div>
          )}

          {!isLoading && !isError && activeTab === 'transactions' && (
            <>
              <TransactionsTab transactions={transactions?.items ?? []} />
              {transactions && transactions.pages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <button
                    onClick={() => setTransactionsPage((prev) => Math.max(1, prev - 1))}
                    disabled={transactionsPage === 1}
                    className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: transactions.pages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === transactionsPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setTransactionsPage(pageNum)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer',
                          isActive
                            ? 'bg-brand-pink text-white shadow-xs'
                            : 'border border-[#e8e6f0] hover:bg-[#fcfbfd] text-[#7a7a9a]',
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setTransactionsPage((prev) => Math.min(transactions.pages, prev + 1))
                    }
                    disabled={transactionsPage === transactions.pages}
                    className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}

          {!isLoading && !isError && activeTab === 'escrows' && (
            <EscrowsTab
              escrows={escrow?.items ?? []}
              totalActiveEscrow={escrow?.totalActiveEscrow ?? 0}
              currency={summary?.currency}
            />
          )}

          {activeTab === 'needing-funding' && needingFundingLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[84px] bg-white border border-[#e8e6f0]/70 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}

          {activeTab === 'needing-funding' && !needingFundingLoading && needingFundingHasError && (
            <div className="text-center py-10 border border-dashed border-red-200 bg-red-50/40 rounded-3xl text-sm font-light text-red-500">
              Could not load campaigns awaiting payment. Please try again shortly.
            </div>
          )}

          {activeTab === 'needing-funding' && !needingFundingLoading && !needingFundingHasError && (
            <NeedingFundingTab campaigns={needingFundingCampaigns} onContinue={handleContinue} />
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          <BankDetailsCard
            bankName={bankName}
            accountName={accountName}
            accountNumber={accountNumber}
            onChange={() => setIsBankModalOpen(true)}
          />
        </div>
      </div>

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
