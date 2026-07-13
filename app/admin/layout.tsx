'use client';

import StreamChatProvider from '@/lib/providers/StreamChatProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <StreamChatProvider>{children}</StreamChatProvider>;
}
