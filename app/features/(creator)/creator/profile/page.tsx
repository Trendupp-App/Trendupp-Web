'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

function PlatformIcon({ icon }: { icon: Platform['icon'] }) {
  if (icon === 'instagram') return <InstagramIcon />;
  if (icon === 'tiktok') return <TikTokIcon />;
  if (icon === 'youtube') return <YouTubeIcon />;
  return <TwitterIcon />;
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

export default function CreatorProfilePage() {
  // States
  const [profile, setProfile] = useState<CreatorProfile>(INITIAL_PROFILE);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'settings'>('portfolio');

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

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  // Settings Edit State (Temporary Form Buffer)
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editNicheInput, setEditNicheInput] = useState('');
  const [editNiches, setEditNiches] = useState<string[]>(profile.niches);
  const [editPlatforms, setEditPlatforms] = useState<Platform[]>(profile.platforms);

  // Action: Add Niche Tag
  const handleAddNiche = () => {
    if (editNicheInput.trim() && !editNiches.includes(editNicheInput.trim())) {
      setEditNiches([...editNiches, editNicheInput.trim()]);
      setEditNicheInput('');
    }
  };

  // Action: Remove Niche Tag
  const handleRemoveNiche = (index: number) => {
    setEditNiches(editNiches.filter((_, i) => i !== index));
  };

  // Action: Toggle Connected Platform
  const handleTogglePlatform = (idx: number) => {
    const updated = [...editPlatforms];
    updated[idx].connected = !updated[idx].connected;
    if (!updated[idx].connected) {
      updated[idx].followers = 'Not connected';
    } else {
      updated[idx].followers =
        updated[idx].name === 'Instagram'
          ? '72.4K'
          : updated[idx].name === 'TikTok'
            ? '31.2K'
            : updated[idx].name === 'YouTube'
              ? '8.9K'
              : '5.0K';
    }
    setEditPlatforms(updated);
  };

  // Action: Edit Followers Value
  const handleFollowersChange = (idx: number, val: string) => {
    const updated = [...editPlatforms];
    updated[idx].followers = val;
    setEditPlatforms(updated);
  };

  // Action: Save Profile Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: editName,
      bio: editBio,
      location: editLocation,
      niches: editNiches,
      platforms: editPlatforms,
    });
    setActiveTab('portfolio');
  };

  // Action: Reset Settings Form
  const handleCancelSettings = () => {
    setEditName(profile.name);
    setEditBio(profile.bio);
    setEditLocation(profile.location);
    setEditNiches(profile.niches);
    setEditPlatforms(profile.platforms);
    setActiveTab('portfolio');
  };

  // Action: Add Portfolio Item
  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    let finalImageUrl = newImageUrl.trim();
    if (selectedPresetIndex !== null) {
      finalImageUrl = PORTFOLIO_PRESETS[selectedPresetIndex].url;
    }

    if (!finalImageUrl) {
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
    setNewImageUrl('');
    setSelectedPresetIndex(null);
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
            onClick={() => setActiveTab('settings')}
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
              onClick={() => setActiveTab('settings')}
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
              if (tab === 'settings') {
                // Initialize settings form buffer
                setEditName(profile.name);
                setEditBio(profile.bio);
                setEditLocation(profile.location);
                setEditNiches(profile.niches);
                setEditPlatforms(profile.platforms);
              }
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
          <form onSubmit={handleSaveSettings} className="flex flex-col gap-6" id="settings-form">
            <h4 className="text-sm font-bold text-[#1a1a2e]">Edit Profile Settings</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Profile Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider"
                  htmlFor="input-name"
                >
                  Name
                </label>
                <input
                  id="input-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                  required
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider"
                  htmlFor="input-location"
                >
                  Location
                </label>
                <input
                  id="input-location"
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-medium"
                  required
                />
              </div>

              {/* Bio Statement */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label
                  className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider"
                  htmlFor="input-bio"
                >
                  Bio Statement
                </label>
                <textarea
                  id="input-bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full h-24 border border-[#e8e6f0] rounded-xl p-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 font-light resize-none leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Niche Tag Management */}
            <div className="flex flex-col gap-2 border-t border-[#e8e6f0]/40 pt-5">
              <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Creator Niches
              </label>
              <div className="flex gap-2">
                <input
                  id="input-niche-tag"
                  type="text"
                  placeholder="e.g. Cooking, Travel, Music"
                  value={editNicheInput}
                  onChange={(e) => setEditNicheInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNiche())}
                  className="flex-1 h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
                />
                <button
                  type="button"
                  onClick={handleAddNiche}
                  className="px-4 bg-[#040039] hover:bg-[#130f48] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors active:scale-95"
                >
                  Add
                </button>
              </div>

              {/* Existing tags layout */}
              <div className="flex flex-wrap gap-2 mt-1">
                {editNiches.map((niche, i) => (
                  <span
                    key={niche}
                    className="inline-flex items-center gap-1.5 bg-brand-pink-light text-brand-pink font-semibold text-[10px] px-3 py-1 rounded-full border border-brand-pink/15"
                  >
                    <span>{niche}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNiche(i)}
                      className="hover:bg-brand-pink/10 rounded-full w-3.5 h-3.5 flex items-center justify-center transition-colors cursor-pointer text-xs"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Platforms connection Management */}
            <div className="flex flex-col gap-3 border-t border-[#e8e6f0]/40 pt-5">
              <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Configure Platforms
              </label>
              <div className="flex flex-col gap-3">
                {editPlatforms.map((plat, idx) => (
                  <div
                    key={plat.name}
                    className="flex items-center justify-between border border-[#e8e6f0]/50 rounded-xl p-3 bg-[#faf9fc]/30"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon icon={plat.icon} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1a1a2e]">{plat.name}</span>
                        <span className="text-[10px] text-[#7a7a9a]">@{plat.handle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Connection Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleTogglePlatform(idx)}
                        className={cn(
                          'w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer outline-none relative shrink-0',
                          plat.connected ? 'bg-[#10b981]' : 'bg-[#e8e6f0]',
                        )}
                      >
                        <div
                          className={cn(
                            'w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-xs',
                            plat.connected ? 'translate-x-4.5' : 'translate-x-0',
                          )}
                        />
                      </button>

                      {/* Followers count editor */}
                      {plat.connected && (
                        <input
                          type="text"
                          value={plat.followers}
                          onChange={(e) => handleFollowersChange(idx, e.target.value)}
                          className="w-20 h-8 border border-[#e8e6f0] rounded-lg px-2 text-center text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
                          title="Followers count"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center gap-3 border-t border-[#e8e6f0]/40 pt-5">
              <button
                type="submit"
                id="btn-save-settings"
                className="flex-1 py-3 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-colors text-center"
              >
                Save Changes
              </button>
              <button
                type="button"
                id="btn-cancel-settings"
                onClick={handleCancelSettings}
                className="flex-1 py-3 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-[#7a7a9a] rounded-2xl text-xs font-bold cursor-pointer active:scale-98 transition-colors text-center"
              >
                Cancel
              </button>
            </div>
          </form>
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

            {/* Presets Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Choose a Preset Image
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PORTFOLIO_PRESETS.map((preset, idx) => {
                  const isSelected = selectedPresetIndex === idx;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSelectedPresetIndex(idx);
                        setNewImageUrl('');
                      }}
                      className={cn(
                        'relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                        isSelected
                          ? 'border-brand-pink scale-95 shadow-md'
                          : 'border-[#e8e6f0] hover:border-brand-pink/30',
                      )}
                    >
                      <Image src={preset.url} alt={preset.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-1">
                        <span className="text-[9px] font-bold text-white text-center leading-tight truncate w-full">
                          {preset.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-brand-pink flex items-center justify-center">
                          <Check size={9} className="stroke-white stroke-[3.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Image URL Option */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider"
                htmlFor="input-modal-url"
              >
                Or Custom Image URL
              </label>
              <input
                id="input-modal-url"
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={newImageUrl}
                onChange={(e) => {
                  setNewImageUrl(e.target.value);
                  setSelectedPresetIndex(null);
                }}
                className="w-full h-10 border border-[#e8e6f0] rounded-xl px-3.5 text-xs text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
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
                  setNewImageUrl('');
                  setSelectedPresetIndex(null);
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
                Select at least One brand to submit a request
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
                  Select at least One brand to submit a request
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
    </div>
  );
}
