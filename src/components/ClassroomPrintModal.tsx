import React, { useState } from 'react';
import { ColoringSheet } from '../types';
import { generateSingleSheetPDF, generateClassroomSetPDF, generateFullBookPDF } from '../utils/pdfGenerator';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Printer, BookOpen, Scissors, Check, Sparkles, X, User } from 'lucide-react';

interface Props {
  sheet?: ColoringSheet | null;
  allSheets: ColoringSheet[];
  onClose: () => void;
}

export const ClassroomPrintModal: React.FC<Props> = ({ sheet, allSheets, onClose }) => {
  const [mode, setMode] = useState<'single' | 'classroom' | 'book'>('single');
  const [includeGuide, setIncludeGuide] = useState(true);
  const [childName, setChildName] = useState('Oliver');
  const [bookTitle, setBookTitle] = useState("Baby Elephant's Big Coloring Adventure");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    sound.playFanfare();

    try {
      if (mode === 'single' && sheet) {
        await generateSingleSheetPDF(sheet, includeGuide);
      } else if (mode === 'classroom' && sheet) {
        await generateClassroomSetPDF(sheet);
      } else if (mode === 'book') {
        const bookSheets = sheet ? [sheet, ...allSheets.filter(s => s.id !== sheet.id).slice(0, 5)] : allSheets.slice(0, 6);
        await generateFullBookPDF(bookSheets, bookTitle, childName);
      }

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error generating printable PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Printer size={26} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Print & PDF Studio
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              High-resolution ink-saver PDFs for home, schools & homeschoolers
            </p>
          </div>
        </div>

        {/* Print Option Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`p-3 rounded-2xl text-center border-2 transition ${
              mode === 'single'
                ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Printer size={20} className="mx-auto mb-1 text-indigo-600" />
            <div className="text-xs font-bold text-slate-800">Single Sheet</div>
            <div className="text-[10px] text-slate-500">1 Full Page</div>
          </button>

          <button
            type="button"
            onClick={() => setMode('classroom')}
            className={`p-3 rounded-2xl text-center border-2 transition ${
              mode === 'classroom'
                ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Scissors size={20} className="mx-auto mb-1 text-emerald-600" />
            <div className="text-xs font-bold text-slate-800">Classroom Set</div>
            <div className="text-[10px] text-emerald-700 font-bold">2-Per-Page (50% Ink)</div>
          </button>

          <button
            type="button"
            onClick={() => setMode('book')}
            className={`p-3 rounded-2xl text-center border-2 transition relative ${
              mode === 'book'
                ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Full Book
            </span>
            <BookOpen size={20} className="mx-auto mb-1 text-amber-600" />
            <div className="text-xs font-bold text-slate-800">Complete Book</div>
            <div className="text-[10px] text-slate-500">Cover + Diploma</div>
          </button>
        </div>

        {/* Mode-specific settings */}
        {mode === 'single' && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">Include Side-by-Side Color Guide</div>
                <div className="text-xs text-slate-500">Pairs finished color guide on left with line-art on right</div>
              </div>
              <input
                type="checkbox"
                checked={includeGuide}
                onChange={(e) => setIncludeGuide(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
            {sheet && (
              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <Check size={14} className="text-emerald-500" />
                <span>Selected: <strong>{sheet.title}</strong></span>
              </div>
            )}
          </div>
        )}

        {mode === 'classroom' && (
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 mb-6 text-xs text-emerald-800 space-y-2">
            <div className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <Scissors size={16} />
              <span>Teacher & Homeschool Paper-Saver Edition</span>
            </div>
            <p>
              Prints two identical coloring sheets side-by-side with a dotted center cutting line and student name fields.
              Cuts paper and ink usage by exactly 50%!
            </p>
          </div>
        )}

        {mode === 'book' && (
          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User size={13} className="text-indigo-600" />
                <span>Child's Name ("This Book Belongs To:")</span>
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Maya or Lucas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Book Title
              </label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-bold text-slate-800"
              />
            </div>

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600 flex-shrink-0" />
              <span>Includes Custom Cover + 6 Storybook Pages + Crayon Guide + Official Little Artist Diploma!</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-base shadow-lg bubbly-btn flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <span>Generating High-Res PDF...</span>
          ) : (
            <>
              <Printer size={18} />
              <span>Download Printable PDF (Free)</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          100% Free for personal, family and educational non-commercial use.
        </p>
      </div>
    </div>
  );
};
