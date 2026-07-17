'use client';

import { useEffect } from 'react';
import { X, Eye, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Portal } from '@/components/ui/portal';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsDrawer({ isOpen, onClose }: AnalyticsDrawerProps) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const stats = [
    {
      label: 'Profile Views',
      amount: '3241',
      color: 'pink',
      bg: 'bg-[#fdf2f6]',
      text: 'text-brand-pink',
      icon: <Eye size={18} />,
    },
    {
      label: 'Post view',
      amount: '9',
      color: 'pink',
      bg: 'bg-[#fdf2f6]',
      text: 'text-brand-pink',
      icon: <Eye size={18} />,
    },
    {
      label: 'Avg. Engagement',
      amount: '6.8%',
      color: 'blue',
      bg: 'bg-[#edf2fe]',
      text: 'text-[#2f63eb]',
      icon: <Users size={18} />,
    },
    {
      label: 'Total money earned',
      amount: '₦847,000',
      color: 'yellow',
      bg: 'bg-[#fef9e7]',
      text: 'text-[#ca8a04]',
      icon: <span className="font-bold text-base">₦</span>,
    },
  ];

  const chartData = [
    { month: 'Jan', height: 'h-[24px]', active: false },
    { month: 'Feb', height: 'h-[44px]', active: false },
    { month: 'Mar', height: 'h-[34px]', active: false },
    { month: 'Apr', height: 'h-[58px]', active: false },
    { month: 'May', height: 'h-[74px]', active: false },
    { month: 'Jun', height: 'h-[105px]', active: true },
  ];

  return (
    <Portal>
      <div
        className={cn(
          'fixed inset-0 z-50 flex justify-end transition-opacity duration-300 select-none',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-all"
          onClick={onClose}
        />

        {/* Slide-out Panel */}
        <div
          className={cn(
            'w-full max-w-[550px] h-full bg-white relative z-10 flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-out border-0 border-none',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}
          style={{ border: 'none' }}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-4 shrink-0">
            <h3 className="text-xl font-bold text-[#1a1a2e]">Analytics</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f4f3f6] transition-colors text-[#5a5a7a] focus:outline-none cursor-pointer"
              aria-label="Close analytics"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto mt-6 flex flex-col gap-6 pr-1 pb-6 scrollbar-hide">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-[#f4f3f6]/45 border border-[#e8e6f0]/30 rounded-[28px] p-5 flex flex-col justify-between h-[120px] relative"
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center font-bold bg-white shadow-sm shrink-0',
                      stat.text,
                    )}
                  >
                    {stat.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 mt-3">
                    <span className="text-lg sm:text-xl font-bold text-[#1a1a2e] tracking-tight">
                      {stat.amount}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#7a7a9a] font-light">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Earnings Trend Chart */}
            <div className="bg-white border border-[#e8e6f0]/60 rounded-[28px] p-5 flex flex-col gap-4">
              <h4 className="text-xs sm:text-sm font-bold text-[#1a1a2e] tracking-tight">
                Earnings Trend
              </h4>

              {/* Bars container */}
              <div className="flex justify-between items-end h-[140px] px-2 sm:px-4 pb-2 border-b border-[#e8e6f0]/20">
                {chartData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2.5 flex-1">
                    <div
                      className={cn(
                        'w-7 sm:w-8 rounded-lg transition-all duration-300',
                        data.active
                          ? 'bg-brand-pink shadow-[0_4px_12px_rgba(215,23,111,0.2)]'
                          : 'bg-brand-pink/10',
                        data.height,
                      )}
                    />
                    <span className="text-[10px] text-[#9a99b0] font-light">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats Stack */}
            <div className="flex flex-col gap-4">
              {/* Instagram */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-[28px] p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f9ce71] via-[#e85f65] to-[#bc2a8d] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#1a1a2e]">Instagram</span>
                  </div>
                  <span className="text-sm font-bold text-brand-pink">72.4K</span>
                </div>
                <div className="w-full bg-[#f4f3f6] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-pink h-full rounded-full" style={{ width: '38%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f4f3f6]/30 border border-[#e8e6f0]/25 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#9a99b0] font-light">Eng. Rate</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">7.2%</span>
                  </div>
                  <div className="bg-[#f4f3f6]/30 border border-[#e8e6f0]/25 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#9a99b0] font-light">Avg. Reach</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">140K</span>
                  </div>
                </div>
              </div>

              {/* TikTok */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-[28px] p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shrink-0 shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.72-.49-.44-.9-.97-1.24-1.55v7.27c.05 4.13-2.87 7.83-6.94 8.5-4.43.9-8.77-1.89-9.52-6.3-.95-4.9 2.5-9.67 7.4-10.05v4.03c-2.3.26-4.14 2.27-3.99 4.58.17 2.09 1.94 3.75 4.05 3.65 2.1-.02 3.8-1.74 3.83-3.84-.01-4.72-.01-9.44-.01-14.16.03-.23.11-.47.22-.68z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#1a1a2e]">TikTok</span>
                  </div>
                  <span className="text-sm font-bold text-brand-pink">31.2K</span>
                </div>
                <div className="w-full bg-[#f4f3f6] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-pink h-full rounded-full" style={{ width: '22%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f4f3f6]/30 border border-[#e8e6f0]/25 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#9a99b0] font-light">Eng. Rate</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">7.2%</span>
                  </div>
                  <div className="bg-[#f4f3f6]/30 border border-[#e8e6f0]/25 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#9a99b0] font-light">Avg. Reach</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">140K</span>
                  </div>
                </div>
              </div>

              {/* YouTube */}
              <div className="bg-white border border-[#e8e6f0]/60 rounded-[28px] p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#ff0000] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current">
                        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#1a1a2e]">YouTube</span>
                  </div>
                  <span className="text-sm font-bold text-brand-pink">8.9K</span>
                </div>
                <div className="w-full bg-[#f4f3f6] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-pink h-full rounded-full" style={{ width: '12%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f4f3f6]/30 border border-[#e8e6f0]/25 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#9a99b0] font-light">Eng. Rate</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">7.2%</span>
                  </div>
                  <div className="bg-[#f4f3f6]/30 border border-[#e8e6f0]/25 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#9a99b0] font-light">Avg. Reach</span>
                    <span className="text-xs font-bold text-[#1a1a2e]">140K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
