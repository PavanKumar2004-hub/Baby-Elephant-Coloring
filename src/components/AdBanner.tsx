import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  onAdClick?: () => void;
}

export const AdBanner: React.FC<Props> = ({ onAdClick }) => {
  return (
    <div className="w-full my-8 bg-gradient-to-r from-amber-50 via-indigo-50 to-rose-50 rounded-3xl p-4 sm:p-5 border-2 border-dashed border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-2xl shadow-sm flex-shrink-0">
          🎨
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Family-Safe Sponsor
            </span>
            <span className="text-[10px] text-slate-400">COPPA Certified Art Supplies</span>
          </div>
          <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900">
            Jumbo Non-Toxic Washable Crayons & Watercolor Sets
          </h4>
          <p className="text-xs text-slate-500">
            Keep little hands creative with vibrant, easily washable wax crayons designed for ages 2+
          </p>
        </div>
      </div>

      <button
        onClick={onAdClick}
        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 flex-shrink-0 transition"
      >
        <span>Explore Collection</span>
        <ExternalLink size={14} className="text-amber-400" />
      </button>
    </div>
  );
};
