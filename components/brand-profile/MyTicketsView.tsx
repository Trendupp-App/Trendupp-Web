'use client';

import { ArrowLeft, Inbox } from 'lucide-react';
import { useTickets } from '@/hooks/useBrandProfileMutations';
import { Skeleton } from '@/components/ui/skeleton';

interface MyTicketsViewProps {
  onBack: () => void;
  onSubmitTicket: () => void;
}

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  open: { label: 'Open', bg: '#eff6ff', text: '#2563eb' },
  in_progress: { label: 'In Progress', bg: '#fff7ed', text: '#ea580c' },
  resolved: { label: 'Resolved', bg: '#f0fdf4', text: '#16a34a' },
  closed: { label: 'Closed', bg: '#f4f3f6', text: '#7a7a9a' },
};

export default function MyTicketsView({ onBack, onSubmitTicket }: MyTicketsViewProps) {
  const { data: tickets, isLoading } = useTickets(true);

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div>
        <h2 className="text-base font-semibold text-[#1a1a2e]">My Tickets</h2>
        <p className="text-sm text-[#9a99b0] mt-0.5">All support tickets you have submitted.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f4f3f6] flex items-center justify-center">
            <Inbox size={22} className="text-[#9a99b0]" />
          </div>
          <p className="text-sm font-medium text-[#7a7a9a]">You have no submitted tickets yet.</p>
          <button
            type="button"
            onClick={onSubmitTicket}
            className="text-xs font-semibold text-brand-pink hover:underline"
          >
            Submit your first ticket →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {tickets.map((t) => {
            const s = STATUS_META[t.status] ?? { label: t.status, bg: '#f4f3f6', text: '#7a7a9a' };
            return (
              <div
                key={t.id}
                className="border border-[#e8e6f0] rounded-xl px-4 py-3.5 flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-[#1a1a2e] leading-snug flex-1">
                    {t.subject}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                </div>
                <span className="text-xs text-[#9a99b0]">{t.issueCategory?.name ?? '—'}</span>
                <span className="text-[11px] text-[#c4c2d4]">
                  {new Date(t.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
