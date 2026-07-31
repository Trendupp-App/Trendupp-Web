'use client';

import { useState } from 'react';
import { Mail, Phone, FileText, ChevronDown, ChevronRight, MapPin, Inbox } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useContactInfo, useFaqs } from '@/hooks/useSettings';
import ConnectWithUsSection from '@/shared/ConnectWithUsSection';
import SubmitTicketView from './SubmitTicketView';
import MyTicketsView from './MyTicketsView';

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
  const [view, setView] = useState<'main' | 'ticket' | 'my-tickets'>('main');
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo(open);
  const { data: faqs, isLoading: faqsLoading } = useFaqs(open);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setView('main');
      }}
    >
      <SheetContent side="right" className="px-3 w-full sm:max-w-[600px] overflow-y-auto pb-4">
        {view === 'ticket' ? (
          <div className="pt-2">
            <SubmitTicketView onBack={() => setView('main')} onClose={() => onOpenChange(false)} />
          </div>
        ) : view === 'my-tickets' ? (
          <div className="pt-2">
            <MyTicketsView
              onBack={() => setView('main')}
              onSubmitTicket={() => setView('ticket')}
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
                {contactLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-[110px] rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: Mail,
                        label: 'Email',
                        sub: contactInfo?.supportEmail ?? '—',
                        color: 'bg-red-50 text-red-500',
                        onClick: () =>
                          contactInfo?.supportEmail &&
                          window.open(`mailto:${contactInfo.supportEmail}`),
                      },
                      {
                        icon: Phone,
                        label: 'Call Support',
                        sub: contactInfo?.supportPhone ?? '—',
                        color: 'bg-purple-50 text-purple-500',
                        onClick: () =>
                          contactInfo?.supportPhone &&
                          window.open(`tel:${contactInfo.supportPhone}`),
                      },
                      {
                        icon: FileText,
                        label: 'Submit a Ticket',
                        sub: 'Response within 24 hrs',
                        color: 'bg-blue-50 text-blue-500',
                        onClick: () => setView('ticket'),
                      },
                      {
                        icon: Inbox,
                        label: 'My Tickets',
                        sub: 'Track submissions',
                        color: 'bg-green-50 text-green-600',
                        onClick: () => setView('my-tickets'),
                      },
                    ].map(({ icon: Icon, label, sub, color, onClick }) => (
                      <button
                        key={label}
                        onClick={onClick}
                        className="flex flex-col items-center gap-2.5 border border-[#e8e6f0] rounded-xl px-4 py-5 text-center hover:bg-[#faf9fc] hover:border-brand-pink/20 transition-colors"
                      >
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                        >
                          <Icon size={19} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs font-semibold text-[#1a1a2e]">{label}</p>
                          <p className="text-[11px] text-[#9a99b0] leading-snug break-words line-clamp-2">
                            {sub}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {contactInfo?.businessAddress && (
                  <p className="flex items-start gap-1.5 text-[11px] text-[#9a99b0] px-1 mt-1">
                    <MapPin size={12} className="shrink-0 mt-0.5" />
                    {contactInfo.businessAddress}
                  </p>
                )}
              </div>

              {/* Connect with us */}
              <ConnectWithUsSection enabled={open} />

              {/* FAQs */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider">
                  FAQs
                </p>
                <div className="flex flex-col gap-2">
                  {faqsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 rounded-xl" />
                    ))
                  ) : faqs && faqs.length > 0 ? (
                    faqs.map((faq) => <FaqItem key={faq.id} q={faq.question} a={faq.answer} />)
                  ) : (
                    <p className="text-xs text-[#9a99b0] text-center py-4">
                      No FAQs available right now.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
