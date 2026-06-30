'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfilePayout } from '@/hooks/useProfile';
import { ArrowLeft } from 'lucide-react';
import PayoutBalanceCard from '@/components/dashboard/payout/PayoutBalanceCard';
import BankDetailsCard from '@/components/dashboard/payout/BankDetailsCard';
import TransactionHistoryList, {
  Transaction,
} from '@/components/dashboard/payout/TransactionHistoryList';
import EscrowReleaseList, { EscrowRelease } from '@/components/dashboard/payout/EscrowReleaseList';
import BankChangeModal from '@/components/dashboard/payout/BankChangeModal';
import { cn } from '@/lib/utils';

// Mock Transaction History (matches mobile & desktop Figma mockups)
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Summer Style Collection',
    brandOrDetails: 'Zara Africa',
    date: 'May 28, 2025',
    amount: 180000,
    type: 'credit',
    status: 'available',
  },
  {
    id: 'tx-2',
    title: 'TECNO SPARK Launch',
    brandOrDetails: 'Tecno Mobile',
    date: 'May 22, 2025',
    amount: 350000,
    type: 'credit',
    status: 'available',
  },
  {
    id: 'tx-3',
    title: 'Withdrawal',
    brandOrDetails: 'GTBank ****4521',
    date: 'May 20, 2025',
    amount: 200000,
    type: 'debit',
    status: 'completed',
  },
  {
    id: 'tx-4',
    title: 'Music Promo Campaign',
    brandOrDetails: 'Audiomack',
    date: 'May 15, 2025',
    amount: 250000,
    type: 'credit',
    status: 'on_hold',
  },
  {
    id: 'tx-5',
    title: 'Beauty Campaign',
    brandOrDetails: 'House of Tara',
    date: 'May 10, 2025',
    amount: 120000,
    type: 'credit',
    status: 'on_hold',
  },
  {
    id: 'tx-6',
    title: 'Platform Commission',
    brandOrDetails: 'Trendupp (10%)',
    date: 'May 10, 2025',
    amount: 13300,
    type: 'debit',
    status: 'completed',
  },
];

// Mock Escrow Release Data (matches mobile & desktop Figma mockups)
const MOCK_ESCROW_RELEASES: EscrowRelease[] = [
  {
    id: 'esc-1',
    title: 'Music Streaming Promo',
    brand: 'Audiomack',
    amount: 250000,
    daysRemaining: 20,
    releaseDate: 'June 20, 2025',
  },
  {
    id: 'esc-2',
    title: 'Beauty Campaign',
    brand: 'House of Tara',
    amount: 120000,
    daysRemaining: 28,
    releaseDate: 'June 28, 2025',
  },
  {
    id: 'esc-3',
    title: 'Sports Energy Drive',
    brand: 'Monster Energy',
    amount: 80000,
    daysRemaining: 35,
    releaseDate: 'July 5, 2025',
  },
];

export default function CreatorPayoutPage() {
  const { user } = useAuthStore();
  const { mutate: updatePayout } = useUpdateProfilePayout();

  const [activeTab, setActiveTab] = useState<'transactions' | 'escrow'>('transactions');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // Fallbacks using store user details or mock defaults for demonstration
  const bankName = user?.bankName || 'GTBank (Guaranty Trust)';
  const accountName = user?.bankAccountName || 'Alex Okafor';
  const accountNumber = user?.bankAccountNumber || '9867896986';

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
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* ── Mobile Page Header ── */}
      <div className="flex items-center gap-3.5 md:hidden">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-[#f4f4f8] flex items-center justify-center text-[#1a1a2e] border-none cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-bold text-[#1a1a2e]">Payout</h1>
      </div>

      {/* ── Desktop Page Header ── */}
      <div className="hidden md:flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">Payouts</h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          All payments are secured in escrow and released after content approval.
        </p>
      </div>

      {/* ── Balance Card ── */}
      <PayoutBalanceCard availableBalance={397.0} hold30Day={450.0} totalEarned={750.0} />

      {/* ── Tabs selector container ── */}
      <div className="bg-[#f4f3f6] rounded-2xl p-1 flex gap-1 w-full max-w-[340px] text-xs font-semibold text-[#7a7a9a]">
        <button
          onClick={() => setActiveTab('transactions')}
          className={cn(
            'py-2.5 flex-1 text-center rounded-xl transition-all cursor-pointer border-none font-semibold',
            activeTab === 'transactions'
              ? 'bg-white text-[#1a1a2e] shadow-xs'
              : 'bg-transparent text-[#7a7a9a] hover:text-[#1a1a2e]',
          )}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('escrow')}
          className={cn(
            'py-2.5 flex-1 text-center rounded-xl transition-all cursor-pointer border-none font-semibold',
            activeTab === 'escrow'
              ? 'bg-white text-[#1a1a2e] shadow-xs'
              : 'bg-transparent text-[#7a7a9a] hover:text-[#1a1a2e]',
          )}
        >
          Escrow
        </button>
      </div>

      {/* ── Responsive Grid Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Main List Section (col-span-2) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {activeTab === 'transactions' ? (
            <TransactionHistoryList transactions={MOCK_TRANSACTIONS} />
          ) : (
            <EscrowReleaseList pendingReleases={MOCK_ESCROW_RELEASES} />
          )}
        </div>

        {/* Sidebar Section (col-span-1) */}
        <div className="flex flex-col gap-5">
          {/* Bank details card (always available on desktop, shown inside transaction history tab on mobile) */}
          <div className={cn(activeTab === 'transactions' ? 'block' : 'hidden lg:block')}>
            <BankDetailsCard
              bankName={bankName}
              accountName={accountName}
              accountNumber={accountNumber}
              onChange={() => setIsBankModalOpen(true)}
            />
          </div>

          {/* Tab Specific Notification Card */}
          {activeTab === 'transactions' ? (
            <div className="flex gap-3 bg-pink-50 border border-pink-100 rounded-3xl p-5 shadow-xs">
              <div className="w-5 h-5 rounded-full bg-pink-100/50 flex items-center justify-center text-brand-pink shrink-0 mt-0.5">
                <span className="text-[10px] font-bold">i</span>
              </div>
              <p className="text-xs text-brand-pink leading-relaxed font-light">
                Payments are automatically transferred to your linked bank account once the 30-day
                hold period ends. No manual withdrawal required.
              </p>
            </div>
          ) : (
            <div className="flex gap-3 bg-amber-50/50 border border-amber-100 rounded-3xl p-5 shadow-xs lg:hidden">
              <div className="w-5 h-5 rounded-full bg-amber-100/40 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                <span className="text-[10px] font-bold">!</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed font-light">
                Every campaign payment is held for 30 days after posting is verified to protect both
                parties.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Change Bank Details Drawer Modal */}
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
