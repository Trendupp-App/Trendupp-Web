'use client';

import { X } from 'lucide-react';
import { Portal } from '@/components/ui/portal';

interface TermsModalProps {
  onAgree: () => void;
  onClose: () => void;
}

const TERMS_CONTENT = [
  {
    heading: 'Terms and Conditions for Trendupp:',
    points: [
      '1. Acceptance: By using Trendupp, you agree to follow all terms and conditions outlined here.',
      '2. Usage: Trendupp is for personal and professional influencer marketing use only; commercial use without permission is prohibited.',
      '3. Account Security: You are responsible for safeguarding your account and all activities under it.',
      '4. Content Rules: Do not upload content that infringes on copyrights, privacy rights, or violates laws.',
      '5. Terms Updates: Trendupp may update these terms anytime and will notify you via the app or email.',
    ],
  },
  {
    heading: 'Privacy Policy:',
    points: [
      '1. Data Collection: We gather personal info like name, email, and location to manage campaigns and improve services.',
      '2. Data Use: Your data helps with account management, analytics, and service delivery.',
      '3. Security: We implement strong security measures to protect your data from unauthorized access.',
      '4. Data Sharing: Personal data is not shared with third parties without your consent, except as legally required.',
      '5. Your Rights: You can access, update, or delete your data anytime through app settings or by contacting support.',
    ],
  },
  {
    heading: 'Campaign Module:',
    points: [
      '1. Brands create and submit campaign briefs.',
      '2. Creators discover campaigns and apply within 48 hours.',
      '3. Brands review applicants and select creators.',
      '4. Funds are held in escrow before notifying creators.',
      '5. Creators have 3 to 5 days to create and submit content.',
      '6. Brands review content with a strict single revision policy.',
      '7. Creators submit proof of posting for verification.',
    ],
  },
];

export default function TermsModal({ onAgree, onClose }: TermsModalProps) {
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-2xl w-full max-w-[480px] flex flex-col max-h-[85vh] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              Terms &amp; Conditions and Privacy Policy
            </h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f4f3f8] transition-colors text-[#7a7a9a] hover:text-[#1a1a2e]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-4">
            {TERMS_CONTENT.map((section) => (
              <div key={section.heading} className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-[#1a1a2e]">{section.heading}</p>
                {section.points.map((point) => (
                  <p key={point} className="text-sm font-light text-[#4a4a6a] leading-relaxed">
                    {point}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Agree button */}
          <div className="px-6 pb-6 pt-3 shrink-0">
            <button
              onClick={onAgree}
              className="w-full py-3.5 cursor-pointer bg-brand-pink text-white text-sm font-medium rounded-xl hover:bg-brand-pink/90 transition-colors"
            >
              Agree
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
