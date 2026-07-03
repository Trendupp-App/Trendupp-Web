'use client';

import { useState } from 'react';
import { Mail, Phone, FileText, ChevronDown, ChevronRight, Star } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import SubmitTicketView from './SubmitTicketView';

const FAQS = [
  {
    q: 'How does escrow payment work?',
    a: 'When a brand approves your application, the campaign budget is locked in escrow. Funds are released to your wallet within 48 hours after you submit your content deliverables and the brand confirms receipt, withdraw payment on or after 30 days.',
  },
  {
    q: 'How long does profile verification take?',
    a: 'Profile verification typically takes 24–48 hours after you complete all onboarding steps.',
  },
  {
    q: 'Can I apply for multiple campaigns?',
    a: 'Yes, you can apply for multiple campaigns simultaneously as long as you meet the tier requirements.',
  },
  {
    q: "What happens if a brand doesn't approve my work?",
    a: "If a brand doesn't approve your content, you can submit a revision. Disputes can be raised through our support system.",
  },
  {
    q: 'How do I withdraw my earnings?',
    a: 'Earnings are released to your linked bank account within 48 hours of content approval.',
  },
  {
    q: 'What creator tiers are available?',
    a: 'We have Nano (under 10K), Micro (10K–100K), Macro (100K–1M), and Mega (1M+) tiers based on follower count.',
  },
];

interface HelpSupportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#e8e6f0] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full cursor-pointer flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#faf9fc] transition-colors"
      >
        <span className="text-sm font-medium text-[#1a1a2e] pr-4">{q}</span>
        {open ? (
          <ChevronDown size={16} className="text-[#9a99b0] shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-[#9a99b0] shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-[#4a4a6a] leading-relaxed border-t border-[#e8e6f0] pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpSupportSheet({ open, onOpenChange }: HelpSupportSheetProps) {
  const [showTicket, setShowTicket] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setShowTicket(false);
      }}
    >
      <SheetContent side="right" className="px-3 w-full sm:max-w-[500px] overflow-y-auto">
        {showTicket ? (
          <div className="pt-2">
            <SubmitTicketView
              onBack={() => setShowTicket(false)}
              onClose={() => onOpenChange(false)}
            />
          </div>
        ) : (
          <>
            <SheetHeader className="mb-6">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base font-semibold text-[#1a1a2e]">
                  Help & Support
                </SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-6">
              {/* Contact options */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider">
                  Contact Us
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    {
                      icon: Mail,
                      label: 'Email',
                      sub: 'trendupp.@gmail.com',
                      color: 'bg-red-50 text-red-500',
                    },
                    {
                      icon: Phone,
                      label: 'Call Support',
                      sub: 'Mon–Fri, 9am–6pm WAT',
                      color: 'bg-purple-50 text-purple-500',
                    },
                    {
                      icon: FileText,
                      label: 'Submit a Ticket',
                      sub: 'Response within 24 hrs',
                      color: 'bg-blue-50 text-blue-500',
                      onClick: () => setShowTicket(true),
                    },
                  ].map(({ icon: Icon, label, sub, color, onClick }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className="flex flex-col items-center gap-2 border border-[#e8e6f0] rounded-xl px-3 py-2 text-center hover:bg-[#faf9fc] transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <p className="text-xs font-semibold text-[#1a1a2e]">{label}</p>
                      <p className="text-[10px] text-[#9a99b0] leading-normal">{sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider">
                  FAQs
                </p>
                <div className="flex flex-col gap-2">
                  {FAQS.map((faq) => (
                    <FaqItem key={faq.q} {...faq} />
                  ))}
                </div>
              </div>

              {/* Rate us */}
              <div className="flex flex-col items-center gap-3 py-4">
                <p className="text-base font-bold text-[#1a1a2e]">Enjoying Trendupp?</p>
                <p className="text-xs text-[#9a99b0]">Your review helps us grow</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={28} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <button className="w-full py-3.5 bg-brand-pink text-white text-sm font-medium rounded-xl hover:bg-brand-pink/90 transition-colors">
                  Rate us on playstore
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
