'use client';
import { X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[500px] p-0 flex flex-col overflow-hidden"
        // style={{
        //   position: 'fixed',
        //   left: '50%',
        //   top: '50%',
        //   transform: 'translate(-50%, -50%)',
        //   maxHeight: '80vh',
        // }}
      >
        <DialogHeader className="px-6 py-5 shrink-0 border-b border-[#f0eef8]">
          <div className="flex items-center justify-between">
            <DialogTitle className="">Terms & Conditions and Privacy Policy.</DialogTitle>{' '}
            <DialogPrimitive.Close className="rounded-sm border border-brand-pink text-brand-pink cursor-pointer  opacity-70 mt-4 transition-opacity">
              <X size={18} />
            </DialogPrimitive.Close>
          </div>
        </DialogHeader>
        <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-[#5a5a7a] leading-relaxed space-y-4">
          <div>
            <p>
              <span className="font-bold text-brand-pink">Acceptance:</span> By using Trendupp, you
              agree to follow all terms and conditions outlined here.
            </p>
            <p>
              <span className="font-bold text-brand-pink">Usage:</span> Trendupp is for personal and
              professional influencer marketing use only; commercial use without permission is
              prohibited.
            </p>
            <p>
              <span className="font-bold text-brand-pink my-1">Account Security:</span> You are
              responsible for safeguarding your account and all activities under it.
            </p>
          </div>

          <p>
            <span className="font-bold text-brand-pink my-1">Content Rules:</span> Do not upload
            content that infringes on copyrights, privacy rights, or violates laws.
          </p>

          <p>
            <span className="font-bold text-brand-pink my-1">Terms Updates:</span> Trendupp may
            update these terms anytime and will notify you via the app or email.
          </p>

          <div>
            <p className="font-bold text-brand-pink my-1">Privacy Policy:</p>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '1.25rem' }}>
              <li>
                <span className="font-medium text-[#1a1a2e]">Data Collection:</span> We gather
                personal info like name, email, and location to manage campaigns and improve
                services.
              </li>
              <li>
                <span className="font-medium text-[#1a1a2e]">Data Use:</span> Your data helps with
                account management, analytics, and service delivery.
              </li>
              <li>
                <span className="font-medium text-[#1a1a2e]">Security:</span> We implement strong
                security measures to protect your data from unauthorized access.
              </li>
            </ol>
          </div>

          <p>
            <span className="font-bold text-brand-pink">Data Sharing:</span> Personal data is not
            shared with third parties without your consent, except as legally required.
          </p>

          <p>
            <span className="font-bold text-brand-pink">Your Rights:</span> You can access, update,
            or delete your data anytime through app settings or by contacting support.
          </p>

          <div>
            <p className="font-medium text-brand-pink mt-2">Campaign Module:</p>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '1.25rem' }}>
              <li>Brands create and submit campaign briefs.</li>
              <li>Creators discover campaigns and apply within 48 hours.</li>
              <li>Brands review applicants and select creators.</li>
              <li>Funds are held in escrow before notifying creators.</li>
              <li>Creators have 3–5 days to create and submit content.</li>
              <li>Brands review content with a strict single revision policy.</li>
              <li>Creators submit proof of posting for verification.</li>
            </ol>
          </div>
          <p className="mt-4 text-red-500">
            PLEASE ENSURE TO TICK THE TERMS AND CONDITIONS BEFORE SIGN UP
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
