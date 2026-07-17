'use client';

import { useState } from 'react';
import PayoutHeader from '@/components/brand-payout/PayOutHeader';
import PayoutBalanceCard from '@/components/brand-payout/PayoutBalanceCard';
import PayoutTabs, { type PayoutTab } from '@/components/brand-payout/PayoutTabs';
import TransactionsTab from '@/components/brand-payout/TransactionsTab';
import EscrowsTab from '@/components/brand-payout/EscrowsTab';
import NeedingFundingTab from '@/components/brand-payout/NeedingFundingTab';
import {
  DUMMY_PAYOUT_SUMMARY,
  DUMMY_TRANSACTIONS,
  DUMMY_ESCROWS,
  DUMMY_NEEDING_FUNDING,
} from '@/dummy/payout';
import type { NeedingFundingItem } from '@/types/payout';

export default function BrandPayoutPage() {
  const [activeTab, setActiveTab] = useState<PayoutTab>('transactions');

  function handleContinue(item: NeedingFundingItem) {
    // TODO: route to campaign creation flow at the right step
    console.log('continue', item.id);
  }

  function handleDelete(item: NeedingFundingItem) {
    // TODO: wire to delete-draft mutation
    console.log('delete', item.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <PayoutHeader />
      <PayoutBalanceCard summary={DUMMY_PAYOUT_SUMMARY} />
      <PayoutTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'transactions' && <TransactionsTab transactions={DUMMY_TRANSACTIONS} />}
      {activeTab === 'escrows' && <EscrowsTab escrows={DUMMY_ESCROWS} />}
      {activeTab === 'needing-funding' && (
        <NeedingFundingTab
          items={DUMMY_NEEDING_FUNDING}
          onContinue={handleContinue}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
