import Image from 'next/image';
import { Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { CampaignApplicationDto } from '@/types/campaign';

interface ImpactHistoryListProps {
  applications: CampaignApplicationDto[] | undefined;
  isLoading: boolean;
}

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: '#fff7ed', text: '#ea580c' },
  accepted: { label: 'Accepted', bg: '#f0fdf4', text: '#16a34a' },
  rejected: { label: 'Rejected', bg: '#fef2f2', text: '#dc2626' },
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';

export default function ImpactHistoryList({ applications, isLoading }: ImpactHistoryListProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-[#1a1a2e]">
        Social Impact campaigns you&apos;ve applied to
      </h3>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[72px] rounded-2xl" />
          ))}
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center bg-white border border-dashed border-[#e8e6f0] rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-[#f4f3f6] flex items-center justify-center">
            <Inbox size={22} className="text-[#9a99b0]" />
          </div>
          <p className="text-sm font-semibold text-[#7a7a9a]">
            You haven&apos;t applied to any Social Impact campaigns yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {applications.map((app) => {
            const s = STATUS_META[app.status] ?? {
              label: app.status,
              bg: '#f4f3f6',
              text: '#7a7a9a',
            };
            return (
              <div
                key={app.id}
                className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-3.5 flex items-center gap-3"
              >
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <Image
                    src={app.campaign?.coverImage || FALLBACK_IMAGE}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-sm font-bold text-[#1a1a2e] truncate">
                    {app.campaign?.title || 'Untitled campaign'}
                  </span>
                  <span className="text-xs text-[#9a99b0]">
                    {app.campaign?.brand?.username || 'Trendupp'} · Applied{' '}
                    {new Date(app.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{ backgroundColor: s.bg, color: s.text }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
