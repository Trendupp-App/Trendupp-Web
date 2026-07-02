// 'use client';

// import { useAuthStore } from '@/store/authStore';

// const PLATFORMS = [
//   {
//     id: 'instagram',
//     name: 'Instagram',
//     connectedKey: 'instagram' as const,
//     icon: (
//       <svg
//         viewBox="0 0 24 24"
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth={1.5}
//       >
//         <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//         <circle cx="12" cy="12" r="4" />
//         <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
//       </svg>
//     ),
//   },
//   {
//     id: 'youtube',
//     name: 'YouTube',
//     connectedKey: 'youtube' as const,
//     icon: (
//       <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
//         <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
//         <polygon points="10,8 10,16 17,12" fill="white" />
//       </svg>
//     ),
//   },
//   {
//     id: 'tiktok',
//     name: 'TikTok',
//     connectedKey: 'tiktok' as const,
//     icon: (
//       <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
//         <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z" />
//       </svg>
//     ),
//   },
//   {
//     id: 'twitter',
//     name: 'X (Twitter)',
//     connectedKey: 'twitter' as const,
//     icon: (
//       <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
//         <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//       </svg>
//     ),
//   },
// ];

// export default function SocialPlatformCards() {
//   const user = useAuthStore((s) => s.user);
//   const socials = user?.socialsConnected;

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//       {PLATFORMS.map((p) => {
//         const isConnected = socials?.[p.connectedKey] ?? false;
//         return (
//           <div
//             key={p.id}
//             className="bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 flex items-center gap-3"
//           >
//             <div className="w-8 h-8 rounded-full bg-[#f5f3fb] flex items-center justify-center shrink-0 text-[#1a1a2e]">
//               {p.icon}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="text-xs font-semibold text-[#1a1a2e] truncate">{p.name}</p>
//               <p className={`text-[10px] ${isConnected ? 'text-emerald-500' : 'text-[#9a99b0]'}`}>
//                 {isConnected ? 'Connected' : 'Not connected'}
//               </p>
//             </div>
//             <div
//               className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-[#e8e6f0]'}`}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// }
'use client';

import { useAuthStore } from '@/store/authStore';

const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    connectedKey: 'instagram' as const,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    connectedKey: 'youtube' as const,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
        <polygon points="10,8 10,16 17,12" fill="white" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    connectedKey: 'tiktok' as const,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    connectedKey: 'twitter' as const,
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function SocialPlatformCards() {
  const user = useAuthStore((s) => s.user);
  const socials = user?.socialsConnected;

  const connectedPlatforms = PLATFORMS.filter((p) => socials?.[p.connectedKey]);

  if (connectedPlatforms.length === 0) {
    return <p className="text-xs text-[#9a99b0] px-1">No social accounts connected yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {connectedPlatforms.map((p) => (
        <div
          key={p.id}
          className="bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-[#f5f3fb] flex items-center justify-center shrink-0 text-[#1a1a2e]">
            {p.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#1a1a2e] truncate">{p.name}</p>
            <p className="text-[10px] text-emerald-500">Connected</p>
          </div>
          <div className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
        </div>
      ))}
    </div>
  );
}
