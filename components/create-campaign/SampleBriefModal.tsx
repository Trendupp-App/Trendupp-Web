'use client';

import { useState } from 'react';
import { X, Check, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sampleBriefs, type SampleBrief } from '@/lib/data/sampleBriefs';

interface SampleBriefModalProps {
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-[#9a99b0]">{label}</span>
      <span className="text-sm font-light text-[#1a1a2e]">{value}</span>
    </div>
  );
}

function ListSection({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#1a1a2e]">{label}</span>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm font-light text-[#4a4a6a] leading-relaxed pl-3 relative"
          >
            <span className="absolute left-0 top-2 w-1 h-1 rounded-full bg-[#c4c2d4]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GuidelineSection({
  label,
  items,
  icon,
  tone,
}: {
  label: string;
  items: string[];
  icon: React.ReactNode;
  tone: 'positive' | 'negative';
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#1a1a2e]">{label}</span>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm font-light text-[#4a4a6a] leading-relaxed"
          >
            <span
              className={cn(
                'mt-0.5 shrink-0',
                tone === 'positive' ? 'text-emerald-500' : 'text-red-400',
              )}
            >
              {icon}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SampleBriefContent({ sample }: { sample: SampleBrief }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Campaign Title" value={sample.title} />
        <Field label="Campaign Goal" value={sample.campaignGoal} />
        <Field label="Creator Tier" value={sample.creatorTier} />
        <Field label="Total Budget" value={sample.totalBudget} />
        <Field label="Creator Niche" value={sample.creatorNiche} />
        <Field label="Where to Post" value={sample.platforms} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#1a1a2e]">Campaign Brief</span>
        <p className="text-sm font-light text-[#4a4a6a] leading-relaxed">{sample.brief}</p>
      </div>

      {sample.contentAssetLink && (
        <Field label="Content Asset Link" value={sample.contentAssetLink} />
      )}

      <ListSection label="Deliverables" items={sample.deliverables} />
      <ListSection label="Content Direction" items={sample.contentDirection} />
      <GuidelineSection
        label="Content Guidelines - Do's"
        items={sample.dos}
        icon={<Check size={13} strokeWidth={2.5} />}
        tone="positive"
      />
      <GuidelineSection
        label="Content Guidelines - Don'ts"
        items={sample.donts}
        icon={<XIcon size={13} strokeWidth={2.5} />}
        tone="negative"
      />
    </div>
  );
}

export default function SampleBriefModal({ onClose }: SampleBriefModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'amplify'>('create');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-[560px] flex flex-col max-h-[85vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-base font-bold text-[#1a1a2e]">Sample Campaign Briefs</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f4f3f8] transition-colors text-[#7a7a9a] hover:text-[#1a1a2e]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pb-4 shrink-0">
          {(
            [
              { key: 'create', label: 'Create Content' },
              { key: 'amplify', label: 'Amplify Content' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm transition-colors cursor-pointer',
                activeTab === tab.key
                  ? 'bg-brand-pink text-white font-medium'
                  : 'bg-[#f4f3f8] text-[#7a7a9a] font-light hover:text-[#1a1a2e]',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <SampleBriefContent sample={sampleBriefs[activeTab]} />
        </div>
      </div>
    </div>
  );
}
