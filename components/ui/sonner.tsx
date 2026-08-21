'use client';

import { useTheme } from 'next-themes';
import { toast, Toaster as Sonner, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

// Error toasts tend to carry more to read than a quick "Saved!", so give
// them longer on screen than Sonner's 4s default. `toast` is a shared
// singleton (every `import { toast } from 'sonner'` across the app gets
// this same object), so patching `.error` here — where the Toaster is
// already configured — applies everywhere without touching every call site.
const ERROR_TOAST_DURATION = 6000;
type ErrorArgs = Parameters<typeof toast.error>;
const originalError = toast.error;
toast.error = (message: ErrorArgs[0], data?: ErrorArgs[1]) =>
  originalError(message, { duration: ERROR_TOAST_DURATION, ...data });

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
