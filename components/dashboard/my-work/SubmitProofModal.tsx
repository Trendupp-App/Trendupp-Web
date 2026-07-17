// 'use client';

// import { useState } from 'react';
// import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { X, Link2, AlertCircle, Clock, Plus } from 'lucide-react';
// import { WorkCampaign } from '@/components/creator-dashboard/WorkCampaignCard';

// interface SubmitProofModalProps {
//   isOpen: boolean;
//   campaign: WorkCampaign | null;
//   onClose: () => void;
//   onSubmit: (link: string) => void;
// }

// export default function SubmitProofModal({
//   isOpen,
//   campaign,
//   onClose,
//   onSubmit,
// }: SubmitProofModalProps) {
//   const [link, setLink] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isConfirmed, setIsConfirmed] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!link.trim()) {
//       setError('Please enter the live post link');
//       return;
//     }

//     const normalizedLink = /^https?:\/\//i.test(link) ? link : `https://${link}`;
//     try {
//       new URL(normalizedLink);
//     } catch {
//       setError('Please enter a valid URL');
//       return;
//     }

//     if (!isConfirmed) {
//       setError('You must confirm the 3-month live requirement');
//       return;
//     }

//     setIsSubmitting(true);
//     setTimeout(() => {
//       onSubmit(link);
//       setLink('');
//       setIsConfirmed(false);
//       setIsSubmitting(false);
//       onClose();
//     }, 1200);
//   };

//   const isLinkFilled = link.trim().length > 0;

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent
//         showCloseButton={false}
//         className="sm:max-w-[420px] rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-5 shadow-xl scrollbar-hide select-none"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div className="flex flex-col gap-0.5">
//             <DialogTitle className="text-[17px] font-bold text-[#1a1a2e]">
//               Submit Proof of Posting
//             </DialogTitle>
//             <p className="text-[11px] font-light text-[#7a7a9a]">
//               {campaign?.title ?? 'Healthy Living Challenge'}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
//           >
//             <X size={15} />
//           </button>
//         </div>

//         {/* Pink Warning Block */}
//         <div className="bg-[#fff0f5] border border-[#fcecf3] rounded-2xl p-4 flex gap-3 text-left">
//           <Clock className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
//           <div className="flex flex-col gap-0.5">
//             <span className="text-[11px] font-bold text-brand-pink">3 months Live Requirement</span>
//             <p className="text-[10.5px] text-[#7a7a9a] font-light leading-relaxed">
//               Your post must remain live on {campaign?.platform ?? 'YouTube'} for at least 3 months
//               before payment is released from escrow. Do not delete or archive it.
//             </p>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {/* Post URL Field */}
//           <div className="flex flex-col gap-1.5">
//             <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
//               Post URL *
//             </Label>
//             <div className="relative">
//               <Link2
//                 size={16}
//                 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
//               />
//               <Input
//                 type="text"
//                 placeholder={`https://${(campaign?.platform ?? 'youtube').toLowerCase()}.com/...`}
//                 value={link}
//                 onChange={(e) => setLink(e.target.value)}
//                 className="border-[#e8e6f0] h-11 text-xs font-light pl-10 focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
//               />
//             </div>
//             <span className="text-[10px] text-[#9a99b0] font-light mt-0.5">
//               If the link is broken or invalid, you have 24hrs to resubmit.
//             </span>
//             {error && (
//               <div className="flex items-center gap-1 mt-1 text-[#dc2626] text-[10px]">
//                 <AlertCircle size={12} />
//                 <span>{error}</span>
//               </div>
//             )}
//           </div>

//           {/* Add another platform link button */}
//           <button
//             type="button"
//             className="w-full border border-dashed border-brand-pink/60 hover:bg-brand-pink-light/30 text-brand-pink text-xs font-semibold py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all focus:outline-none cursor-pointer"
//           >
//             <Plus size={14} />
//             Add another platform link
//           </button>

//           {/* Confirmation Checkbox */}
//           <div className="flex items-start gap-3 mt-1.5">
//             <input
//               type="checkbox"
//               id="confirm-live"
//               checked={isConfirmed}
//               onChange={(e) => setIsConfirmed(e.target.checked)}
//               className="w-4.5 h-4.5 rounded border-[#e8e6f0] text-brand-pink focus:ring-brand-pink/30 cursor-pointer mt-0.5 accent-brand-pink"
//             />
//             <label
//               htmlFor="confirm-live"
//               className="text-[10.5px] text-[#5a5a7a] font-light leading-relaxed cursor-pointer select-none"
//             >
//               I confirm the post is live and I will keep it up for at least 3 months. I understand I
//               will be banned from Trendupp App if I default.
//             </label>
//           </div>

//           <Button
//             type="submit"
//             disabled={isSubmitting || !isLinkFilled || !isConfirmed}
//             className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/45 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? 'Submitting...' : 'Submit Proof of Posting'}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Link2, AlertCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { WorkCampaign } from '@/components/creator-dashboard/WorkCampaignCard';

export interface LiveLinkEntry {
  platform: string; // e.g. 'instagram', 'tiktok', 'youtube', 'twitter'
  link: string;
}

interface SubmitProofModalProps {
  isOpen: boolean;
  campaign: WorkCampaign | null;
  onClose: () => void;
  onSubmit: (entries: LiveLinkEntry[]) => void;
}

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'X / Twitter' },
];

function normalizePlatformKey(platform: string): string {
  const lower = platform.trim().toLowerCase();
  if (lower === 'x') return 'twitter';
  return lower;
}

let entryIdCounter = 0;
function nextEntryId() {
  entryIdCounter += 1;
  return `entry-${entryIdCounter}`;
}

