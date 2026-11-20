import React, { useState } from 'react';
import { ColoringBookData, COLORING_BOOKS } from '../data/books';
import { ColoringSheet } from '../types';
import { generateCompleteBookPDF } from '../utils/pdfGenerator';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { BookOpen, Download, User, Sparkles, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';

interface Props {
  sheets: ColoringSheet[];
  books?: ColoringBookData[];
}

export const BooksPage: React.FC<Props> = ({ sheets, books = COLORING_BOOKS }) => {
  const [personalizeBook, setPersonalizeBook] = useState<ColoringBookData | null>(null);
  const [childName, setChildName] = useState<string>('Oliver');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleDownload = async (book: ColoringBookData, name: string = "Little Artist") => {
    setIsGenerating(true);
    sound.playFanfare();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    // Find sheets that belong to this book
    const bookSheets = sheets.filter((s) => book.sheetIds.includes(s.id));
    // If fewer found, fallback to slice
    const finalSheets = bookSheets.length > 0 ? bookSheets : sheets.slice(0, book.pageCount - 2);

    await generateCompleteBookPDF(book, finalSheets, name);
    setIsGenerating(false);
    setPersonalizeBook(null);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
          <BookOpen size={14} />
          <span>Authentic Multi-Page Storybooks</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Free Printable Coloring Books
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Download complete multi-page coloring books formatted with custom dedication covers,
          side-by-side color reference guides, and Little Artist diplomas!
        </p>
      </header>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-32 h-44 bg-slate-50 rounded-xl overflow-hidden shadow-md border-2 border-amber-300 flex-shrink-0 flex items-center justify-center p-1.5">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      {book.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {book.targetAge}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">
                    {book.title}
                  </h3>
                  <div className="text-xs font-bold text-indigo-600 mt-0.5">
                    {book.subtitle}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">
                    📄 {book.pageCount} Complete Pages
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {book.description}
              </p>

              {/* Features List */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-4 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-indigo-700">
                  Included in this volume:
                </div>
                {book.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleDownload(book, "Little Artist")}
                disabled={isGenerating}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md bubbly-btn flex items-center justify-center gap-1.5 transition"
              >
                <Download size={16} />
                <span>Download Full Book PDF</span>
              </button>

              <button
                onClick={() => setPersonalizeBook(book)}
                className="px-3.5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition"
                title="Add your child's name to the cover"
              >
                <User size={15} />
                <span>Add Name</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Personalize Cover Modal */}
      {personalizeBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 text-left">
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-1">
              Personalize Coloring Book Cover
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add your child or student's name to print on the official cover and diploma!
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Child's Name ("This Book Belongs To:")
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Maya or Lucas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 mb-5 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600 flex-shrink-0" />
              <span>Will be printed in bold script on Page 1 & the Back Cover Diploma!</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(personalizeBook, childName)}
                disabled={isGenerating}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow bubbly-btn"
              >
                {isGenerating ? 'Generating...' : `Generate & Download PDF`}
              </button>
              <button
                onClick={() => setPersonalizeBook(null)}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
