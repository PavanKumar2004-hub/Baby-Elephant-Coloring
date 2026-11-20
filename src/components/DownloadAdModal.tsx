import React, { useState, useEffect } from 'react';
import { Download, Sparkles, ExternalLink, X, CheckCircle2, Gift } from 'lucide-react';

interface Props {
  title: string;
  onConfirmDownload: () => void;
  onClose: () => void;
  onAdImpression?: () => void;
  onAdClick?: () => void;
}

const SPONSORS = [
  {
    name: 'Crayola Ultra-Clean Washable Crayons',
    tagline: 'Vibrant, non-toxic colors that easily wash off skin, clothing & walls!',
    cta: 'Special 35% Family Discount',
    badge: 'COPPA Certified Partner',
    icon: '🖍️',
    rating: '4.9 ★★★★★ (12,400+ reviews)',
    bg: 'from-amber-500 via-orange-500 to-rose-500'
  },
  {
    name: 'Highlights Little Artist Story & Sticker Club',
    tagline: 'Monthly creative art, puzzles, and hidden picture activity boxes for ages 2–8.',
    cta: 'Get First Box for $1.99',
    badge: 'Award-Winning Educational Toy',
    icon: '📦',
    rating: '4.8 ★★★★★ (8,900+ parents)',
    bg: 'from-indigo-600 via-purple-600 to-pink-500'
  },
  {
    name: 'Melissa & Doug Water Wow! Mess-Free Books',
    tagline: 'Reusable water-reveal painting pads. Never messy, reusable 100+ times!',
    cta: 'Explore 3-Pack Bundle',
    badge: 'Family Art Favorite',
    icon: '🎨',
    rating: '5.0 ★★★★★ (24,000+ reviews)',
    bg: 'from-teal-500 via-emerald-600 to-cyan-600'
  }
];

export const DownloadAdModal: React.FC<Props> = ({
  title,
  onConfirmDownload,
  onClose,
  onAdImpression,
  onAdClick,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [sponsor] = useState(() => SPONSORS[Math.floor(Math.random() * SPONSORS.length)]);

  useEffect(() => {
    onAdImpression?.();
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAdImpression]);

  const handleDownloadNow = () => {
    onConfirmDownload();
    onClose();
  };

  const handleSponsorClick = () => {
    onAdClick?.();
    window.open('https://amazon.com', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative text-center animate-jelly">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
        >
          <X size={18} />
        </button>

        {/* Top Status */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow">
          <Sparkles size={28} className="animate-spin text-amber-500" />
        </div>

        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 mb-1">
          Preparing Your Free Printable PDF!
        </h3>
        <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
          {title} • 100% Free for Family & Classroom Non-Commercial Use
        </p>

        {/* Countdown Progress */}
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-5 flex items-center justify-between text-xs font-bold text-amber-900">
          <span>{countdown > 0 ? `Your download starts in ${countdown}s...` : 'Your PDF is ready!'}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-700 font-extrabold">Instant Ink-Saver Format</span>
          </div>
        </div>

        {/* Family Sponsor Ad Box (Generates Revenue!) */}
        <div className="rounded-2xl border-2 border-slate-200 p-4 text-left shadow-sm mb-6 bg-gradient-to-br from-slate-50 to-amber-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              {sponsor.badge}
            </span>
            <span className="text-[10px] text-slate-400">Sponsored Family Partner</span>
          </div>

          <div className="flex items-start gap-3 my-2">
            <div className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-slate-100">
              {sponsor.icon}
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900 leading-tight">
                {sponsor.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {sponsor.tagline}
              </p>
              <div className="text-[11px] text-amber-600 font-bold mt-1">
                {sponsor.rating}
              </div>
            </div>
          </div>

          <button
            onClick={handleSponsorClick}
            className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
          >
            <span>{sponsor.cta}</span>
            <ExternalLink size={13} className="text-amber-400" />
          </button>
        </div>

        {/* Download Trigger */}
        <button
          onClick={handleDownloadNow}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-xl bubbly-btn flex items-center justify-center gap-2"
        >
          <Download size={18} />
          <span>Download & Print PDF Now</span>
        </button>

        <p className="text-[10px] text-slate-400 mt-3">
          Sponsored ads keep all 100+ coloring books 100% free forever for kids and teachers worldwide.
        </p>
      </div>
    </div>
  );
};
