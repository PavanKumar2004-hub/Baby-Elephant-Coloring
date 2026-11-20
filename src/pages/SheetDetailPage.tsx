import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ColoringSheet } from '../types';
import { generateSingleSheetPDF, generateClassroomSetPDF } from '../utils/pdfGenerator';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  PaintBucket,
  Printer,
  Download,
  Scissors,
  ShieldCheck,
  SplitSquareVertical,
  ChevronRight,
  Sparkles,
  BookOpen,
  Award,
  Check,
  ArrowLeft
} from 'lucide-react';

interface Props {
  sheets: ColoringSheet[];
  onColorOnline: (sheet: ColoringSheet) => void;
  onCommercialLicense: (sheet: ColoringSheet) => void;
}

export const SheetDetailPage: React.FC<Props> = ({
  sheets,
  onColorOnline,
  onCommercialLicense,
}) => {
  const { id } = useParams<{ id: string }>();
  const [showColorGuide, setShowColorGuide] = useState<boolean>(true);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  const sheet = useMemo(() => {
    return sheets.find((s) => s.id === id) || sheets[0];
  }, [sheets, id]);

  const relatedSheets = useMemo(() => {
    return sheets.filter((s) => s.slug === sheet.slug && s.id !== sheet.id).slice(0, 4);
  }, [sheets, sheet]);

  const handlePrintSingle = async () => {
    setIsPrinting(true);
    sound.playFanfare();
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    await generateSingleSheetPDF(sheet, showColorGuide);
    setIsPrinting(false);
  };

  const handlePrintClassroom = async () => {
    setIsPrinting(true);
    sound.playFanfare();
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    await generateClassroomSetPDF(sheet);
    setIsPrinting(false);
  };

  if (!sheet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Drawing not found</h2>
        <Link to="/" className="text-indigo-600 font-bold underline mt-2 inline-block">Return home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition">Home</Link>
        <ChevronRight size={13} className="text-slate-400" />
        <Link to={`/category/${sheet.slug}`} className="hover:text-slate-900 transition">{sheet.category}</Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="font-bold text-slate-900 truncate">{sheet.title}</span>
      </nav>

      {/* Main Sheet Card with Side-by-Side Viewer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/90 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Visual Viewer (Col 7) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-[#FAF8F5] rounded-2xl p-4 border-2 border-slate-200/80 shadow-inner flex items-center justify-center min-h-[420px]">
            {sheet.colorGuide && showColorGuide ? (
              // Side-by-Side Dual Spread
              <div className="w-full grid grid-cols-2 gap-3 items-center">
                <div className="bg-white p-2 rounded-xl shadow border border-indigo-100 flex flex-col items-center">
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 uppercase">
                    Color Reference Guide
                  </span>
                  <img
                    src={sheet.colorGuide}
                    alt={`${sheet.title} Finished Color`}
                    className="max-h-[360px] w-auto object-contain rounded-lg"
                  />
                </div>
                <div className="bg-white p-2 rounded-xl shadow border border-rose-100 flex flex-col items-center">
                  <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full mb-1 uppercase">
                    Your Turn to Color!
                  </span>
                  <img
                    src={sheet.outline}
                    alt={`${sheet.title} Printable Outline`}
                    className="max-h-[360px] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            ) : (
              // Full large outline
              <img
                src={sheet.outline}
                alt={sheet.title}
                className="max-h-[400px] w-auto object-contain"
              />
            )}
          </div>

          {/* Toggle Side-by-Side Button */}
          {sheet.colorGuide && (
            <button
              onClick={() => setShowColorGuide(!showColorGuide)}
              className="mt-3 text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-100 transition"
            >
              <SplitSquareVertical size={15} />
              <span>{showColorGuide ? 'Switch to Full Page Line Art' : 'Show Side-by-Side Color Guide'}</span>
            </button>
          )}
        </div>

        {/* Right Info & Actions (Col 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase">
                {sheet.category}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {sheet.age}
              </span>
              {sheet.isExclusive && (
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                  Storybook Series
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight mb-2">
              {sheet.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {sheet.description}
            </p>

            {/* Little Artist's Crayon Guide Swatches */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 mb-6">
              <div className="text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <span>Little Artist's Crayon Guide</span>
              </div>
              <div className="space-y-1.5">
                {sheet.crayonGuide.map((cg) => (
                  <div key={cg.name} className="flex items-center gap-2.5 text-xs text-slate-700">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs flex-shrink-0"
                      style={{ backgroundColor: cg.hex }}
                    />
                    <strong className="text-slate-900">{cg.name}:</strong>
                    <span className="text-slate-500 truncate">{cg.usage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => onColorOnline(sheet)}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm shadow-md bubbly-btn flex items-center justify-center gap-2 transition"
            >
              <PaintBucket size={18} />
              <span>Color Online in Studio (Free)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrintSingle}
                disabled={isPrinting}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <Printer size={15} />
                <span>Print Single PDF</span>
              </button>

              <button
                onClick={handlePrintClassroom}
                disabled={isPrinting}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                title="Prints 2 identical sheets per page to save 50% ink & paper"
              >
                <Scissors size={15} />
                <span>Classroom 2-Up</span>
              </button>
            </div>

            <button
              onClick={() => onCommercialLicense(sheet)}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck size={14} className="text-amber-500" />
              <span>Purchase Commercial Rights for Amazon KDP / Etsy ($9.99)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specifications & Educational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">🖨️ Printer Friendly</h4>
          <p className="text-xs text-slate-500">
            Formatted for standard A4 and US Letter printers. Black-and-white ink-saver line widths.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">🧠 Early Learning</h4>
          <p className="text-xs text-slate-500">
            Develops pencil grip, bilateral coordination, color recognition, and mindful focus.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">💖 100% Non-Commercial Free</h4>
          <p className="text-xs text-slate-500">
            Free forever for personal family use, homeschoolers, kindergartens, and public schools.
          </p>
        </div>
      </div>

      {/* Related Drawings in Same Category */}
      {relatedSheets.length > 0 && (
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-xl font-extrabold text-slate-900 font-heading mb-4">
            More {sheet.category} Coloring Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedSheets.map((rs) => (
              <Link
                key={rs.id}
                to={`/sheet/${rs.id}`}
                className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden p-2 mb-2 flex items-center justify-center">
                  <img src={rs.outline} alt={rs.title} className="w-full h-full object-contain" />
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">{rs.title}</div>
                <div className="text-[10px] text-slate-400">{rs.age}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
