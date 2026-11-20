import React from 'react';
import { Link } from 'react-router-dom';
import { ColoringSheet } from '../types';
import { PaintBucket, Printer, ShieldCheck, Sparkles, Eye } from 'lucide-react';

interface Props {
  sheet: ColoringSheet;
  onColorOnline: (sheet: ColoringSheet) => void;
  onPrint: (sheet: ColoringSheet) => void;
  onCommercialLicense: (sheet: ColoringSheet) => void;
}

export const SheetCard: React.FC<Props> = ({
  sheet,
  onColorOnline,
  onPrint,
  onCommercialLicense,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border-2 border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      {/* Thumbnail Area with Link */}
      <div className="relative w-full aspect-[4/3] bg-amber-50/50 rounded-2xl overflow-hidden mb-3.5 border border-slate-100 flex items-center justify-center p-2 group-hover:bg-amber-100/40 transition">
        {sheet.colorGuide ? (
          <Link to={`/sheet/${sheet.id}`} className="w-full h-full flex gap-1.5 items-center justify-center">
            <div className="w-1/2 h-full relative rounded-xl overflow-hidden border border-indigo-100">
              <span className="absolute top-1 left-1 bg-indigo-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                Guide
              </span>
              <img
                src={sheet.colorGuide}
                alt={`${sheet.title} color reference`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="w-1/2 h-full relative rounded-xl overflow-hidden border border-rose-100 bg-white">
              <span className="absolute top-1 right-1 bg-rose-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                Color!
              </span>
              <img
                src={sheet.outline}
                alt={`${sheet.title} outline`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </Link>
        ) : (
          <Link to={`/sheet/${sheet.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={sheet.outline}
              alt={sheet.title}
              className="w-full h-full object-contain filter group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
          </Link>
        )}

        {/* Exclusive Badge */}
        {sheet.isExclusive && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 pointer-events-none">
            <Sparkles size={11} />
            <span>Storybook Edition</span>
          </div>
        )}

        {/* Quick Online Color Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px] pointer-events-none">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onColorOnline(sheet);
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition transform hover:scale-105 pointer-events-auto"
          >
            <PaintBucket size={15} />
            <span>Color Online</span>
          </button>
        </div>
      </div>

      {/* Info Body */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <Link
            to={`/category/${sheet.slug}`}
            className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full hover:bg-indigo-100 transition"
          >
            {sheet.category}
          </Link>
          <span className="text-[10px] font-bold text-slate-400">
            {sheet.age}
          </span>
        </div>

        <Link to={`/sheet/${sheet.id}`}>
          <h3 className="font-heading text-base font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition">
            {sheet.title}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {sheet.description}
        </p>

        {/* Crayon Palette Swatches */}
        <div className="mb-3.5 bg-slate-50 rounded-xl p-2 border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between">
            <span>Crayon Palette:</span>
            <span className="text-[9px] text-indigo-600 font-bold">{sheet.difficulty}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {sheet.crayonGuide.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="w-4 h-4 rounded-full border border-white shadow-xs inline-block"
                style={{ backgroundColor: c.hex }}
                title={`${c.name} - ${c.usage}`}
              />
            ))}
            <span className="text-[10px] text-slate-500 font-medium truncate ml-1">
              {sheet.crayonGuide[0]?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onColorOnline(sheet)}
            className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <PaintBucket size={14} />
            <span>Color Online</span>
          </button>

          <Link
            to={`/sheet/${sheet.id}`}
            className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
          >
            <Printer size={14} />
            <span>Print PDF</span>
          </Link>
        </div>

        <button
          onClick={() => onCommercialLicense(sheet)}
          className="w-full py-1 text-[11px] text-slate-400 hover:text-amber-700 flex items-center justify-center gap-1 font-semibold transition"
          title="Buy Commercial Rights for KDP, Etsy or Daycares"
        >
          <ShieldCheck size={12} className="text-amber-500" />
          <span>Need Commercial License? ($9.99)</span>
        </button>
      </div>
    </div>
  );
};
