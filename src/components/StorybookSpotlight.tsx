import React from 'react';
import { ColoringSheet } from '../types';
import { BookOpen, Sparkles, Printer, PaintBucket, ShieldCheck } from 'lucide-react';

interface Props {
  storybookSheets: ColoringSheet[];
  onColorSheet: (sheet: ColoringSheet) => void;
  onPrintBook: () => void;
  onCommercialLicense: (sheet: ColoringSheet) => void;
}

export const StorybookSpotlight: React.FC<Props> = ({
  storybookSheets,
  onColorSheet,
  onPrintBook,
  onCommercialLicense,
}) => {
  return (
    <section className="my-10 bg-gradient-to-br from-indigo-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-xl relative overflow-hidden">
      {/* Decorative Stamp */}
      <div className="absolute top-4 right-4 bg-indigo-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
        Featured Publication
      </div>

      <div className="max-w-3xl mb-6">
        <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider mb-1">
          <BookOpen size={16} />
          <span>Baby Elephant Books • Official Release</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
          Tom & Jerry Coloring Book
          <span className="block text-indigo-600 text-lg sm:text-xl font-bold mt-0.5">
            Side-by-Side Color & Learn Edition
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Filled color picture on the left side and matching black-and-white outline on the right side —
          crafted to nurture focus, color recognition, and hand-eye coordination while sparking storytelling!
        </p>
      </div>

      {/* 4 Storybook Scenes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {storybookSheets.map((s, idx) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-3 border-2 border-indigo-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden mb-2.5 flex items-center justify-center p-1">
              <div className="w-full h-full flex gap-1">
                <div className="w-1/2 h-full rounded-lg overflow-hidden border border-indigo-100 relative">
                  <span className="absolute top-0.5 left-0.5 bg-indigo-600 text-white text-[8px] font-bold px-1 rounded">
                    Guide
                  </span>
                  <img src={s.colorGuide} alt="Color Guide" className="w-full h-full object-contain" />
                </div>
                <div className="w-1/2 h-full rounded-lg overflow-hidden border border-rose-100 bg-white relative">
                  <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[8px] font-bold px-1 rounded">
                    Color!
                  </span>
                  <img src={s.outline} alt="Line art" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-indigo-600 uppercase">
                Scene {idx + 1}
              </div>
              <h4 className="font-heading font-bold text-xs text-slate-900 line-clamp-1 mb-1">
                {s.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                {s.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <button
                onClick={() => onColorSheet(s)}
                className="flex-1 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-[11px] flex items-center justify-center gap-1"
              >
                <PaintBucket size={12} />
                <span>Color</span>
              </button>
              <button
                onClick={() => onCommercialLicense(s)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px]"
                title="Commercial License"
              >
                <ShieldCheck size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Storybook Actions */}
      <div className="bg-white/80 rounded-2xl p-4 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-800">Crayon Guide Included:</span> Slate Blue-Grey, Warm Brown, Sunny Yellow & Berry Red.
          Free for personal and educational use!
        </div>

        <button
          onClick={onPrintBook}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 flex-shrink-0 transition"
        >
          <Printer size={16} />
          <span>Download Complete 7-Page Book PDF (Free)</span>
        </button>
      </div>
    </section>
  );
};
