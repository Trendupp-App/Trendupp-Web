import type { Campaign } from '@/types/campaign';
import { CircleCheck, CircleX } from 'lucide-react';
interface InfoBoxProps {
  label: string;
  value: React.ReactNode;
}

function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="bg-[#faf9fc] rounded-lg px-2 py-3 flex flex-col gap-1">
      <span className="text-xs text-[#9a99b0]">{label}</span>
      <span className="text-sm font-semibold text-[#1a1a2e]">{value}</span>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#e8e6f0] rounded-xl p-4 flex flex-col gap-3">
      <h3 className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function PlatformBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ede9fb] text-[#7c6fe0] border border-[#d8d3f5]">
      {name}
    </span>
  );
}

function NicheBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-300">
      {name}
    </span>
  );
}

interface CampaignOverviewTabProps {
  campaign: Campaign;
}

export default function CampaignOverviewTab({ campaign }: CampaignOverviewTabProps) {
  const platforms = campaign.preferredPlatforms ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-[#e8e6f0] rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <InfoBox
          label="Campaign title"
          value={
            <>
              <p>{campaign?.title}</p>
            </>
          }
        />
        <InfoBox label="Goal" value={campaign?.goal} />
        <InfoBox
          label="Platform"
          value={
            platforms.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {platforms.map((p) => (
                  <PlatformBadge key={p.id} name={p.name} />
                ))}
              </div>
            ) : (
              '—'
            )
          }
        />
        <InfoBox
          label="Niche"
          value={
            campaign?.creatorNiche?.name ? (
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                <NicheBadge key={campaign.creatorNiche.id} name={campaign.creatorNiche.name} />
              </div>
            ) : (
              '—'
            )
          }
        />
      </div>

      {campaign?.campaignBrief && (
        <DetailSection title="Campaign Brief">
          <p className="text-sm text-[#4a4a6a] leading-relaxed">{campaign?.campaignBrief}</p>
        </DetailSection>
      )}

      {campaign?.deliverables && campaign?.deliverables.length > 0 && (
        <DetailSection title="Deliverables">
          <ol className="flex flex-col gap-2">
            {campaign.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1a1a2e]">
                <span className="w-5 h-5 rounded-full bg-brand-pink text-white text-[10px] font-medium flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {d}
              </li>
            ))}
          </ol>
        </DetailSection>
      )}

      {campaign?.contentDirection && campaign?.contentDirection.length > 0 && (
        <DetailSection title="Content Direction">
          <ol className="flex flex-col gap-2">
            {campaign?.contentDirection.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1a1a2e]">
                <span className="w-5 h-5 rounded-full bg-brand-pink text-white text-[10px] font-medium flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {d}
              </li>
            ))}
          </ol>
        </DetailSection>
      )}

      {campaign?.contentGuidelines && (
        <DetailSection title="Content Guidelines">
          <div className="flex flex-col gap-2">
            {campaign?.contentGuidelines.dos.map((d, i) => (
              <p key={`do-${i}`} className="flex items-start gap-2 text-sm text-[#1a1a2e]">
                <span className="text-emerald-500 shrink-0">
                  <CircleCheck size={16} />
                </span>
                {d}
              </p>
            ))}
            {campaign?.contentGuidelines.donts.map((d, i) => (
              <p key={`dont-${i}`} className="flex items-start gap-2 text-sm text-[#1a1a2e]">
                <span className="text-red-500 shrink-0">
                  <CircleX size={16} />
                </span>
                {d}
              </p>
            ))}
          </div>
        </DetailSection>
      )}

      {campaign?.successLooksLike && (
        <DetailSection title="What Success Looks Like">
          <p className="text-sm text-[#4a4a6a] leading-relaxed">{campaign?.successLooksLike}</p>
        </DetailSection>
      )}

      {campaign?.usageRights && (
        <DetailSection title="Usage Rights">
          <p className="text-sm text-[#4a4a6a] leading-relaxed">{campaign?.usageRights}</p>
        </DetailSection>
      )}
    </div>
  );
}
