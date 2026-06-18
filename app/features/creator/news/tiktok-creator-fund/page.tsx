'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Share2, Bookmark, ExternalLink } from 'lucide-react';

export default function TikTokCreatorFundPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/features/creator/dashboard');
  };

  const moreStories = [
    {
      id: 2,
      title: 'Instagram Collab posts now monetisable in Nigeria',
      category: 'Platform Update',
      categoryColor: 'bg-[#eff6ff] text-[#2563eb]',
      publishedAt: '5h ago',
      image: '/dashboard/bin.png',
    },
    {
      id: 3,
      title: 'Top 10 Nigerian brands increasing influencer budgets',
      category: 'Brands',
      categoryColor: 'bg-[#faf0ff] text-[#a855f7]',
      publishedAt: '1d ago',
      image: '/dashboard/competed img.png',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none sm:max-w-4xl lg:max-w-5xl mx-auto bg-white sm:rounded-b-[32px] sm:rounded-t-none overflow-hidden sm:shadow-sm sm:border-x sm:border-b sm:border-[#e8e6f0]/45">
      {/* Singer Banner Section with Top Overlays */}
      <div className="relative w-full h-[320px] md:h-[400px] shrink-0 bg-zinc-100 overflow-hidden">
        <Image
          src="/dashboard/tiktok_news_banner.png"
          alt="TikTok Nigeria launches creator fund"
          fill
          className="object-cover"
          priority
        />
        {/* Navigation Overlays */}
        <div className="absolute top-5 inset-x-5 flex justify-between items-center z-20">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Share & Bookmark Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
              aria-label="Share article"
            >
              <Share2 size={18} />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
              aria-label="Bookmark article"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        {/* Industry Tag Overlay */}
        <div className="absolute bottom-5 left-5 bg-brand-pink text-white text-[11px] font-bold px-3 py-1.5 rounded-xl z-20">
          Industry
        </div>

        {/* Dark overlay vignette at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none z-10" />
      </div>

      {/* Main Content Area */}
      <div className="px-5 md:px-8 flex flex-col gap-6">
        {/* Title & Author Info Area */}
        <div className="flex flex-col gap-4">
          <h1 className="text-[22px] sm:text-2xl lg:text-3xl font-bold text-[#1a1a2e] leading-snug tracking-tight">
            TikTok Nigeria launches creator fund — ₦500M available for Q3 2026
          </h1>

          {/* Publisher row */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#e8e6f0]/40">
            <div className="w-9 h-9 rounded-full bg-[#fde8f0] text-brand-pink font-bold flex items-center justify-center text-[11px]">
              TA
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Trendupp Africa</span>
              <span className="text-[10px] sm:text-xs text-[#9a99b0] font-light mt-0.5">
                2 hours ago &nbsp;•&nbsp; 4 min read
              </span>
            </div>
          </div>
        </div>

        {/* Responsive Dual-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
          {/* Left Column: Article Body (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Intro Text */}
            <p className="text-[13px] sm:text-sm text-[#3a3a54] font-light leading-relaxed">
              TikTok has officially announced a ₦500 million creator fund targeted exclusively at
              Nigerian content creators for the third quarter of 2026. The announcement, made at a
              press event in Lagos, marks the platform&apos;s most significant investment in the
              Nigerian creator economy to date.
            </p>

            {/* Tiers Detail Text */}
            <p className="text-[13px] sm:text-sm text-[#3a3a54] font-light leading-relaxed">
              The fund will be distributed across three tiers — Nano, Micro, and Macro creators —
              with individual payouts ranging from ₦50,000 to ₦5 million depending on follower
              count, engagement rate, and content quality scores.
            </p>

            {/* Who Qualifies Section */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1a1a2e]">Who qualifies?</h3>
              <p className="text-[13px] sm:text-sm text-[#3a3a54] font-light leading-relaxed">
                To qualify, creators must have a Nigerian account with a minimum of 1,000 followers,
                an average of 10,000 views per video over the last 30 days, and an account in good
                standing with no community guideline violations.
              </p>
              <p className="text-[13px] sm:text-sm text-[#3a3a54] font-light leading-relaxed mt-1">
                Applications will open on July 1, 2026 via the TikTok Creator Marketplace portal.
                Creators will be notified of their eligibility within 5 business days of applying.
              </p>
            </div>

            {/* What Trendupp creators need to know Section */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1a1a2e]">
                What Trendupp creators need to know
              </h3>
              <p className="text-[13px] sm:text-sm text-[#3a3a54] font-light leading-relaxed">
                For creators on Trendupp, this fund is separate from campaign earnings. Brand
                campaigns on Trendupp remain the highest-paying opportunity per post, but the TikTok
                fund provides a reliable monthly baseline income for creators who maintain
                consistent output.
              </p>
            </div>

            {/* Category tags */}
            <div className="flex flex-wrap gap-2 mt-3 pb-2">
              {['TikTok', 'Creator Fund', 'Nigeria', 'Monetization'].map((tag) => (
                <span
                  key={tag}
                  className="bg-[#f0edf7]/65 text-[#5a5a7a] text-[10px] sm:text-xs font-semibold px-4 py-2 rounded-2xl"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Read Full Story Action Button */}
            <button className="w-full flex items-center justify-center gap-2 border border-[#e8e6f0] hover:border-brand-pink bg-white hover:bg-brand-pink/5 text-[#2d2d44] hover:text-brand-pink py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 mt-2 cursor-pointer">
              <ExternalLink size={16} />
              <span>Read full story on Trendupp Africa</span>
            </button>
          </div>

          {/* Right Column: Sidebar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* How Trendupp Works Card */}
            <div className="bg-[#f4f3f6]/40 border border-[#e8e6f0]/40 rounded-3xl p-5 flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-bold text-[#1a1a2e]">How Trendupp Works</h4>

              {/* Vertical Timeline */}
              <div className="flex flex-col">
                {/* Step 1 */}
                <div className="relative flex gap-4 pb-6">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#0000d8] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div className="w-[1.5px] bg-[#e8e6f0] flex-1 my-1.5" />
                  </div>
                  <div className="pt-0.5">
                    <h5 className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Apply</h5>
                    <p className="text-[11px] sm:text-xs text-[#7a7a9a] font-light mt-0.5">
                      Send your application to campaigns that match your niche.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4 pb-6">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#0000d8] text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div className="w-[1.5px] bg-[#e8e6f0] flex-1 my-1.5" />
                  </div>
                  <div className="pt-0.5">
                    <h5 className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Create</h5>
                    <p className="text-[11px] sm:text-xs text-[#7a7a9a] font-light mt-0.5">
                      Produce content for the brand following their brief and guidelines.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#0000d8] text-white flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <h5 className="text-xs sm:text-sm font-bold text-[#1a1a2e]">Get Paid</h5>
                    <p className="text-[11px] sm:text-xs text-[#7a7a9a] font-light mt-0.5">
                      Earn guaranteed payments via escrow — funds secured upfront.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* More Stories Feed */}
            <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-[#e8e6f0]/40 lg:border-none lg:pt-0 lg:mt-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1a1a2e] tracking-tight">More Stories</h3>
                <button className="flex items-center gap-0.5 text-xs font-semibold text-brand-pink hover:underline cursor-pointer">
                  <span>All news</span>
                  <span className="text-[10px] font-bold">&gt;</span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {moreStories.map((news) => (
                  <div
                    key={news.id}
                    className="bg-[#faf9fc] border border-[#e8e6f0]/45 rounded-3xl p-3 flex flex-row gap-4 items-center hover:shadow-[0_4px_20px_rgba(4,0,57,0.03)] hover:bg-white transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                      <Image src={news.image} alt={news.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full w-fit ${news.categoryColor}`}
                      >
                        {news.category}
                      </span>
                      <h5 className="text-xs font-bold text-[#1a1a2e] leading-snug line-clamp-2 mt-1.5 group-hover:text-brand-pink transition-colors">
                        {news.title}
                      </h5>
                      <span className="text-[10px] text-[#9a99b0] font-light mt-1">
                        {news.publishedAt}
                      </span>
                    </div>
                    <div className="p-2 text-[#9a99b0] group-hover:text-brand-pink transition-colors shrink-0">
                      <ExternalLink size={15} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
