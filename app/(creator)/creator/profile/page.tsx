'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Star,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Check,
  ArrowRight,
  Award,
  Search,
  ChevronLeft,
  Info,
  Wallet,
  Bell,
  Shield,
  BarChart2,
  HelpCircle,
  ChevronRight,
  Mail,
  Camera,
  ChevronDown,
  X,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
  TrendingUp,
  RotateCw,
  Users,
  Phone,
  FileText,
  UploadCloud,
  Inbox,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ALL_NICHES_INDUSTRIES } from '@/constants/common';
import { useAuthStore } from '@/store/authStore';
import { useCountries, useNationalities, useStates, useNiches } from '@/hooks/useOnboardingQueries';
import {
  useUpdatePersonalInfo,
  useUpdateProfileNiches,
  useUpdateProfileSocials,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useSecuritySettings,
  useUpdateSecuritySettings,
  useChangePassword,
  useDeactivateAccount,
  useSupportTicketCategories,
  useSupportTickets,
  useSubmitSupportTicket,
  type SupportTicket,
} from '@/hooks/useProfile';

// ── TYPES & INTERFACES ───────────────────────────────────
interface Platform {
  name: string;
  handle: string;
  followers: string;
  icon: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  connected: boolean;
}

interface PortfolioItem {
  id: number;
  image: string;
  brandName: string;
}

interface CreatorReview {
  id: number;
  brandName: string;
  logoText: string;
  logoBg: string;
  date: string;
  rating: number;
  text: string;
}

interface CreatorProfile {
  name: string;
  handle: string;
  tier: string;
  rating: number;
  campaignCount: number;
  image: string;
  location: string;
  reach: string;
  earned: string;
  bio: string;
  niches: string[];
  badge: string;
  platforms: Platform[];
  email?: string;
  nationality?: string;
}

// ── PLATFORM ICONS ───────────────────────────────────────
function InstagramIcon() {
  return (
    <div
      className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
      style={{
        background:
          'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    </div>
  );
}

function TikTokIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-black shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
      </svg>
    </div>
  );
}

function YouTubeIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-[#FF0000] shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </div>
  );
}

function TwitterIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 focus:outline-none select-none',
        checked ? 'bg-brand-pink' : 'bg-[#e2e0e7]',
      )}
    >
      <span
        className={cn(
          'w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform duration-200 ease-in-out shadow-xs',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
}

function PlatformIcon({ icon }: { icon: Platform['icon'] }) {
  if (icon === 'instagram') return <InstagramIcon />;
  if (icon === 'tiktok') return <TikTokIcon />;
  if (icon === 'youtube') return <YouTubeIcon />;
  return <TwitterIcon />;
}

function getPlatformConfirmIcon(name: string) {
  if (name === 'Instagram') {
    return (
      <div
        className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center"
        style={{
          background:
            'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-5.5 h-5.5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      </div>
    );
  }
  if (name === 'TikTok') {
    return (
      <div className="w-12 h-12 rounded-full bg-black shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
        </svg>
      </div>
    );
  }
  if (name === 'YouTube') {
    return (
      <div className="w-12 h-12 rounded-full bg-[#FF0000] shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-5.5 h-5.5">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-[#1a1a2e] shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

function getPlatformConfirmData(name: string) {
  const dataMap: Record<string, { subtitle: string; reqLinkText: string; bullets: string[] }> = {
    Instagram: {
      subtitle: 'Connect your Instagram accounts',
      reqLinkText: "Instagram's connection requirement",
      bullets: [
        'My Instagram account is linked to a Facebook page',
        'I have a business or creator Instagram account',
      ],
    },
    TikTok: {
      subtitle: 'Connect your TikTok account',
      reqLinkText: "TikTok's connection requirement",
      bullets: [
        'My TikTok account is set to public',
        'I have a creator or business TikTok account',
      ],
    },
    YouTube: {
      subtitle: 'Connect your YouTube channel',
      reqLinkText: "YouTube's connection requirement",
      bullets: ['My YouTube channel is verified', 'I have at least one public video'],
    },
    'X (Twitter)': {
      subtitle: 'Connect your X / Twitter account',
      reqLinkText: "X / Twitter's connection requirement",
      bullets: [
        'My X / Twitter account is public',
        'My account profile is complete with a bio and avatar',
      ],
    },
  };
  return (
    dataMap[name] || {
      subtitle: `Connect your ${name} account`,
      reqLinkText: `${name}'s connection requirement`,
      bullets: [
        `My ${name} account meets connection requirements`,
        `My account is public and active`,
      ],
    }
  );
}

// ── PRESETS FOR PORTFOLIO ────────────────────────────────
const PORTFOLIO_PRESETS = [
  {
    name: 'Zara (Fashion)',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Tara (Beauty)',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Techno (Mobile)',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Monster (Sports)',
    url: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Zara (Lifestyle)',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Audiomack (Music)',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
  },
];

// ── MOCK DATA SEED ───────────────────────────────────────
const INITIAL_PROFILE: CreatorProfile = {
  name: 'Teni Olu',
  handle: 'teniolu',
  tier: 'Micro Creator',
  rating: 4.9,
  campaignCount: 14,
  image:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  location: 'Lagos, Nigeria',
  reach: '72.4K',
  earned: '₦847K',
  bio: 'Fashion & lifestyle creator based in Lagos 🌟 | Helping brands tell authentic stories through style.',
  niches: ['Fashion', 'Lifestyle', 'Beauty'],
  badge: 'Impact Advocate',
  email: 'teniolu@gmail.com',
  nationality: 'Nigeria',
  platforms: [
    {
      name: 'Instagram',
      handle: 'teniolu',
      followers: '72.4K',
      icon: 'instagram',
      connected: true,
    },
    {
      name: 'YouTube',
      handle: 'teniolu.vlogs',
      followers: '8.9K',
      icon: 'youtube',
      connected: true,
    },
    {
      name: 'TikTok',
      handle: 'teniolu.creates',
      followers: '31.2K',
      icon: 'tiktok',
      connected: true,
    },
    {
      name: 'X (Twitter)',
      handle: 'teniolu',
      followers: 'Not connected',
      icon: 'twitter',
      connected: false,
    },
  ],
};

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    brandName: 'Zara',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
    brandName: 'Tara',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    brandName: 'Techno',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=400&q=80',
    brandName: 'Monster',
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
    brandName: 'Zara',
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    brandName: 'Audiomack',
  },
];

const MOCK_REVIEWS: CreatorReview[] = [
  {
    id: 1,
    brandName: 'Zara Africa',
    logoText: 'ZA',
    logoBg: 'bg-[#00c288]',
    date: 'May 2025',
    rating: 5,
    text: 'Teni delivered outstanding content that exceeded expectations. Professional, creative, and on time. Would work with again.',
  },
  {
    id: 2,
    brandName: 'Tecno Mobile',
    logoText: 'TM',
    logoBg: 'bg-[#7c3aed]',
    date: 'Apr 2025',
    rating: 5,
    text: 'Excellent content quality with great audience engagement. Would definitely collaborate again.',
  },
  {
    id: 3,
    brandName: 'Nestlé Nigeria',
    logoText: 'NN',
    logoBg: 'bg-[#f59e0b]',
    date: 'Mar 2025',
    rating: 4,
    text: 'Good content creation. Minor revisions needed but the final result was great quality.',
  },
];

interface ReviewBrand {
  id: number;
  name: string;
  industry: string;
  campaigns: number;
  followers: string;
  logo: string;
}

const MOCK_BRANDS: ReviewBrand[] = [
  {
    id: 1,
    name: 'Zara Africa',
    industry: 'Fashion',
    campaigns: 5,
    followers: '2.1M',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    name: 'Tecno Mobile',
    industry: 'Tech',
    campaigns: 12,
    followers: '890K',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    name: 'Nestlé Nigeria',
    industry: 'Food',
    campaigns: 8,
    followers: '540K',
    logo: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 4,
    name: 'Audiomack Africa',
    industry: 'Music',
    campaigns: 3,
    followers: '1.5M',
    logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 5,
    name: 'Monster Energy NG',
    industry: 'Sports',
    campaigns: 4,
    followers: '280K',
    logo: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 6,
    name: 'GTBank',
    industry: 'Finance',
    campaigns: 9,
    followers: '3.2M',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80',
  },
];

const MOCK_FAQS = [
  {
    q: 'How does escrow payment work?',
    a: 'When a brand approves your application, the campaign budget is locked in escrow. Funds are released to your wallet within 48 hours after you submit your content deliverables and the brand confirms receipt. You can withdraw payment on or after 30 days.',
  },
  {
    q: 'How long does profile verification take?',
    a: 'Profile verification typically takes between 24 to 48 hours. Our team reviews your connected social channels, engagement rates, and content quality to verify authenticity before approving your profile.',
  },
  {
    q: 'Can I apply for multiple campaigns?',
    a: 'Yes, you can apply for multiple campaigns simultaneously. However, we recommend only applying to campaigns that align well with your niche and target audience to maintain high engagement.',
  },
  {
    q: "What happens if a brand doesn't approve my work?",
    a: "If a brand has feedback or requests revisions, they will outline the changes needed. If there's an unresolved dispute, Trendupp's support team will step in as an arbitrator to review according to the campaign requirements.",
  },
  {
    q: 'How do I withdraw my earnings?',
    a: 'Once funds are cleared and available in your wallet, you can request a withdrawal directly to your linked bank account. Bank transfers are usually processed within 1-3 business days.',
  },
  {
    q: 'What creator tiers are available?',
    a: 'Trendupp features multiple creator tiers based on your follower count and engagement: Micro (1K-10K), Mid-tier (10K-100K), Macro (100K-1M), and Mega/Celebrity (1M+). Higher tiers unlock exclusive campaign opportunities.',
  },
];

function parseFollowersCount(val: string | number): number {
  if (typeof val === 'number') return val;
  if (!val || val === 'Not connected') return 0;
  const numStr = val.toUpperCase().replace('N/A', '').trim();
  let multiplier = 1;
  let parsed = numStr;
  if (numStr.endsWith('K')) {
    multiplier = 1000;
    parsed = numStr.slice(0, -1);
  } else if (numStr.endsWith('M')) {
    multiplier = 1000000;
    parsed = numStr.slice(0, -1);
  }
  const num = parseFloat(parsed);
  return isNaN(num) ? 0 : Math.round(num * multiplier);
}

export default function CreatorProfilePage() {
  // Queries & Mutations
  const { user } = useAuthStore();
  const { data: countries } = useCountries();
  const { data: nationalities } = useNationalities();

  // States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<CreatorProfile>(() => {
    if (user) {
      return {
        ...INITIAL_PROFILE,
        name: `${user.firstName} ${user.lastName}`.trim(),
        handle: user.username || '',
        email: user.email,
        bio: user.bio || '',
        image: user.avatarUrl || INITIAL_PROFILE.image,
        niches:
          user.niches && user.niches.length > 0
            ? user.niches.map((n) => n.name)
            : INITIAL_PROFILE.niches,
        // Match connected platforms from user.socialsConnected
        platforms: INITIAL_PROFILE.platforms.map((plat) => {
          const key = plat.name.toLowerCase() as keyof typeof user.socialsConnected;
          const isConnected = user.socialsConnected ? !!user.socialsConnected[key] : false;
          return {
            ...plat,
            connected: isConnected,
            handle: isConnected ? user.username || '' : '',
          };
        }),
      };
    }
    return INITIAL_PROFILE;
  });

  // Find country ID by name to load state list
  const currentCountryObj = countries?.find(
    (c) => c.name.toLowerCase() === profile.location.split(',')[1]?.trim().toLowerCase(),
  );
  const currentCountryId = currentCountryObj?.id;

  const { data: states } = useStates(currentCountryId);
  const { data: allNiches } = useNiches();
  const updatePersonalInfoMutation = useUpdatePersonalInfo();
  const updateNichesMutation = useUpdateProfileNiches();
  const updateSocialsMutation = useUpdateProfileSocials();

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'settings'>('portfolio');
  type Drawer = 'edit' | 'notifications' | 'privacy' | 'analytics' | 'help' | null;
  const [activeDrawer, setActiveDrawer] = useState<Drawer>(null);
  const isNotificationsOpen = activeDrawer === 'notifications';

  // Notification Preferences States
  const [notiNewCampaigns, setNotiNewCampaigns] = useState(true);
  const [notiAppUpdates, setNotiAppUpdates] = useState(true);
  const [notiPaymentAlerts, setNotiPaymentAlerts] = useState(true);
  const [notiBrandMessages, setNotiBrandMessages] = useState(true);
  const [notiPush, setNotiPush] = useState(true);
  const [notiEmail, setNotiEmail] = useState(true);
  const [notiWeeklySummary, setNotiWeeklySummary] = useState(false);
  const [notiMarketingOffers, setNotiMarketingOffers] = useState(false);

  const { data: serverNotiSettings } = useNotificationSettings(activeDrawer === 'notifications');
  const updateNotiSettingsMutation = useUpdateNotificationSettings();

  // Load notification settings from the server
  useEffect(() => {
    if (serverNotiSettings) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setNotiNewCampaigns(!!serverNotiSettings.newCampaigns);
      setNotiAppUpdates(!!serverNotiSettings.applicationUpdates);
      setNotiPaymentAlerts(!!serverNotiSettings.paymentAlerts);
      setNotiBrandMessages(!!serverNotiSettings.brandMessages);
      setNotiPush(!!serverNotiSettings.pushNotifications);
      setNotiEmail(!!serverNotiSettings.emailNotifications);
      setNotiWeeklySummary(!!serverNotiSettings.weeklySummary);
      setNotiMarketingOffers(!!serverNotiSettings.marketingOffers);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [serverNotiSettings]);

  // Privacy & Security States
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false); // will be derived from activeDrawer
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const { data: serverSecuritySettings } = useSecuritySettings(isPrivacyOpen);
  const updateSecuritySettingsMutation = useUpdateSecuritySettings();
  const changePasswordMutation = useChangePassword();
  const deactivateMutation = useDeactivateAccount();

  // Load security settings from the server
  useEffect(() => {
    if (serverSecuritySettings) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setTwoFactorAuth(!!serverSecuritySettings.twoFactorEnabled);
      setBiometricLogin(!!serverSecuritySettings.biometricLoginEnabled);
      setLoginAlerts(!!serverSecuritySettings.loginAlertsEnabled);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [serverSecuritySettings]);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Analytics States
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [animateChart, setAnimateChart] = useState(false);

  // Help & Support States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpSearchQuery, setHelpSearchQuery] = useState('');
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [helpStep, setHelpStep] = useState<'main' | 'ticket' | 'my-tickets'>('main');
  const [ticketCategory, setTicketCategory] = useState('Select a category');
  const [ticketCategoryId, setTicketCategoryId] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const { data: serverCategories } = useSupportTicketCategories(isHelpOpen);
  const { data: myTickets, isLoading: ticketsLoading } = useSupportTickets(
    isHelpOpen && helpStep === 'my-tickets',
  );
  const submitTicketMutation = useSubmitSupportTicket();
  // Action: Handle ticket attachments file selector change (store File objects)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Enforce a max of 5 files and 10MB per file
      const filtered = filesArray.filter((file) => file.size <= 10 * 1024 * 1024);
      setUploadedFiles((prev) => {
        const combined = [...prev, ...filtered];
        const unique = combined.reduce<File[]>((acc, cur) => {
          if (!acc.find((f) => f.name === cur.name && f.size === cur.size)) acc.push(cur);
          return acc;
        }, []);
        return unique.slice(0, 5); // limit to 5 files
      });
    }
  };

  // Prevent background scrolling when Edit Profile, Notifications, Privacy, Analytics, or Help drawer is open
  useEffect(() => {
    const isAnyOpen =
      activeDrawer || isEditProfileOpen || isPrivacyOpen || isAnalyticsOpen || isHelpOpen;
    if (isAnyOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeDrawer, isEditProfileOpen, isPrivacyOpen, isAnalyticsOpen, isHelpOpen]);

  // Micro-animation trigger for Earnings Trend chart
  useEffect(() => {
    if (isAnalyticsOpen) {
      const timer = setTimeout(() => setAnimateChart(true), 150);
      return () => {
        clearTimeout(timer);
        setAnimateChart(false);
      };
    }
  }, [isAnalyticsOpen]);

  // Request Review Modal States
  const [isRequestReviewOpen, setIsRequestReviewOpen] = useState(false);
  const [requestStep, setRequestStep] = useState<'select' | 'message'>('select');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [personalMessage, setPersonalMessage] = useState('');
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  const selectedBrand = MOCK_BRANDS.find((brand) => brand.id === selectedBrandId);
  const filteredBrands = MOCK_BRANDS.filter(
    (brand) =>
      brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase()) ||
      brand.industry.toLowerCase().includes(brandSearchQuery.toLowerCase()),
  );

  const filteredFaqs = MOCK_FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(helpSearchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(helpSearchQuery.toLowerCase()),
  );

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Settings Edit State (Temporary Form Buffer)
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editHandle, setEditHandle] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string>('');
  const [editCountry, setEditCountry] = useState('Nigeria');
  const [editState, setEditState] = useState('Lagos');
  const [editNationality, setEditNationality] = useState('Nigeria');
  const [editBio, setEditBio] = useState('');
  const [editNiches, setEditNiches] = useState<string[]>([]);
  const [editPlatforms, setEditPlatforms] = useState<Platform[]>([]);
  const [editTab, setEditTab] = useState<'personal' | 'niche' | 'social'>('personal');
  const [confirmingPlatform, setConfirmingPlatform] = useState<Platform | null>(null);

  // Action: Toggle Connected Platform
  const handleTogglePlatform = (idx: number) => {
    const platform = editPlatforms[idx];
    if (!platform.connected) {
      setConfirmingPlatform(platform);
    } else {
      const updated = editPlatforms.map((plat, i) =>
        i === idx ? { ...plat, connected: false, followers: 'Not connected' } : plat,
      );
      setEditPlatforms(updated);
    }
  };

  // Action: Confirm Social Connection
  const handleConfirmConnectPlatform = () => {
    if (!confirmingPlatform) return;
    const updated = editPlatforms.map((plat) => {
      if (plat.name === confirmingPlatform.name) {
        return {
          ...plat,
          connected: true,
          followers:
            plat.name === 'Instagram'
              ? '12.4K'
              : plat.name === 'TikTok'
                ? '31.2K'
                : plat.name === 'YouTube'
                  ? '8.9K'
                  : '5.0K',
        };
      }
      return plat;
    });
    setEditPlatforms(updated);
    setConfirmingPlatform(null);
  };

  // Action: Open Edit Profile Form Modal/Overlay
  const handleOpenEditProfile = () => {
    const nameParts = profile.name.split(' ');
    setEditFirstName(nameParts[0] || '');
    setEditLastName(nameParts.slice(1).join(' ') || '');
    setEditHandle(profile.handle);
    setEditEmail(profile.email || 'teniolu@gmail.com');

    // Parse location
    const locParts = profile.location.split(',').map((s) => s.trim());
    setEditState(locParts[0] || 'Lagos');
    setEditCountry(locParts[1] || 'Nigeria');
    setEditNationality(profile.nationality || 'Nigeria');

    setEditBio(profile.bio);
    setEditNiches(profile.niches);
    setEditPlatforms(profile.platforms);
    setEditTab('personal');
    setConfirmingPlatform(null);
    setEditAvatarFile(null);
    setEditAvatarPreview(profile.image);
    setIsEditProfileOpen(true);
  };

  // Action: Save Profile Settings
  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (editTab === 'niche') {
      const nicheIds = editNiches
        .map((name) => allNiches?.find((n) => n.name.toLowerCase() === name.toLowerCase())?.id)
        .filter(Boolean) as string[];

      updateNichesMutation.mutate(
        { nicheIds },
        {
          onSuccess: ({ data }) => {
            const u = data?.user;
            setProfile((prev) => ({
              ...prev,
              niches: u.niches.map((n) => n.name),
            }));
            setIsEditProfileOpen(false);
          },
        },
      );
      return;
    }

    if (editTab === 'social') {
      const instagramPlat = editPlatforms.find((p) => p.name === 'Instagram');
      const tiktokPlat = editPlatforms.find((p) => p.name === 'TikTok');
      const youtubePlat = editPlatforms.find((p) => p.name === 'YouTube');
      const twitterPlat = editPlatforms.find((p) => p.name === 'X (Twitter)');

      const payload = {
        instagramUsername: instagramPlat?.connected
          ? instagramPlat.handle === 'Not connected'
            ? editHandle
            : instagramPlat.handle
          : null,
        instagramFollowers: instagramPlat?.connected
          ? parseFollowersCount(instagramPlat.followers)
          : 0,
        tiktokUsername: tiktokPlat?.connected
          ? tiktokPlat.handle === 'Not connected'
            ? editHandle
            : tiktokPlat.handle
          : null,
        tiktokFollowers: tiktokPlat?.connected ? parseFollowersCount(tiktokPlat.followers) : 0,
        youtubeUsername: youtubePlat?.connected
          ? youtubePlat.handle === 'Not connected'
            ? editHandle
            : youtubePlat.handle
          : null,
        youtubeFollowers: youtubePlat?.connected ? parseFollowersCount(youtubePlat.followers) : 0,
        twitterUsername: twitterPlat?.connected
          ? twitterPlat.handle === 'Not connected'
            ? editHandle
            : twitterPlat.handle
          : null,
        twitterFollowers: twitterPlat?.connected ? parseFollowersCount(twitterPlat.followers) : 0,
      };

      updateSocialsMutation.mutate(payload, {
        onSuccess: ({ data }) => {
          const u = data?.user;
          setProfile((prev) => ({
            ...prev,
            platforms: prev.platforms.map((plat) => {
              const name = plat.name;
              if (name === 'Instagram') {
                return {
                  ...plat,
                  connected: !!u.socialsConnected.instagram,
                  handle: u.instagramUsername || 'Not connected',
                  followers: u.instagramFollowers ? `${u.instagramFollowers}` : 'Not connected',
                };
              }
              if (name === 'TikTok') {
                return {
                  ...plat,
                  connected: !!u.socialsConnected.tiktok,
                  handle: u.tiktokUsername || 'Not connected',
                  followers: u.tiktokFollowers ? `${u.tiktokFollowers}` : 'Not connected',
                };
              }
              if (name === 'YouTube') {
                return {
                  ...plat,
                  connected: !!u.socialsConnected.youtube,
                  handle: u.youtubeUsername || 'Not connected',
                  followers: u.youtubeFollowers ? `${u.youtubeFollowers}` : 'Not connected',
                };
              }
              if (name === 'X (Twitter)') {
                return {
                  ...plat,
                  connected: !!u.socialsConnected.twitter,
                  handle: u.twitterUsername || 'Not connected',
                  followers: u.twitterFollowers ? `${u.twitterFollowers}` : 'Not connected',
                };
              }
              return plat;
            }),
          }));
          setIsEditProfileOpen(false);
        },
      });
      return;
    }

    // Look up country, nationality and state IDs by name
    const countryObj = countries?.find(
      (c) => c.name.toLowerCase() === editCountry.trim().toLowerCase(),
    );
    const countryId = countryObj?.id || '';

    const nationalityObj = nationalities?.find(
      (n) => n.name.toLowerCase() === editNationality.trim().toLowerCase(),
    );
    const nationalityId = nationalityObj?.id || '';

    const stateObj = states?.find((s) => s.name.toLowerCase() === editState.trim().toLowerCase());
    const stateId = stateObj?.id || '';

    const formData = new FormData();
    formData.append('firstName', editFirstName.trim());
    formData.append('lastName', editLastName.trim());
    formData.append('username', editHandle.trim());
    formData.append('email', editEmail.trim());
    formData.append('bio', editBio);
    if (nationalityId) formData.append('nationalityId', nationalityId);
    if (countryId) formData.append('countryId', countryId);
    if (stateId) formData.append('stateId', stateId);

    if (editAvatarFile) {
      formData.append('avatar', editAvatarFile);
    }

    updatePersonalInfoMutation.mutate(formData, {
      onSuccess: ({ data }) => {
        const u = data?.user;
        setProfile((prev) => ({
          ...prev,
          name: `${u.firstName} ${u.lastName}`.trim(),
          handle: u.username || '',
          email: u.email,
          bio: u.bio || '',
          image: u.avatarUrl || prev.image,
        }));
        setIsEditProfileOpen(false);
      },
    });
  };

  // Action: Reset Settings Form / Close
  const handleCancelSettings = () => {
    setIsEditProfileOpen(false);
  };

  // Action: Add Portfolio Item
  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    let finalImageUrl = '';

    if (uploadedFile) {
      finalImageUrl = URL.createObjectURL(uploadedFile);
    } else if (socialMediaLink.trim()) {
      // Use a random preset image so a beautiful preview is displayed
      const randomPreset = PORTFOLIO_PRESETS[Math.floor(Math.random() * PORTFOLIO_PRESETS.length)];
      finalImageUrl = randomPreset.url;
    } else {
      finalImageUrl =
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'; // fallback
    }

    const newItem: PortfolioItem = {
      id: Date.now(),
      brandName: newBrandName,
      image: finalImageUrl,
    };

    setPortfolio([newItem, ...portfolio]);
    setNewBrandName('');
    setUploadedFile(null);
    setSocialMediaLink('');
    setIsAddModalOpen(false);
  };

  // Action: Delete Portfolio Item
  const handleDeletePortfolioItem = (id: number) => {
    setPortfolio(portfolio.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none" id="profile-page-container">
      {/* ── HEADER TITLE BAR (DESKTOP) ── */}
      <div className="hidden md:flex items-center justify-between" id="desktop-header-bar">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-bold text-[#1a1a2e] tracking-tight">My profile</h1>
          <p className="text-sm font-light text-[#7a7a9a]">
            Welcome back to your creator dashboard
          </p>
        </div>
        <button
          id="btn-sign-out"
          onClick={() => alert('Signing out...')}
          className="px-4 py-2 border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      {/* ── MAIN CREATOR CARD ── */}
      <div
        className="relative bg-[#040039] overflow-hidden -mx-4 -mt-6 md:mx-0 md:mt-0 rounded-b-[32px] md:rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between shadow-lg"
        id="profile-banner-card"
      >
        {/* Navy glowing overlay effects */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-pink/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#4d70ff]/10 blur-[80px] pointer-events-none" />

        {/* Left Side: Avatar & Core Information */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-5 text-center md:text-left z-10">
          {/* Avatar Ring */}
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-[3.5px] border-brand-pink overflow-hidden bg-zinc-700 shadow-xl shrink-0">
            <Image src={profile.image} alt={profile.name} fill priority className="object-cover" />
            {/* Small 'M' badge overlapping avatar */}
            <div className="absolute bottom-0 right-0 w-6.5 h-6.5 rounded-full bg-brand-pink border-2 border-[#040039] flex items-center justify-center text-[10px] font-black text-white shadow-md">
              M
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">
                {profile.name}
              </h2>
              {/* Rating badge (inline in mobile view) */}
              <div className="md:hidden flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5 border border-white/10 text-white text-[11px] font-medium">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span>{profile.rating}</span>
              </div>
            </div>
            <p className="text-white/50 text-xs font-light">@{profile.handle}</p>

            {/* Impact Advocate Badge */}
            <div className="flex items-center justify-center md:justify-start mt-2">
              <div className="inline-flex items-center gap-1.5 bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-sm border border-brand-pink-light">
                <span className="text-brand-pink text-xs font-bold tracking-tight uppercase">
                  {profile.badge}
                </span>
                <div className="w-5 h-5 rounded-full bg-brand-pink flex items-center justify-center text-white shadow-sm">
                  <Award size={10} className="stroke-white" />
                </div>
              </div>
            </div>

            {/* Location Tag */}
            <div className="flex items-center justify-center md:justify-start gap-1 text-white/50 text-[11px] font-light mt-2.5">
              <MapPin size={11} className="text-white/40" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tier Badge & Edit button (Desktop view) */}
        <div className="hidden md:flex flex-col items-end gap-3 z-10" id="desktop-banner-actions">
          <span className="bg-brand-pink-light text-brand-pink font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
            {profile.tier}
          </span>
          <button
            id="btn-edit-profile-desktop"
            onClick={handleOpenEditProfile}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Edit2 size={13} />
            Edit profile
          </button>
        </div>

        {/* Mobile View Stats & Action Buttons */}
        <div className="flex flex-col gap-4 mt-6 md:hidden w-full z-10" id="mobile-banner-actions">
          {/* Stats Card inside Banner */}
          <div className="grid grid-cols-3 bg-[#14132a] border border-[#232142] rounded-2xl p-4 text-center divide-x divide-[#232142] shadow-inner">
            <div className="flex flex-col gap-0.5">
              <span className="text-white text-base font-bold">{profile.reach}</span>
              <span className="text-[#7a7a9a] text-[9px] font-semibold uppercase tracking-wider">
                Followers
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white text-base font-bold">{profile.campaignCount}</span>
              <span className="text-[#7a7a9a] text-[9px] font-semibold uppercase tracking-wider">
                Campaigns
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-white text-base font-bold">{profile.earned}</span>
              <span className="text-[#7a7a9a] text-[9px] font-semibold uppercase tracking-wider">
                Earnings
              </span>
            </div>
          </div>

          {/* Mobile Buttons - Stacked vertically */}
          <div className="flex flex-col gap-3 w-full">
            <button
              id="btn-edit-profile-mobile"
              onClick={handleOpenEditProfile}
              className="w-full py-3 bg-[#1a1936]/40 hover:bg-[#1a1936] border border-[#2f2c5c] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Edit2 size={13} />
              Edit Profile
            </button>
            <button
              id="btn-manage-payout-mobile"
              onClick={() => alert('Redirecting to payout...')}
              className="w-full py-3 bg-[#fff0f5] hover:bg-[#ffe3ec] border border-brand-pink/30 text-brand-pink rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Wallet size={13} className="text-brand-pink" />
              <span className="font-bold text-brand-pink">Manage Payout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW STATS CARD ── */}
      <div
        className="hidden md:grid grid-cols-4 bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 shadow-xs divide-x divide-[#e8e6f0]/40 text-center select-none"
        id="desktop-stats-card"
      >
        <div className="flex flex-col gap-1 items-center justify-center">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Rating
          </span>
          <div className="flex items-center gap-1 text-base font-bold text-[#1a1a2e]">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>{profile.rating}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center justify-center">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Reach
          </span>
          <span className="text-base font-bold text-[#1a1a2e]">{profile.reach}</span>
        </div>
        <div className="flex flex-col gap-1 items-center justify-center">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Campaigns
          </span>
          <span className="text-base font-bold text-[#1a1a2e]">{profile.campaignCount}</span>
        </div>
        <div className="flex flex-col gap-1 items-center justify-center">
          <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Earned
          </span>
          <span className="text-base font-bold text-[#1a1a2e]">{profile.earned}</span>
        </div>
      </div>

      {/* ── CONNECTED PLATFORMS ── */}
      <div className="flex flex-col gap-3" id="connected-platforms-section">
        <h3 className="text-xs font-bold text-[#7a7a9a] uppercase tracking-wider">
          Connected Platforms
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {profile.platforms.map((plat) => {
            const isConnected = plat.connected;
            return (
              <div
                key={plat.name}
                id={`platform-card-${plat.name.toLowerCase().replace(/[\s()]+/g, '')}`}
                className={cn(
                  'border rounded-[24px] p-4 flex items-center justify-between bg-white transition-all shadow-xs relative overflow-hidden group',
                  isConnected ? 'border-[#e8e6f0]/70' : 'border-[#e8e6f0]/50 opacity-60',
                )}
              >
                <div className="flex items-center gap-3.5">
                  <PlatformIcon icon={plat.icon} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1a1a2e]">{plat.name}</span>
                    <span
                      className={cn(
                        'text-[10px] font-semibold mt-0.5',
                        isConnected ? 'text-[#7a7a9a]' : 'text-[#9a99b0] italic',
                      )}
                    >
                      {plat.followers}
                    </span>
                  </div>
                </div>
                {/* Connection active dot indicator */}
                {isConnected && (
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BIO & NICHES ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="bio-niches-row">
        {/* Bio Card */}
        <div
          className="md:col-span-2 bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 shadow-xs flex flex-col gap-3"
          id="bio-card"
        >
          <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">Bio</span>
          <p className="text-xs md:text-sm font-light text-[#1a1a2e] leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        </div>

        {/* Niche Card (only visible on mobile layout in this spot) */}
        <div
          className="md:hidden bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 shadow-xs flex items-center gap-4"
          id="niche-card-mobile"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-pink-light flex items-center justify-center shrink-0">
            <Award size={20} className="text-brand-pink" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#7a7a9a] font-medium">Creator Niche</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.niches.map((niche) => (
                <span
                  key={niche}
                  className="bg-[#f3f0ff] text-[#7c3aed] font-bold text-[10px] px-3 py-1 rounded-full border border-[#7c3aed]/10"
                >
                  {niche}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB NAVIGATION BAR ── */}
      <div
        className="flex items-center gap-1 border-b border-[#e8e6f0] md:border-b-0 md:bg-[#e8e6f0]/40 md:p-1.5 md:rounded-[20px] w-full"
        id="tab-nav-bar"
      >
        {(['portfolio', 'reviews', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-trigger-${tab}`}
            onClick={() => {
              setActiveTab(tab);
            }}
            className={cn(
              'flex-1 py-3 px-4 text-xs font-semibold capitalize transition-all cursor-pointer text-center',
              activeTab === tab
                ? 'text-brand-pink border-b-2 border-brand-pink font-bold md:border-b-0 md:bg-white md:shadow-xs md:rounded-[16px]'
                : 'text-[#7a7a9a] border-b-2 border-transparent pb-3 md:pb-3 md:hover:bg-white/40 md:rounded-[16px]',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div
        className="bg-white border border-[#e8e6f0]/60 rounded-[32px] p-6 shadow-sm flex flex-col gap-6"
        id="tab-content-container"
      >
        {/* ── 1. PORTFOLIO TAB ── */}
        {activeTab === 'portfolio' && (
          <div className="flex flex-col gap-6" id="portfolio-tab-content">
            {/* Desktop Niche Row inside the tab card */}
            <div
              className="hidden md:flex items-center gap-4 border-b border-[#e8e6f0]/30 pb-4"
              id="desktop-niche-row"
            >
              <div className="w-9 h-9 rounded-full bg-brand-pink-light flex items-center justify-center shrink-0">
                <Award size={18} className="text-brand-pink" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Creator Niche:
                </span>
                <div className="flex items-center gap-2">
                  {profile.niches.map((niche) => (
                    <span
                      key={niche}
                      className="bg-[#f3f0ff] text-[#7c3aed] font-bold text-[11px] px-3 py-1 rounded-full border border-[#7c3aed]/10"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Grid */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-[#1a1a2e]">Portfolio</h4>
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                id="portfolio-grid"
              >
                {/* Add Item Card */}
                <button
                  id="btn-add-portfolio-item"
                  onClick={() => setIsAddModalOpen(true)}
                  className="aspect-square border-2 border-dashed border-[#e8e6f0] hover:border-brand-pink/40 hover:bg-[#fff9fb] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#f4f3f6] group-hover:bg-brand-pink-light flex items-center justify-center transition-colors">
                    <Plus size={18} className="text-[#9a99b0] group-hover:text-brand-pink" />
                  </div>
                  <span className="text-xs font-bold text-[#7a7a9a] group-hover:text-brand-pink transition-colors">
                    Add Item
                  </span>
                </button>

                {/* Portfolio Cards */}
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm bg-zinc-100"
                    id={`portfolio-item-${item.id}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.brandName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Brand Name Text at Bottom */}
                    <span className="absolute bottom-3 left-4 text-xs font-bold text-white tracking-wide">
                      {item.brandName}
                    </span>

                    {/* Delete Item Overlay Button */}
                    <button
                      id={`btn-delete-portfolio-${item.id}`}
                      onClick={() => handleDeletePortfolioItem(item.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
                      title="Delete Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div
              className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#e8e6f0]/40 pt-6 mt-4"
              id="portfolio-footer"
            >
              <span className="text-xs text-[#7a7a9a] font-light">
                {portfolio.length} portfolio items
              </span>

              {/* Styled Pagination */}
              <div className="flex items-center gap-1.5" id="pagination-controls">
                <button
                  className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] disabled:opacity-40 transition-colors cursor-pointer"
                  disabled
                >
                  &lt;
                </button>
                <button className="w-8 h-8 rounded-lg bg-brand-pink text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] transition-colors cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] transition-colors cursor-pointer">
                  3
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] transition-colors cursor-pointer">
                  4
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] transition-colors cursor-pointer">
                  5
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] transition-colors cursor-pointer">
                  6
                </button>
                <span className="text-xs text-[#9a99b0] px-1 font-semibold">..</span>
                <button className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] transition-colors cursor-pointer">
                  14
                </button>
                <button className="w-8 h-8 rounded-lg border border-[#e8e6f0] hover:bg-[#fcfbfd] flex items-center justify-center text-xs font-semibold text-[#7a7a9a] transition-colors cursor-pointer">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. REVIEWS TAB ── */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-6" id="reviews-tab-content">
            {/* Rating Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-[#e8e6f0]/60 pb-6">
              {/* Score Column */}
              <div className="flex items-center gap-6 justify-between md:justify-start md:col-span-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[44px] font-black text-[#1a1a2e] leading-none">4.9</span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#7a7a9a] font-medium mt-1">17 reviews</span>
                </div>

                {/* Rating Progress Bars */}
                <div className="flex flex-col gap-1.5 flex-1 max-w-[240px]">
                  {[
                    { stars: 5, pct: '85%' },
                    { stars: 4, pct: '15%' },
                    { stars: 3, pct: '5%' },
                    { stars: 2, pct: '0%' },
                    { stars: 1, pct: '0%' },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#7a7a9a] font-bold w-2">{row.stars}</span>
                      <div className="flex-1 h-1.5 bg-[#e8e6f0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#f59e0b] rounded-full"
                          style={{ width: row.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Review Button Column */}
              <div className="flex justify-end w-full md:w-auto">
                <button
                  id="btn-request-review-trigger"
                  onClick={() => {
                    setIsRequestReviewOpen(true);
                    setRequestStep('select');
                    setSelectedBrandId(null);
                    setPersonalMessage('');
                  }}
                  className="w-full md:w-auto px-5 py-3 border border-brand-pink bg-[#fff5f7] hover:bg-[#ffeef2] text-xs font-bold text-brand-pink rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <Wallet size={13} className="text-brand-pink shrink-0" />
                  Request review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="flex flex-col gap-4">
              {MOCK_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="border border-[#e8e6f0] bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-xs"
                  id={`review-card-${rev.id}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold',
                          rev.logoBg,
                        )}
                      >
                        {rev.logoText}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1a1a2e]">{rev.brandName}</span>
                        <span className="text-[10px] text-[#7a7a9a] font-medium mt-0.5">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                    {/* Stars review */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={cn(
                            i < rev.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-zinc-200',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-[#5a5a7a]">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-3.5 w-full" id="settings-menu-list">
            {/* Notifications */}
            <div
              id="settings-item-notifications"
              className="border border-[#e8e6f0]/70 rounded-2xl md:rounded-xl p-4 flex items-center justify-between bg-white hover:bg-[#faf9fc]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-xs"
              onClick={() => setActiveDrawer('notifications')}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] flex items-center justify-center shrink-0 text-[#8b5cf6]">
                  <Bell size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1a2e]">Notifications</span>
                  <span className="text-[10px] font-medium text-[#7a7a9a] mt-0.5 md:hidden">
                    Push & email
                  </span>
                  <span className="text-[10px] font-medium text-[#7a7a9a] mt-0.5 hidden md:inline">
                    Push, email & SMS preferences
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9a99b0] shrink-0" />
            </div>

            {/* Privacy & Security */}
            <div
              id="settings-item-privacy"
              className="border border-[#e8e6f0]/70 rounded-2xl md:rounded-xl p-4 flex items-center justify-between bg-white hover:bg-[#faf9fc]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-xs"
              onClick={() => setIsPrivacyOpen(true)}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#d1fae5] flex items-center justify-center shrink-0 text-[#10b981]">
                  <Shield size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1a2e]">Privacy & Security</span>
                  <span className="text-[10px] font-medium text-[#7a7a9a] mt-0.5">
                    Visibility, 2FA, password
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9a99b0] shrink-0" />
            </div>

            {/* Analytics */}
            <div
              id="settings-item-analytics"
              className="border border-[#e8e6f0]/70 rounded-2xl md:rounded-xl p-4 flex items-center justify-between bg-white hover:bg-[#faf9fc]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-xs"
              onClick={() => setIsAnalyticsOpen(true)}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#fce7f3] flex items-center justify-center shrink-0 text-[#ec4899]">
                  <BarChart2 size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1a2e]">Analytics</span>
                  <span className="text-[10px] font-medium text-[#7a7a9a] mt-0.5">
                    Performance across platforms
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9a99b0] shrink-0" />
            </div>

            {/* Help & Support */}
            <div
              id="settings-item-help"
              className="border border-[#e8e6f0]/70 rounded-2xl md:rounded-xl p-4 flex items-center justify-between bg-white hover:bg-[#faf9fc]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-xs"
              onClick={() => {
                setIsHelpOpen(true);
                setHelpStep('main');
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#fef3c7] flex items-center justify-center shrink-0 text-[#d97706]">
                  <HelpCircle size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1a2e]">Help & Support</span>
                  <span className="text-[10px] font-medium text-[#7a7a9a] mt-0.5">
                    FAQs, live chat, contact us
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9a99b0] shrink-0" />
            </div>

            {/* Sign Out (Mobile Only) */}
            <div
              id="settings-item-signout"
              className="border border-[#e8e6f0]/70 rounded-2xl p-4 flex items-center justify-between bg-white hover:bg-[#faf9fc]/30 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-xs md:hidden"
              onClick={() => alert('Signing out...')}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#fee2e2] flex items-center justify-center shrink-0 text-[#ef4444]">
                  <LogOut size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1a2e]">Sign Out</span>
                  <span className="text-[10px] font-medium text-[#7a7a9a] mt-0.5">
                    Log out of your account
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#9a99b0] shrink-0" />
            </div>

            {/* Mobile Footer */}
            <div className="text-[10px] text-[#9a99b0] text-center font-medium mt-6 py-2 md:hidden">
              Trendupp v1.0.0 ·{' '}
              <span
                onClick={() => alert('Terms conditions')}
                className="text-brand-pink font-semibold hover:underline cursor-pointer"
              >
                Terms
              </span>{' '}
              ·{' '}
              <span
                onClick={() => alert('Privacy policy')}
                className="text-brand-pink font-semibold hover:underline cursor-pointer"
              >
                Privacy
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. ADD PORTFOLIO ITEM DIALOG MODAL ── */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => !open && setIsAddModalOpen(false)}>
        <DialogContent className="sm:max-w-[460px] rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-6 shadow-xl">
          <DialogHeader className="border-b border-[#e8e6f0]/40 pb-2">
            <DialogTitle className="text-base font-bold text-[#1a1a2e] tracking-tight">
              Add Portfolio Item
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddPortfolioItem} className="flex flex-col gap-5">
            {/* Brand Name Input */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider"
                htmlFor="input-modal-brand"
              >
                Brand Name
              </label>
              <input
                id="input-modal-brand"
                type="text"
                placeholder="e.g. Pepsi, Nike, Canon"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                required
              />
            </div>

            {/* Upload Image Option */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider pl-1">
                Upload Image
              </label>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('portfolio-file-input')?.click();
                  }
                }}
                onClick={() => document.getElementById('portfolio-file-input')?.click()}
                className="w-full border-2 border-dashed border-brand-pink/30 hover:border-brand-pink/60 bg-white hover:bg-rose-50/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <input
                  type="file"
                  id="portfolio-file-input"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                    }
                  }}
                />
                <UploadCloud size={24} className="text-brand-pink" />
                {uploadedFile ? (
                  <span className="text-xs font-bold text-[#1a1a2e] truncate max-w-full px-2">
                    {uploadedFile.name}
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-bold text-[#1a1a2e]">Tap to upload files</span>
                    <span className="text-[9px] text-[#9a99b0] font-light">
                      PNG, JPG up to 10MB
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-[#e8e6f0]" />
              <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider select-none">
                or
              </span>
              <hr className="flex-1 border-[#e8e6f0]" />
            </div>

            {/* Social Media Link Input */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider pl-1">
                Social media link
              </label>
              <input
                type="text"
                placeholder="https://drive.google.com/..."
                value={socialMediaLink}
                onChange={(e) => setSocialMediaLink(e.target.value)}
                className="w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-3 border-t border-[#e8e6f0]/40 pt-4 mt-1">
              <button
                type="submit"
                id="btn-modal-add"
                className="flex-1 py-3 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
              >
                Add Item
              </button>
              <button
                type="button"
                id="btn-modal-cancel"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewBrandName('');
                  setUploadedFile(null);
                  setSocialMediaLink('');
                }}
                className="flex-1 py-3 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-[#7a7a9a] rounded-xl text-xs font-bold cursor-pointer active:scale-98 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 5. REQUEST REVIEW DIALOG MODAL (DESKTOP) ── */}
      <Dialog
        open={isRequestReviewOpen}
        onOpenChange={(open) => !open && setIsRequestReviewOpen(false)}
      >
        <DialogContent className="hidden md:flex sm:max-w-[480px] rounded-[24px] bg-white border border-[#e8e6f0] p-6 flex-col gap-5 shadow-xl">
          {requestStep === 'select' ? (
            <>
              <DialogHeader className="border-b border-[#e8e6f0]/40 pb-2 relative">
                <DialogTitle className="text-base font-bold text-[#1a1a2e] tracking-tight">
                  Request review
                </DialogTitle>
              </DialogHeader>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-3.5 text-[#7a7a9a]" />
                <input
                  type="text"
                  placeholder="Search brands e.g. Zara Africa..."
                  value={brandSearchQuery}
                  onChange={(e) => setBrandSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-[#e8e6f0] rounded-xl text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#7a7a9a]"
                />
              </div>

              <span className="text-[9px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Select a brand to submit a request
              </span>

              {/* Brands Scroll Area */}
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrandId(brand.id);
                        setRequestStep('message');
                      }}
                      className="border border-[#e8e6f0] hover:border-brand-pink/40 bg-white hover:bg-[#fff9fb] rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                          <Image src={brand.logo} alt={brand.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#1a1a2e]">{brand.name}</span>
                          <span className="text-[10px] text-[#7a7a9a] mt-0.5">
                            {brand.industry}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#9a99b0] font-light">
                          {brand.campaigns} campaigns
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Viewing ${brand.name} details...`);
                          }}
                          className="px-3 py-1 bg-brand-pink-light hover:bg-[#ffe3ec] text-brand-pink font-bold text-[10px] rounded-full transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#9a99b0] text-center py-4">No brands found</span>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Back Header */}
              <div className="flex items-center justify-between border-b border-[#e8e6f0]/40 pb-2">
                <button
                  type="button"
                  onClick={() => setRequestStep('select')}
                  className="text-xs font-bold text-brand-pink flex items-center gap-1 hover:text-brand-pink-dark transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  Back
                </button>
                <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Selected brand
                </span>
              </div>

              {/* Selected Brand Display */}
              {selectedBrand && (
                <div className="border border-brand-pink/40 bg-[#fff9fb] rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                      <Image
                        src={selectedBrand.logo}
                        alt={selectedBrand.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1a2e]">{selectedBrand.name}</span>
                      <span className="text-[10px] text-[#7a7a9a] mt-0.5">
                        {selectedBrand.industry}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#7a7a9a] font-medium">
                      {selectedBrand.campaigns} campaigns
                    </span>
                    <span className="text-[9px] text-[#9a99b0] font-light">•</span>
                    <span className="text-[10px] text-[#7a7a9a] font-medium">
                      {selectedBrand.followers} followers
                    </span>
                  </div>
                </div>
              )}

              {/* Warning Box */}
              <div className="flex items-start gap-2.5 p-3.5 bg-[#fffbeb] border border-[#fef3c7] rounded-xl text-[#d97706]">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed font-medium">
                  Please keep your review requests professional and clear. Responses will be visible
                  on your public campaign profile.
                </span>
              </div>

              {/* Message Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a1a2e] tracking-tight">
                  Personal Message
                </label>
                <textarea
                  placeholder="Add a personal note to your request (optional)..."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value.slice(0, 160))}
                  maxLength={160}
                  className="w-full h-24 border border-[#e8e6f0] rounded-xl p-3 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-light resize-none leading-relaxed"
                />
                <span className="text-[10px] text-[#9a99b0] font-medium text-right mt-1">
                  {personalMessage.length}/160
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => {
                  alert(`Review request successfully sent to ${selectedBrand?.name}!`);
                  setIsRequestReviewOpen(false);
                }}
                className="w-full py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer shadow-xs"
              >
                Submit
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── 6. REQUEST REVIEW MOBILE FULL-SCREEN OVERLAY ── */}
      {isRequestReviewOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden animate-in slide-in-from-bottom duration-250">
          {requestStep === 'select' ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#e8e6f0]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRequestReviewOpen(false)}
                    className="p-1 text-[#1a1a2e] hover:bg-zinc-50 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-sm font-bold text-[#1a1a2e]">Request Review</h3>
                </div>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-[#e8e6f0]/40">
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-3.5 text-[#7a7a9a]" />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearchQuery}
                    onChange={(e) => setBrandSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 border border-[#e8e6f0] rounded-xl text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#7a7a9a]"
                  />
                </div>
              </div>

              <div className="p-4 pb-1">
                <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Select a brand to submit a request
                </span>
              </div>

              {/* Brands List */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pt-2">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => {
                    const isSelected = selectedBrandId === brand.id;
                    return (
                      <div
                        key={brand.id}
                        onClick={() => setSelectedBrandId(brand.id)}
                        className={cn(
                          'border rounded-2xl p-3.5 flex items-center justify-between transition-all bg-white',
                          isSelected
                            ? 'border-brand-pink border-2 bg-[#fff9fb]'
                            : 'border-[#e8e6f0]',
                        )}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#1a1a2e]">{brand.name}</span>
                            <span className="text-[10px] text-[#7a7a9a] mt-0.5">
                              {brand.industry}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-[#9a99b0] font-light">
                            {brand.campaigns} campaigns
                          </span>
                          <button
                            type="button"
                            className="px-3.5 py-1.5 bg-brand-pink-light text-brand-pink font-bold text-[10px] rounded-full"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-[#9a99b0] text-center py-6">No brands found</span>
                )}
              </div>

              {/* Sticky bottom select button */}
              <div className="p-4 border-t border-[#e8e6f0] bg-white">
                <button
                  type="button"
                  onClick={() => selectedBrandId && setRequestStep('message')}
                  disabled={!selectedBrandId}
                  className="w-full py-3.5 bg-brand-pink hover:bg-brand-pink-dark disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  Select
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#e8e6f0]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestStep('select')}
                    className="p-1 text-[#1a1a2e] hover:bg-zinc-50 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-sm font-bold text-[#1a1a2e]">Request Review</h3>
                </div>
              </div>

              {/* Scrollable message content */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Selected brand
                </span>

                {/* Selected Brand */}
                {selectedBrand && (
                  <div className="border border-brand-pink/40 bg-[#fff9fb] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                        <Image
                          src={selectedBrand.logo}
                          alt={selectedBrand.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1a1a2e]">
                          {selectedBrand.name}
                        </span>
                        <span className="text-[10px] text-[#7a7a9a] mt-0.5">
                          {selectedBrand.industry}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] text-[#7a7a9a] font-semibold">
                        {selectedBrand.campaigns} campaigns
                      </span>
                      <span className="text-[9px] text-[#9a99b0]">
                        {selectedBrand.followers} followers
                      </span>
                    </div>
                  </div>
                )}

                {/* Warning Callout */}
                <div className="flex items-start gap-2.5 p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-2xl text-[#d97706]">
                  <Info size={15} className="shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed font-medium">
                    Please keep your review requests professional and clear. Responses will be
                    visible on your public campaign profile.
                  </span>
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-xs font-bold text-[#1a1a2e] tracking-tight">
                    Personal Message
                  </label>
                  <textarea
                    placeholder="Add a personal note to your request (optional)..."
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value.slice(0, 160))}
                    maxLength={160}
                    className="w-full h-28 border border-[#e8e6f0] rounded-2xl p-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-light resize-none leading-relaxed"
                  />
                  <span className="text-[10px] text-[#9a99b0] font-medium text-right mt-1">
                    {personalMessage.length}/160
                  </span>
                </div>
              </div>

              {/* Sticky bottom submit button */}
              <div className="p-4 border-t border-[#e8e6f0] bg-white">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Review request successfully sent to ${selectedBrand?.name}!`);
                    setIsRequestReviewOpen(false);
                  }}
                  className="w-full py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 7. EDIT PROFILE RESPONSIVE OVERLAY / DRAWER PANEL ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isEditProfileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={handleCancelSettings}
        />

        {/* Panel Container */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out',
            'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-[480px] md:border-l md:border-[#e8e6f0] rounded-t-3xl md:rounded-none h-[92vh] md:h-full overflow-hidden',
            isEditProfileOpen
              ? 'translate-y-0 md:translate-x-0 md:translate-y-0'
              : 'translate-y-full md:translate-x-full md:translate-y-0',
          )}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#e8e6f0] md:hidden shrink-0">
            <button
              type="button"
              onClick={() => {
                if (editTab === 'social' && confirmingPlatform) {
                  setConfirmingPlatform(null);
                } else {
                  handleCancelSettings();
                }
              }}
              className="flex items-center gap-1 text-xs font-bold text-brand-pink hover:underline"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <h3 className="text-sm font-bold text-[#1a1a2e]">Edit Profile</h3>
            <button
              type="button"
              disabled={
                updatePersonalInfoMutation.isPending ||
                updateNichesMutation.isPending ||
                updateSocialsMutation.isPending
              }
              onClick={() => {
                if (editTab === 'social' && confirmingPlatform) {
                  // Connect and Save
                  const updated = editPlatforms.map((plat) => {
                    if (plat.name === confirmingPlatform.name) {
                      return {
                        ...plat,
                        connected: true,
                        followers:
                          plat.name === 'Instagram'
                            ? '12.4K'
                            : plat.name === 'TikTok'
                              ? '31.2K'
                              : plat.name === 'YouTube'
                                ? '8.9K'
                                : '5.0K',
                      };
                    }
                    return plat;
                  });
                  setProfile({
                    ...profile,
                    name: `${editFirstName.trim()} ${editLastName.trim()}`.trim(),
                    handle: editHandle.trim(),
                    email: editEmail.trim(),
                    location: `${editState.trim()}, ${editCountry.trim()}`,
                    nationality: editNationality.trim(),
                    bio: editBio,
                    niches: editNiches,
                    platforms: updated,
                  });
                  setIsEditProfileOpen(false);
                } else {
                  handleSaveSettings();
                }
              }}
              className="text-xs font-bold text-brand-pink hover:underline disabled:opacity-50"
            >
              {updatePersonalInfoMutation.isPending ||
              updateNichesMutation.isPending ||
              updateSocialsMutation.isPending
                ? 'Saving...'
                : 'Save'}
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-[#e8e6f0]/40 shrink-0">
            <h3 className="text-base font-bold text-[#1a1a2e]">Edit profile</h3>
            <button
              type="button"
              onClick={handleCancelSettings}
              className="text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="px-4 md:px-6 mt-4 shrink-0">
            <div className="flex p-1 bg-[#f4f3f6] rounded-full md:rounded-xl w-full gap-1">
              {(['personal', 'niche', 'social'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setEditTab(tab);
                    setConfirmingPlatform(null);
                  }}
                  className={cn(
                    'flex-1 py-2.5 text-xs font-semibold text-center cursor-pointer transition-all duration-200 capitalize',
                    editTab === tab
                      ? 'bg-brand-pink text-white font-bold rounded-full md:bg-white md:text-brand-pink md:rounded-lg md:shadow-2xs'
                      : 'text-[#7a7a9a] hover:text-[#1a1a2e]',
                  )}
                >
                  {tab === 'personal' ? 'Personal Info' : tab === 'niche' ? 'Niches' : 'Socials'}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-thin">
            {/* TAB 1: PERSONAL INFO */}
            {editTab === 'personal' && (
              <div className="flex flex-col gap-5">
                {/* Avatar Upload Container */}
                <div className="flex flex-col items-center py-2 select-none">
                  <div className="relative w-22 h-22 rounded-full border-[3px] border-brand-pink bg-zinc-700 shadow-md">
                    <Image
                      src={editAvatarPreview || profile.image}
                      alt="Profile Avatar"
                      fill
                      className="object-cover rounded-full"
                    />
                    {/* Camera Button Overlap */}
                    <button
                      type="button"
                      className="absolute bottom-0.5 right-0.5 w-6.5 h-6.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center border-2 border-white shadow-sm cursor-pointer transition-transform active:scale-90"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={12} className="stroke-white stroke-[2.5]" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setEditAvatarFile(file);
                          setEditAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#7a7a9a] font-medium mt-2 text-center block">
                    Add a profile picture to stand out
                  </span>
                </div>

                {/* Input Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g alexander"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#b0afc5]"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      Last name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g chisom"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#b0afc5]"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      Username
                    </label>
                    <div className="relative w-full">
                      <span className="absolute left-3.5 top-2.5 text-xs text-[#7a7a9a] font-bold">
                        @
                      </span>
                      <input
                        type="text"
                        placeholder="e.g alexsafor"
                        value={editHandle}
                        onChange={(e) => setEditHandle(e.target.value)}
                        className="w-full h-10 border border-[#e8e6f0] rounded-xl pl-8 pr-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#b0afc5]"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative w-full">
                      <Mail size={13} className="absolute left-3.5 top-3.5 text-[#7a7a9a]" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full h-10 border border-[#e8e6f0] rounded-xl pl-9 pr-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#b0afc5]"
                        required
                      />
                    </div>
                  </div>

                  {/* Country of Residence */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      Country of Residence
                    </label>
                    <div className="relative w-full">
                      <select
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                        className="appearance-none bg-white w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 pr-8 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3.5 top-3.5 text-[#7a7a9a] pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      State
                    </label>
                    <div className="relative w-full">
                      <select
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        className="appearance-none bg-white w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 pr-8 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                      >
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Kano">Kano</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Oyo">Oyo</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3.5 top-3.5 text-[#7a7a9a] pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Nationality */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      Nationality
                    </label>
                    <div className="relative w-full">
                      <select
                        value={editNationality}
                        onChange={(e) => setEditNationality(e.target.value)}
                        className="appearance-none bg-white w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 pr-8 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghanaian">Ghanaian</option>
                        <option value="Kenyan">Kenyan</option>
                        <option value="South African">South African</option>
                        <option value="British">British</option>
                        <option value="American">American</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3.5 top-3.5 text-[#7a7a9a] pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell brands what you're about in 2-3 sentences..."
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full h-24 border border-[#e8e6f0] rounded-xl p-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-light resize-none leading-relaxed placeholder-[#b0afc5]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: NICHE */}
            {editTab === 'niche' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                    Select Niches
                  </label>
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {ALL_NICHES_INDUSTRIES.map((niche) => {
                      const active = editNiches.includes(niche);
                      return (
                        <button
                          key={niche}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setEditNiches(editNiches.filter((n) => n !== niche));
                            } else {
                              setEditNiches([...editNiches, niche]);
                            }
                          }}
                          className={cn(
                            'px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer select-none',
                            active
                              ? 'bg-brand-pink-light border-brand-pink text-brand-pink shadow-[0_1px_4px_rgba(215,23,111,0.1)]'
                              : 'bg-[#f4f3f6] border-transparent text-[#5a5a7a] hover:bg-[#eae8ed]',
                          )}
                        >
                          {niche}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL */}
            {editTab === 'social' && (
              <div className="flex flex-col gap-5">
                {confirmingPlatform ? (
                  <div className="flex flex-col gap-5">
                    {/* Back link for desktop */}
                    <button
                      type="button"
                      onClick={() => setConfirmingPlatform(null)}
                      className="hidden md:flex items-center gap-1 text-xs font-semibold text-brand-pink hover:underline self-start cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                      <span>Back to platforms</span>
                    </button>

                    {/* Platform connection card */}
                    <div className="w-full max-w-sm mx-auto border border-[#e8e6f0] rounded-2xl p-6 bg-white flex flex-col items-center text-center shadow-xs mt-2">
                      <div className="mb-4">{getPlatformConfirmIcon(confirmingPlatform.name)}</div>
                      <h4 className="text-sm font-bold text-[#1a1a2e]">
                        {confirmingPlatform.name === 'X (Twitter)'
                          ? 'X / Twitter'
                          : confirmingPlatform.name}
                      </h4>
                      <p className="text-[10px] text-[#7a7a9a] font-light mt-0.5">
                        {getPlatformConfirmData(confirmingPlatform.name).subtitle}
                      </p>
                    </div>

                    {/* Description and link */}
                    <div className="text-xs text-[#5a5a7a] font-semibold leading-relaxed mt-2">
                      Before you proceed, please confirm your account meet{' '}
                      <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">
                        {getPlatformConfirmData(confirmingPlatform.name).reqLinkText}
                      </span>
                    </div>

                    {/* Bullets */}
                    <ul className="flex flex-col gap-3 mt-1.5 pl-1">
                      {getPlatformConfirmData(confirmingPlatform.name).bullets.map(
                        (bullet, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-[#5a5a7a] font-light leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7a7a9a] shrink-0 mt-1.5" />
                            <span>{bullet}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs text-[#7a7a9a] leading-relaxed font-light block md:hidden">
                        Link your social platforms to get discovered by brands.
                      </p>
                      <p className="text-xs text-[#7a7a9a] leading-relaxed font-light hidden md:block">
                        Link at least 1 and up to 3 of your accounts securely, to verify your social
                        profile and tier
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {editPlatforms.map((plat, idx) => {
                        const reqText =
                          plat.name === 'TikTok' || plat.name === 'Instagram'
                            ? 'Min. 1,000+'
                            : 'Min. 500+';
                        const displayName = plat.name === 'X (Twitter)' ? 'X / Twitter' : plat.name;

                        return (
                          <div
                            key={plat.name}
                            className={cn(
                              'flex items-center justify-between border rounded-2xl p-4 transition-all',
                              plat.connected
                                ? 'border-brand-pink-light/60 bg-[#fffbfe]/60 shadow-[0_2px_12px_rgba(215,23,111,0.01)]'
                                : 'border-[#e8e6f0]/50 bg-white hover:shadow-[0_2px_12px_rgba(4,0,57,0.02)]',
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <PlatformIcon icon={plat.icon} />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#1a1a2e]">
                                    {displayName}
                                  </span>
                                  {plat.connected && (
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0">
                                      <Check size={8} className="stroke-[3.5]" />
                                    </span>
                                  )}
                                </div>
                                {plat.connected ? (
                                  <>
                                    <span className="text-[10px] font-bold text-blue-600 mt-0.5">
                                      @
                                      {plat.handle === 'Not connected'
                                        ? profile.handle
                                        : plat.handle}
                                    </span>
                                    <span className="text-[10px] text-[#7a7a9a] font-light mt-0.5">
                                      {plat.followers} followers
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-[#7a7a9a] font-medium mt-0.5">
                                    {reqText}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              {plat.connected ? (
                                <>
                                  <span className="bg-[#e6fbf4] text-[#10b981] border border-[#10b981]/15 px-3 py-1 rounded-full text-[9px] font-bold">
                                    Connected
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePlatform(idx)}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer select-none"
                                  >
                                    Disconnect
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleTogglePlatform(idx)}
                                  className="border border-brand-pink text-brand-pink bg-white hover:bg-brand-pink-light px-5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none"
                                >
                                  Connect
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sticky Save Button Footer */}
          <div className="p-4 md:p-6 border-t border-[#e8e6f0] bg-white shrink-0 mt-auto">
            {editTab === 'social' && confirmingPlatform ? (
              <button
                type="button"
                onClick={handleConfirmConnectPlatform}
                className="w-full py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer shadow-xs text-center flex items-center justify-center gap-1"
              >
                <span className="block md:hidden">Continue &rarr;</span>
                <span className="hidden md:block">Save</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  updatePersonalInfoMutation.isPending ||
                  updateNichesMutation.isPending ||
                  updateSocialsMutation.isPending
                }
                onClick={() => handleSaveSettings()}
                className="w-full py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer shadow-xs text-center disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updatePersonalInfoMutation.isPending ||
                updateNichesMutation.isPending ||
                updateSocialsMutation.isPending ? (
                  <>
                    <RotateCw className="animate-spin" size={14} />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 8. NOTIFICATION SETTINGS RESPONSIVE DRAWER ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isNotificationsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={() => setActiveDrawer(null)}
        />

        {/* Panel Container */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-[#faf9fc] flex flex-col shadow-2xl transition-transform duration-300 ease-out',
            'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-[480px] md:border-l md:border-[#e8e6f0] rounded-t-3xl md:rounded-none h-[92vh] md:h-full overflow-hidden',
            isNotificationsOpen
              ? 'translate-y-0 md:translate-x-0 md:translate-y-0'
              : 'translate-y-full md:translate-x-full md:translate-y-0',
          )}
        >
          {/* Mobile Header */}
          <div className="flex items-center gap-3.5 p-4 border-b border-[#e8e6f0] bg-white md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setActiveDrawer(null)}
              className="w-9 h-9 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#1a1a2e] active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-base font-bold text-[#1a1a2e]">Notifications</h3>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-[#e8e6f0]/40 bg-white shrink-0">
            <h3 className="text-base font-bold text-[#1a1a2e]">Notification</h3>
            <button
              type="button"
              onClick={() => setActiveDrawer(null)}
              className="text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scrollbar-thin">
            {/* Section 1: ACTIVITY */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider mb-2 block pl-1">
                Activity
              </span>
              <div className="border border-[#e8e6f0]/80 rounded-2xl bg-white overflow-hidden divide-y divide-[#e8e6f0]/50 shadow-xs">
                {/* Item 1 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">New Campaigns</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Get alerted when matching campaigns go live
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={notiNewCampaigns}
                    onChange={(checked) => {
                      setNotiNewCampaigns(checked);
                      updateNotiSettingsMutation.mutate({ newCampaigns: checked });
                    }}
                  />
                </div>
                {/* Item 2 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Application Updates</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Status changes on your applications
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={notiAppUpdates}
                    onChange={(checked) => {
                      setNotiAppUpdates(checked);
                      updateNotiSettingsMutation.mutate({ applicationUpdates: checked });
                    }}
                  />
                </div>
                {/* Item 3 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Payment Alerts</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Deposits, withdrawals and escrow releases
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={notiPaymentAlerts}
                    onChange={(checked) => {
                      setNotiPaymentAlerts(checked);
                      updateNotiSettingsMutation.mutate({ paymentAlerts: checked });
                    }}
                  />
                </div>
                {/* Item 4 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Brand Messages</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Campaign Chat Notifications
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={notiBrandMessages}
                    onChange={(checked) => {
                      setNotiBrandMessages(checked);
                      updateNotiSettingsMutation.mutate({ brandMessages: checked });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: CHANNELS */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider mb-2 block pl-1">
                Channels
              </span>
              <div className="border border-[#e8e6f0]/80 rounded-2xl bg-white overflow-hidden divide-y divide-[#e8e6f0]/50 shadow-xs">
                {/* Item 1 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Push Notifications</span>
                  </div>
                  <ToggleSwitch
                    checked={notiPush}
                    onChange={(checked) => {
                      setNotiPush(checked);
                      updateNotiSettingsMutation.mutate({ pushNotifications: checked });
                    }}
                  />
                </div>
                {/* Item 2 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Email Notifications</span>
                  </div>
                  <ToggleSwitch
                    checked={notiEmail}
                    onChange={(checked) => {
                      setNotiEmail(checked);
                      updateNotiSettingsMutation.mutate({ emailNotifications: checked });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: DIGEST */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider mb-2 block pl-1">
                Digest
              </span>
              <div className="border border-[#e8e6f0]/80 rounded-2xl bg-white overflow-hidden divide-y divide-[#e8e6f0]/50 shadow-xs">
                {/* Item 1 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Weekly Summary</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Highlights every Monday morning
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={notiWeeklySummary}
                    onChange={(checked) => {
                      setNotiWeeklySummary(checked);
                      updateNotiSettingsMutation.mutate({ weeklySummary: checked });
                    }}
                  />
                </div>
                {/* Item 2 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Marketing & Offers</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Promotions and platform news
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={notiMarketingOffers}
                    onChange={(checked) => {
                      setNotiMarketingOffers(checked);
                      updateNotiSettingsMutation.mutate({ marketingOffers: checked });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 9. PRIVACY & SECURITY RESPONSIVE DRAWER ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isPrivacyOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={() => setIsPrivacyOpen(false)}
        />

        {/* Panel Container */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-[#faf9fc] flex flex-col shadow-2xl transition-transform duration-300 ease-out',
            'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-[480px] md:border-l md:border-[#e8e6f0] rounded-t-3xl md:rounded-none h-[92vh] md:h-full overflow-hidden',
            isPrivacyOpen
              ? 'translate-y-0 md:translate-x-0 md:translate-y-0'
              : 'translate-y-full md:translate-x-full md:translate-y-0',
          )}
        >
          {/* Mobile Header */}
          <div className="flex items-center gap-3.5 p-4 border-b border-[#e8e6f0] bg-white md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(false)}
              className="w-9 h-9 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#1a1a2e] active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-base font-bold text-[#1a1a2e]">Privacy & Security</h3>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-[#e8e6f0]/40 bg-white shrink-0">
            <h3 className="text-base font-bold text-[#1a1a2e]">Privacy & Security</h3>
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(false)}
              className="text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scrollbar-thin">
            {/* Section 1: ACCOUNT SECURITY */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider mb-2 block pl-1">
                Account Security
              </span>
              <div className="border border-[#e8e6f0]/80 rounded-2xl bg-white overflow-hidden divide-y divide-[#e8e6f0]/50 shadow-xs">
                {/* Item 1 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">
                      Two-Factor Authentication
                    </span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Extra layer of sign-in protection
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={twoFactorAuth}
                    onChange={(checked) => {
                      setTwoFactorAuth(checked);
                      updateSecuritySettingsMutation.mutate({ twoFactorEnabled: checked });
                    }}
                  />
                </div>
                {/* Item 2 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Biometric Login</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Use fingerprint or face ID
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={biometricLogin}
                    onChange={(checked) => {
                      setBiometricLogin(checked);
                      updateSecuritySettingsMutation.mutate({ biometricLoginEnabled: checked });
                    }}
                  />
                </div>
                {/* Item 3 */}
                <div className="p-4 flex items-center justify-between bg-white">
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-xs font-bold text-[#1a1a2e]">Login Alerts</span>
                    <span className="text-[10px] font-light text-[#7a7a9a] leading-tight">
                      Notify me of new sign-ins
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={loginAlerts}
                    onChange={(checked) => {
                      setLoginAlerts(checked);
                      updateSecuritySettingsMutation.mutate({ loginAlertsEnabled: checked });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: PASSWORD */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider mb-2 block pl-1">
                Password
              </span>
              <div className="border border-[#e8e6f0]/80 rounded-2xl bg-white p-4 flex flex-col gap-4 shadow-xs">
                <span className="text-xs font-bold text-[#1a1a2e] md:hidden block">
                  Change Password
                </span>

                {/* Current password */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider hidden md:block pl-1">
                    Current password
                  </label>
                  <div className="relative w-full">
                    <Lock size={14} className="absolute left-3.5 top-3.5 text-[#7a7a9a]" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-11 border border-[#e8e6f0] rounded-xl pl-10 pr-10 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#b0afc5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-3.5 text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider hidden md:block pl-1">
                    New password
                  </label>
                  <div className="relative w-full">
                    <Lock size={14} className="absolute left-3.5 top-3.5 text-[#7a7a9a]" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-11 border border-[#e8e6f0] rounded-xl pl-10 pr-10 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#b0afc5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3.5 text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider hidden md:block pl-1">
                    Confirm password
                  </label>
                  <div className="relative w-full">
                    <Lock size={14} className="absolute left-3.5 top-3.5 text-[#7a7a9a]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 border border-[#e8e6f0] rounded-xl pl-10 pr-10 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium placeholder-[#b0afc5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Update button */}
                <button
                  type="button"
                  disabled={changePasswordMutation.isPending}
                  onClick={() => {
                    if (!currentPassword.trim() || !newPassword.trim()) {
                      toast.error('Please fill in all password fields');
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error('New passwords do not match');
                      return;
                    }
                    changePasswordMutation.mutate(
                      { currentPassword, newPassword },
                      {
                        onSuccess: () => {
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        },
                      },
                    );
                  }}
                  className="w-full md:w-auto md:self-end mt-2 px-8 py-3 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer shadow-xs text-center disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <RotateCw className="animate-spin" size={12} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <span className="block md:hidden">Update Password</span>
                      <span className="hidden md:block">Update password</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Section 3: DANGER ZONE */}
            <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e11d48]">
                <AlertTriangle size={15} />
                <span>Danger Zone</span>
              </div>
              <p className="text-[10px] font-light text-[#7a7a9a] leading-relaxed">
                These actions are irreversible. Proceed with caution. Restore your account within 30
                days, after which account will be deleted
              </p>
              <button
                type="button"
                disabled={deactivateMutation.isPending}
                onClick={() => {
                  const password = window.prompt(
                    'Are you sure you want to deactivate your account? This action is irreversible.\n\nTo confirm, please enter your password:',
                  );
                  if (password !== null) {
                    if (!password.trim()) {
                      toast.error('Password is required to deactivate your account');
                      return;
                    }
                    deactivateMutation.mutate({ password });
                  }
                }}
                className="w-full md:w-auto md:self-start py-2.5 bg-white border border-[#fca5a5] hover:bg-rose-50 text-[#ef4444] rounded-xl text-xs font-bold active:scale-98 transition-all text-center px-6 cursor-pointer select-none disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deactivateMutation.isPending ? (
                  <>
                    <RotateCw className="animate-spin" size={12} />
                    Deactivating...
                  </>
                ) : (
                  'Deactivate account'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 10. ANALYTICS RESPONSIVE DRAWER ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isAnalyticsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={() => setIsAnalyticsOpen(false)}
        />

        {/* Panel Container */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-[#faf9fc] flex flex-col shadow-2xl transition-transform duration-300 ease-out',
            'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-[480px] md:border-l md:border-[#e8e6f0] rounded-t-3xl md:rounded-none h-[92vh] md:h-full overflow-hidden',
            isAnalyticsOpen
              ? 'translate-y-0 md:translate-x-0 md:translate-y-0'
              : 'translate-y-full md:translate-x-full md:translate-y-0',
          )}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#e8e6f0] bg-white md:hidden shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAnalyticsOpen(false)}
                className="w-9 h-9 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#1a1a2e] active:scale-95 transition-transform cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <h3 className="text-base font-bold text-[#1a1a2e]">Analytics</h3>
            </div>

            {/* Mobile Timeframe Selector */}
            <div className="bg-[#f4f3f6] p-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold text-[#5a5a7a] select-none">
              {(['7d', '30d', '90d'] as const).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setAnalyticsTimeframe(time)}
                  className={cn(
                    'px-2.5 py-1 rounded-md cursor-pointer transition-all duration-150 uppercase',
                    analyticsTimeframe === time
                      ? 'bg-white text-[#1a1a2e] shadow-2xs font-extrabold'
                      : 'hover:text-[#1a1a2e]',
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-[#e8e6f0]/40 bg-white shrink-0">
            <div className="flex items-center gap-4">
              <h3 className="text-base font-bold text-[#1a1a2e]">Analytics</h3>

              {/* Desktop Timeframe Selector */}
              <div className="bg-[#f4f3f6] p-0.5 rounded-lg flex items-center gap-1 text-[9px] font-bold text-[#5a5a7a] select-none">
                {(['7d', '30d', '90d'] as const).map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setAnalyticsTimeframe(time)}
                    className={cn(
                      'px-2.5 py-1 rounded-md cursor-pointer transition-all duration-150 uppercase',
                      analyticsTimeframe === time
                        ? 'bg-white text-[#1a1a2e] shadow-2xs font-extrabold'
                        : 'hover:text-[#1a1a2e]',
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAnalyticsOpen(false)}
              className="text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-thin">
            {/* Grid Stats Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Card 1: Profile Views */}
              <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex flex-col gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="w-8 h-8 rounded-lg bg-[#f3e8ff] flex items-center justify-center text-[#8b5cf6] shrink-0 mb-1">
                  <Eye size={15} />
                </div>
                <span className="text-[10px] font-bold text-[#7a7a9a] block">Profile Views</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-[#1a1a2e] tracking-tight">
                    3,241
                  </span>
                  <span className="text-[9px] font-bold text-brand-pink">+18%</span>
                </div>
              </div>

              {/* Card 2: Post Views */}
              <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex flex-col gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] relative">
                <div className="w-8 h-8 rounded-lg bg-[#fce7f3] flex items-center justify-center text-[#ec4899] shrink-0 mb-1">
                  <TrendingUp size={15} />
                </div>
                {/* Overlay user avatar as in mockup card 2 */}
                <div className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full border border-blue-600 overflow-hidden hidden md:block">
                  <Image
                    src={profile.image}
                    alt="Profile thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#7a7a9a] block">Post views</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-[#1a1a2e] tracking-tight">9</span>
                  <span className="text-[9px] font-bold text-brand-pink">+3</span>
                </div>
              </div>

              {/* Card 3: Avg. Engagement */}
              <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex flex-col gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] shrink-0 mb-1">
                  <Users size={15} />
                </div>
                <span className="text-[10px] font-bold text-[#7a7a9a] block">Avg. Engagement</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-[#1a1a2e] tracking-tight">
                    6.8%
                  </span>
                  <span className="text-[9px] font-bold text-brand-pink">+1.2%</span>
                </div>
              </div>

              {/* Card 4: Total Earned */}
              <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex flex-col gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="w-8 h-8 rounded-lg bg-[#fef3c7] flex items-center justify-center text-[#d97706] shrink-0 mb-1 font-bold text-xs">
                  ₦
                </div>
                <span className="text-[10px] font-bold text-[#7a7a9a] block">Total Earned</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-[#1a1a2e] tracking-tight hidden md:inline">
                    ₦847,000
                  </span>
                  <span className="text-base font-extrabold text-[#1a1a2e] tracking-tight inline md:hidden">
                    ₦847K
                  </span>
                  <span className="text-[9px] font-bold text-brand-pink">+₦120K</span>
                </div>
              </div>
            </div>

            {/* Earnings Trend */}
            <div className="border border-[#e8e6f0]/80 rounded-2xl bg-white p-4 flex flex-col gap-4 shadow-xs">
              <h4 className="text-xs font-bold text-[#1a1a2e] pl-1">Earnings Trend</h4>

              {/* Bar Chart Flex Layout */}
              <div className="flex items-end justify-between h-32 px-1 pt-4 relative">
                {/* Background grid lines */}
                <div className="absolute inset-x-0 top-3 border-t border-[#e8e6f0]/30" />
                <div className="absolute inset-x-0 top-14 border-t border-[#e8e6f0]/30" />
                <div className="absolute inset-x-0 top-25 border-t border-[#e8e6f0]/30" />

                {/* Months */}
                {[
                  { month: 'Jan', height: '25%', active: false },
                  { month: 'Feb', height: '40%', active: false },
                  { month: 'Mar', height: '35%', active: false },
                  { month: 'Apr', height: '50%', active: false },
                  { month: 'May', height: '60%', active: false },
                  { month: 'Jun', height: '85%', active: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="h-full flex flex-col justify-end items-center flex-1 z-10"
                  >
                    {/* Bar */}
                    <div
                      className={cn(
                        'w-7.5 rounded-t-md transition-all duration-1000 ease-out',
                        item.active ? 'bg-brand-pink' : 'bg-[#fef2f6]',
                      )}
                      style={{ height: animateChart ? item.height : '0%' }}
                    />
                    {/* Label */}
                    <span className="text-[9px] font-semibold text-[#7a7a9a] mt-2 block text-center select-none">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Performance Section */}
            <div className="flex flex-col gap-3.5">
              <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider pl-1 block">
                Platform Performance
              </span>

              {/* Instagram Performance */}
              <div className="border border-[#e8e6f0]/80 bg-white rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs relative overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIcon icon="instagram" />
                      <span className="text-xs font-bold text-[#1a1a2e]">Instagram</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-brand-pink">72.4K</span>
                      <button
                        type="button"
                        onClick={() => alert('Syncing Instagram data...')}
                        className="text-[10px] font-bold text-[#5a5a7a] hover:text-[#1a1a2e] flex items-center gap-1 cursor-pointer select-none"
                      >
                        <RotateCw size={10} />
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>

                  {/* Followers Level Progress Bar */}
                  <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out bg-brand-pink"
                      style={{ width: animateChart ? '75%' : '0%' }}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-[#faf9fc] border border-[#e8e6f0]/40 rounded-xl p-3 flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#7a7a9a] font-light uppercase tracking-wider">
                      Eng. Rate
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e]">7.2%</span>
                  </div>
                  <div className="bg-[#faf9fc] border border-[#e8e6f0]/40 rounded-xl p-3 flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#7a7a9a] font-light uppercase tracking-wider">
                      Avg. Reach
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e]">140K</span>
                  </div>
                </div>
              </div>

              {/* TikTok Performance */}
              <div className="border border-[#e8e6f0]/80 bg-white rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs relative overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIcon icon="tiktok" />
                      <span className="text-xs font-bold text-[#1a1a2e]">TikTok</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-brand-pink">31.2K</span>
                      <button
                        type="button"
                        onClick={() => alert('Syncing TikTok data...')}
                        className="text-[10px] font-bold text-[#5a5a7a] hover:text-[#1a1a2e] flex items-center gap-1 cursor-pointer select-none"
                      >
                        <RotateCw size={10} />
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>

                  {/* Followers Level Progress Bar */}
                  <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out bg-black"
                      style={{ width: animateChart ? '45%' : '0%' }}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-[#faf9fc] border border-[#e8e6f0]/40 rounded-xl p-3 flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#7a7a9a] font-light uppercase tracking-wider">
                      Eng. Rate
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e]">9.1%</span>
                  </div>
                  <div className="bg-[#faf9fc] border border-[#e8e6f0]/40 rounded-xl p-3 flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#7a7a9a] font-light uppercase tracking-wider">
                      Avg. Reach
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e]">58K</span>
                  </div>
                </div>
              </div>

              {/* YouTube Performance */}
              <div className="border border-[#e8e6f0]/80 bg-white rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs relative overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIcon icon="youtube" />
                      <span className="text-xs font-bold text-[#1a1a2e]">YouTube</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-brand-pink">8.9K</span>
                      <button
                        type="button"
                        onClick={() => alert('Syncing YouTube data...')}
                        className="text-[10px] font-bold text-[#5a5a7a] hover:text-[#1a1a2e] flex items-center gap-1 cursor-pointer select-none"
                      >
                        <RotateCw size={10} />
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>

                  {/* Followers Level Progress Bar */}
                  <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out bg-[#FF0000]"
                      style={{ width: animateChart ? '25%' : '0%' }}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-[#faf9fc] border border-[#e8e6f0]/40 rounded-xl p-3 flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#7a7a9a] font-light uppercase tracking-wider">
                      Eng. Rate
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e]">4.3%</span>
                  </div>
                  <div className="bg-[#faf9fc] border border-[#e8e6f0]/40 rounded-xl p-3 flex-1 flex flex-col gap-0.5">
                    <span className="text-[9px] text-[#7a7a9a] font-light uppercase tracking-wider">
                      Avg. Reach
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e]">22K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 11. HELP & SUPPORT RESPONSIVE DRAWER ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          isHelpOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          onClick={() => setIsHelpOpen(false)}
        />

        {/* Panel Container */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-[#faf9fc] flex flex-col shadow-2xl transition-transform duration-300 ease-out',
            'md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-[480px] md:border-l md:border-[#e8e6f0] rounded-t-3xl md:rounded-none h-[92vh] md:h-full overflow-hidden',
            isHelpOpen
              ? 'translate-y-0 md:translate-x-0 md:translate-y-0'
              : 'translate-y-full md:translate-x-full md:translate-y-0',
          )}
        >
          {/* Mobile Header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#e8e6f0] bg-white md:hidden shrink-0">
            <button
              type="button"
              onClick={() => {
                if (helpStep === 'ticket' || helpStep === 'my-tickets') {
                  setHelpStep('main');
                } else {
                  setIsHelpOpen(false);
                }
              }}
              className="w-9 h-9 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#1a1a2e] active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-base font-bold text-[#1a1a2e]">
              {helpStep === 'ticket'
                ? 'Submit a Ticket'
                : helpStep === 'my-tickets'
                  ? 'My Tickets'
                  : 'Help & Support'}
            </h3>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-[#e8e6f0]/40 bg-white shrink-0">
            {helpStep === 'ticket' || helpStep === 'my-tickets' ? (
              <button
                type="button"
                onClick={() => setHelpStep('main')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#5a5a7a] hover:text-[#1a1a2e] cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <h3 className="text-base font-bold text-[#1a1a2e]">Help &amp; Support</h3>
            )}

            {(helpStep === 'ticket' || helpStep === 'my-tickets') && (
              <h3 className="text-sm font-extrabold text-[#1a1a2e]">
                {helpStep === 'ticket' ? 'Submit a ticket' : 'My Tickets'}
              </h3>
            )}

            <button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              className="text-[#7a7a9a] hover:text-[#1a1a2e] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input (Mobile Only - only visible on main help view) */}
          {helpStep === 'main' && (
            <div className="px-4 py-2 bg-white md:hidden shrink-0 border-b border-[#e8e6f0]/40">
              <div className="relative flex items-center bg-[#f4f3f6] rounded-xl px-3.5 py-2.5">
                <Search size={16} className="text-[#9a99b0] shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={helpSearchQuery}
                  onChange={(e) => setHelpSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none"
                />
                {helpSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setHelpSearchQuery('')}
                    className="text-[#9a99b0] hover:text-[#1a1a2e] shrink-0 ml-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scrollbar-thin">
            {helpStep === 'main' ? (
              <>
                {/* Contact Us Section */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider pl-1 block">
                    Contact Us
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {/* Email Card */}
                    <div
                      onClick={() => window.open('mailto:trendupp@gmail.com')}
                      className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-brand-pink/30 hover:shadow-2xs active:scale-98 transition-all cursor-pointer select-none"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#db2777] shrink-0">
                        <Mail size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-[#1a1a2e]">Email</span>
                      <span className="text-[8px] font-medium text-[#7a7a9a] leading-tight break-all">
                        trendupp@gmail.com
                      </span>
                    </div>

                    {/* Call Support Card */}
                    <div
                      onClick={() => window.open('tel:+2348000000000')}
                      className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-brand-pink/30 hover:shadow-2xs active:scale-98 transition-all cursor-pointer select-none"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed] shrink-0">
                        <Phone size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-[#1a1a2e]">Call Support</span>
                      <span className="text-[8px] font-medium text-[#7a7a9a] leading-tight">
                        Mon–Fri, 9am–6pm WAT
                      </span>
                    </div>

                    {/* Submit Ticket Card */}
                    <div
                      id="help-card-submit-ticket"
                      onClick={() => setHelpStep('ticket')}
                      className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-brand-pink/30 hover:shadow-2xs active:scale-98 transition-all cursor-pointer select-none"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] shrink-0">
                        <FileText size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-[#1a1a2e]">Submit a Ticket</span>
                      <span className="text-[8px] font-medium text-[#7a7a9a] leading-tight">
                        Response within 24 hrs
                      </span>
                    </div>

                    {/* My Tickets Card */}
                    <div
                      onClick={() => setHelpStep('my-tickets')}
                      className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-3 flex flex-col items-center text-center gap-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-brand-pink/30 hover:shadow-2xs active:scale-98 transition-all cursor-pointer select-none"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[#16a34a] shrink-0">
                        <Inbox size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-[#1a1a2e]">My Tickets</span>
                      <span className="text-[8px] font-medium text-[#7a7a9a] leading-tight">
                        Track submissions
                      </span>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider pl-1 block">
                    FAQ
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq, idx) => {
                        const isExpanded = expandedFaqIdx === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() => setExpandedFaqIdx(isExpanded ? null : idx)}
                            className="bg-white border border-[#e8e6f0]/70 rounded-xl p-3.5 flex flex-col gap-2 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors hover:bg-neutral-50/50"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[11px] font-bold text-[#1a1a2e]">{faq.q}</span>
                              <ChevronRight
                                size={14}
                                className={cn(
                                  'text-[#9a99b0] shrink-0 transition-transform duration-200',
                                  isExpanded ? 'rotate-90 text-[#1a1a2e]' : '',
                                )}
                              />
                            </div>
                            <div
                              className={cn(
                                'transition-all duration-300 ease-in-out overflow-hidden',
                                isExpanded ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0',
                              )}
                            >
                              <p className="text-[10px] text-[#5a5a7a] leading-relaxed">{faq.a}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6">
                        <span className="text-xs text-[#7a7a9a] italic">
                          No articles match your search.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enjoying Trendupp review widget */}
                <div className="bg-white border border-[#e8e6f0]/50 rounded-2xl p-5 flex flex-col items-center gap-4 text-center mt-auto shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-extrabold text-[#1a1a2e]">Enjoying Trendupp?</h4>
                    <span className="text-[10px] text-[#7a7a9a]">Your review helps us grow</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="text-[#f59e0b] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Star
                          size={20}
                          className={cn(
                            'transition-all',
                            (userRating === 0 ? true : star <= userRating)
                              ? 'fill-[#f59e0b] text-[#f59e0b]'
                              : 'text-[#e2e0e7] fill-none',
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      alert(`Redirecting to app rating... Rating: ${userRating || 5} Stars`)
                    }
                    className="w-full py-2.5 bg-brand-pink hover:bg-opacity-95 text-white rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer select-none text-center"
                  >
                    <span className="hidden md:inline">Rate us on playstore</span>
                    <span className="inline md:hidden">Rate Us on App Store</span>
                  </button>
                </div>
              </>
            ) : helpStep === 'my-tickets' ? (
              // My Tickets History View
              <div className="flex flex-col gap-4">
                <span className="text-xs text-[#7a7a9a] leading-normal pl-1 block">
                  All support tickets you have submitted.
                </span>

                {ticketsLoading ? (
                  <div className="flex flex-col gap-2.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex flex-col gap-2 animate-pulse"
                      >
                        <div className="h-3 bg-[#f4f3f6] rounded w-2/3" />
                        <div className="h-2.5 bg-[#f4f3f6] rounded w-1/2" />
                        <div className="h-2 bg-[#f4f3f6] rounded w-1/4 mt-1" />
                      </div>
                    ))}
                  </div>
                ) : !myTickets || myTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#f4f3f6] flex items-center justify-center">
                      <Inbox size={22} className="text-[#9a99b0]" />
                    </div>
                    <p className="text-xs font-semibold text-[#7a7a9a]">
                      You have no submitted tickets yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => setHelpStep('ticket')}
                      className="text-[10px] font-bold text-brand-pink hover:underline cursor-pointer"
                    >
                      Submit your first ticket →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {(myTickets as SupportTicket[]).map((t) => {
                      const statusMeta: Record<
                        string,
                        { label: string; bg: string; text: string }
                      > = {
                        open: { label: 'Open', bg: '#eff6ff', text: '#2563eb' },
                        in_progress: { label: 'In Progress', bg: '#fff7ed', text: '#ea580c' },
                        resolved: { label: 'Resolved', bg: '#f0fdf4', text: '#16a34a' },
                        closed: { label: 'Closed', bg: '#f4f3f6', text: '#7a7a9a' },
                      };
                      const s = statusMeta[t.status] ?? {
                        label: t.status,
                        bg: '#f4f3f6',
                        text: '#7a7a9a',
                      };
                      return (
                        <div
                          key={t.id}
                          className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex flex-col gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold text-[#1a1a2e] leading-snug flex-1">
                              {t.subject}
                            </span>
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                              style={{ backgroundColor: s.bg, color: s.text }}
                            >
                              {s.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#7a7a9a]">{t.category}</span>
                          <span className="text-[9px] text-[#9a99b0] mt-0.5">
                            {new Date(t.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Submit a Ticket Form View
              <div className="flex flex-col gap-5">
                <span className="text-xs text-[#7a7a9a] leading-normal pl-1 block">
                  {"Describe your issue below. We'll get back to you as soon as possible."}
                </span>

                {/* Form Container */}
                <div className="border border-brand-pink/20 rounded-3xl p-5 md:p-6 bg-white flex flex-col gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider pl-1">
                      Issue Category
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="w-full bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#1a1a2e] focus:outline-none focus:border-brand-pink transition-all select-none cursor-pointer"
                      >
                        <span
                          className={
                            ticketCategory === 'Select a category'
                              ? 'text-[#9a99b0]'
                              : 'text-[#1a1a2e]'
                          }
                        >
                          {ticketCategory}
                        </span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'text-[#9a99b0] transition-transform duration-200',
                            isCategoryDropdownOpen ? 'rotate-180 text-[#1a1a2e]' : '',
                          )}
                        />
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#e8e6f0] rounded-xl shadow-lg z-50 overflow-hidden">
                          {(serverCategories
                            ? serverCategories.map((c) =>
                                typeof c === 'string'
                                  ? { id: '', name: c }
                                  : { id: c.id, name: c.name },
                              )
                            : [
                                { id: '', name: 'Campaign Dispute' },
                                { id: '', name: 'Payment & Wallet' },
                                { id: '', name: 'Account Verification' },
                                { id: '', name: 'Technical Issue' },
                                { id: '', name: 'Other' },
                              ]
                          ).map((cat) => (
                            <button
                              key={cat.name}
                              type="button"
                              onClick={() => {
                                setTicketCategory(cat.name);
                                setTicketCategoryId(cat.id || null);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-xs text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors cursor-pointer"
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider pl-1">
                      Subject
                    </label>
                    <input
                      id="ticket-subject-input"
                      type="text"
                      placeholder="Brief summary of your issue"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:border-brand-pink transition-all"
                    />
                  </div>

                  {/* Description Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider pl-1">
                      Description
                    </label>
                    <textarea
                      id="ticket-description-input"
                      placeholder="Please provide as much detail as possible to help us resolve your issue quickly."
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:border-brand-pink transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Attachments Dropzone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#1a1a2e] uppercase tracking-wider pl-1">
                      Attachments (Optional)
                    </label>
                    <input
                      type="file"
                      id="ticket-file-input"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => document.getElementById('ticket-file-input')?.click()}
                      className="border-dashed border-2 border-brand-pink/30 rounded-2xl p-6 bg-white hover:bg-rose-50/20 active:scale-[0.99] transition-all cursor-pointer flex flex-col items-center gap-2 select-none"
                    >
                      <UploadCloud size={24} className="text-brand-pink" />
                      <span className="text-xs font-bold text-[#1a1a2e]">Tap to upload files</span>
                      <span className="text-[10px] text-[#7a7a9a]">PNG, JPG, PDF up to 10MB</span>
                    </div>

                    {/* Display Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2">
                        <span className="text-[9px] font-bold text-[#7a7a9a] uppercase tracking-wider pl-1">
                          Attached Files ({uploadedFiles.length})
                        </span>
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-rose-50/20 border border-brand-pink/10 rounded-xl px-3.5 py-2.5 text-[10px] text-[#1a1a2e] shadow-2xs"
                          >
                            <span className="font-semibold truncate max-w-[80%]">{file.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFiles(uploadedFiles.filter((f) => f !== file));
                              }}
                              className="text-[#ef4444] hover:text-red-700 font-bold active:scale-95 transition-transform"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="button"
                  disabled={submitTicketMutation.isPending}
                  onClick={() => {
                    if (ticketCategory === 'Select a category') {
                      toast.error('Please select an issue category.');
                      return;
                    }
                    if (!ticketSubject.trim()) {
                      toast.error('Please enter a subject.');
                      return;
                    }
                    if (!ticketDescription.trim()) {
                      toast.error('Please provide a description.');
                      return;
                    }

                    const fd = new FormData();
                    // API requires issueCategoryId (UUID); fall back to name if no UUID yet
                    fd.append('issueCategoryId', ticketCategoryId ?? ticketCategory);
                    fd.append('subject', ticketSubject.trim());
                    fd.append('description', ticketDescription.trim());
                    // Only the first file is sent (API accepts a single attachment)
                    if (uploadedFiles.length > 0) {
                      fd.append('attachment', uploadedFiles[0]);
                    }

                    submitTicketMutation.mutate(fd, {
                      onSuccess: () => {
                        // Reset form & return to main help view
                        setTicketCategory('Select a category');
                        setTicketCategoryId(null);
                        setTicketSubject('');
                        setTicketDescription('');
                        setUploadedFiles([]);
                        setHelpStep('main');
                      },
                    });
                  }}
                  className="w-full py-3 bg-brand-pink hover:bg-opacity-95 text-white rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer select-none text-center disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitTicketMutation.isPending ? (
                    <>
                      <RotateCw className="animate-spin" size={12} />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