export default function SubmitProofModal({
  isOpen,
  campaign,
  onClose,
  onSubmit,
}: SubmitProofModalProps) {
  const defaultPlatform = campaign ? normalizePlatformKey(campaign.platform) : 'instagram';

  const [entries, setEntries] = useState<{ id: string; platform: string; link: string }[]>([
    { id: nextEntryId(), platform: defaultPlatform, link: '' },
  ]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  function resetState() {
    setEntries([{ id: nextEntryId(), platform: defaultPlatform, link: '' }]);
    setIsConfirmed(false);
    setError('');
  }

  function handleAddEntry() {
    const usedPlatforms = new Set(entries.map((e) => e.platform));
    const nextPlatform =
      PLATFORM_OPTIONS.find((p) => !usedPlatforms.has(p.value))?.value ?? PLATFORM_OPTIONS[0].value;
    setEntries((prev) => [...prev, { id: nextEntryId(), platform: nextPlatform, link: '' }]);
  }

  function handleRemoveEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handlePlatformChange(id: string, platform: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, platform } : e)));
  }

  function handleLinkChange(id: string, link: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, link } : e)));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate every entry has a non-empty, valid URL
    for (const entry of entries) {
      if (!entry.link.trim()) {
        setError('Please fill in every link, or remove any empty rows.');
        return;
      }
      const normalizedLink = /^https?:\/\//i.test(entry.link)
        ? entry.link
        : `https://${entry.link}`;
      try {
        new URL(normalizedLink);
      } catch {
        setError(`"${entry.link}" is not a valid URL.`);
        return;
      }
    }

    // Guard against duplicate platform keys — the API expects one link per
    // platform, so two rows targeting the same platform would silently
    // overwrite each other in the liveLink map.
    const platforms = entries.map((e) => e.platform);
    if (new Set(platforms).size !== platforms.length) {
      setError('Each platform can only have one link. Please remove the duplicate.');
      return;
    }

    if (!isConfirmed) {
      setError('You must confirm the 3-month live requirement');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(entries.map(({ platform, link }) => ({ platform, link })));
      resetState();
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  const allLinksFilled = entries.every((e) => e.link.trim().length > 0);
  const canAddMore = entries.length < PLATFORM_OPTIONS.length;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetState();
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[420px] max-h-[85vh] rounded-[24px] bg-white border border-[#e8e6f0]/60 shadow-xl select-none flex flex-col p-0 gap-0 overflow-hidden"
      >
        {/* Header — fixed, does not scroll */}
        <div className="flex justify-between items-start p-6 pb-0 shrink-0">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-[17px] font-bold text-[#1a1a2e]">
              Submit Proof of Posting
            </DialogTitle>
            <p className="text-[11px] font-light text-[#7a7a9a]">
              {campaign?.title ?? 'Healthy Living Challenge'}
            </p>
          </div>
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable middle section */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-5 scrollbar-hide">
          {/* Pink Warning Block */}
          <div className="bg-[#fff0f5] border border-[#fcecf3] rounded-2xl p-4 flex gap-3 text-left">
            <Clock className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-brand-pink">
                3 months Live Requirement
              </span>
              <p className="text-[10.5px] text-[#7a7a9a] font-light leading-relaxed">
                Your post must remain live on each platform for at least 3 months before payment is
                released from escrow. Do not delete or archive it.
              </p>
            </div>
          </div>

          <form id="submit-proof-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* One row per platform link */}
            <div className="flex flex-col gap-3">
              {entries.map((entry, index) => (
                <div key={entry.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      {index === 0 ? 'Post URL *' : `Additional link ${index}`}
                    </Label>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="text-[#9a99b0] hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={entry.platform}
                      onChange={(e) => handlePlatformChange(entry.id, e.target.value)}
                      className="border border-[#e8e6f0] rounded-xl h-11 px-2.5 text-xs font-medium text-[#1a1a2e] bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink/30 focus:border-brand-pink shrink-0 w-[110px]"
                    >
                      {PLATFORM_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>

                    <div className="relative flex-1">
                      <Link2
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
                      />
                      <Input
                        type="text"
                        placeholder={`https://${entry.platform}.com/...`}
                        value={entry.link}
                        onChange={(e) => handleLinkChange(entry.id, e.target.value)}
                        className="border-[#e8e6f0] h-11 text-xs font-light pl-10 focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <span className="text-[10px] text-[#9a99b0] font-light">
                If a link is broken or invalid, you have 24hrs to resubmit.
              </span>

              {error && (
                <div className="flex items-center gap-1 text-[#dc2626] text-[10px]">
                  <AlertCircle size={12} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Add another platform link button */}
            {canAddMore && (
              <button
                type="button"
                onClick={handleAddEntry}
                className="w-full border border-dashed border-brand-pink/60 hover:bg-brand-pink-light/30 text-brand-pink text-xs font-semibold py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all focus:outline-none cursor-pointer"
              >
                <Plus size={14} />
                Add another platform link
              </button>
            )}

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 mt-1.5">
              <input
                type="checkbox"
                id="confirm-live"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#e8e6f0] text-brand-pink focus:ring-brand-pink/30 cursor-pointer mt-0.5 accent-brand-pink"
              />
              <label
                htmlFor="confirm-live"
                className="text-[10.5px] text-[#5a5a7a] font-light leading-relaxed cursor-pointer select-none"
              >
                I confirm the post is live and I will keep it up for at least 3 months. I understand
                I will be banned from Trendupp App if I default.
              </label>
            </div>
          </form>
        </div>

        {/* Footer — fixed, does not scroll */}
        <div className="p-6 pt-4 border-t border-[#e8e6f0]/60 shrink-0">
          <Button
            type="submit"
            form="submit-proof-form"
            disabled={isSubmitting || !allLinksFilled || !isConfirmed}
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95 disabled:bg-brand-pink/45 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Proof of Posting'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
