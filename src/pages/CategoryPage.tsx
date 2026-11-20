import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ColoringSheet } from '../types';
import { SheetCard } from '../components/SheetCard';
import { CATEGORIES_LIST } from '../data/sheets';
import { generateCompleteBookPDF } from '../utils/pdfGenerator';
import { ColoringBookData } from '../data/books';
import {
  Sparkles,
  BookOpen,
  Printer,
  ChevronRight,
  Download,
  Filter,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface Props {
  sheets: ColoringSheet[];
  onColorOnline: (sheet: ColoringSheet) => void;
  onPrintSheet: (sheet: ColoringSheet) => void;
  onCommercialLicense: (sheet: ColoringSheet) => void;
}

export const CategoryPage: React.FC<Props> = ({
  sheets,
  onColorOnline,
  onPrintSheet,
  onCommercialLicense,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedAge, setSelectedAge] = useState<string>('All Ages');

  const currentCategory = useMemo(() => {
    return CATEGORIES_LIST.find((c) => c.slug === slug) || {
      id: slug || 'collection',
      name: (slug || 'Collection').replace('-', ' ').toUpperCase(),
      slug: slug || 'all',
      icon: 'Sparkles',
      description: 'Explore printable and interactive digital coloring sheets in this collection.',
      gradient: 'from-amber-400 to-indigo-600'
    };
  }, [slug]);

  // Filter sheets in this category
  const categorySheets = useMemo(() => {
    return sheets.filter((s) => {
      const matchCat = slug === 'all' || s.slug === slug;
      const matchAge = selectedAge === 'All Ages' || s.age === selectedAge;
      return matchCat && matchAge;
    });
  }, [sheets, slug, selectedAge]);

  // Download entire category as a multi-page book
  const handleDownloadCategoryBook = async () => {
    if (!categorySheets.length) return;
    const catBook: ColoringBookData = {
      id: `book-${currentCategory.slug}`,
      title: `${currentCategory.name} Coloring Book`,
      subtitle: `Complete ${currentCategory.name} Collection`,
      coverImage: categorySheets[0]?.colorGuide || categorySheets[0]?.outline,
      badge: "Category Edition",
      pageCount: categorySheets.length + 2,
      targetAge: "All Ages",
      description: currentCategory.description,
      theme: "from-indigo-600 to-amber-500",
      sheetIds: categorySheets.map((s) => s.id),
      features: [
        `Complete collection of ${categorySheets.length} drawings`,
        "Crayon palette guide on each spread",
        "Includes child dedication and creativity certificate"
      ]
    };

    await generateCompleteBookPDF(catBook, categorySheets, "Young Artist");
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition flex items-center gap-1">
          <span>Home</span>
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <Link to="/" className="hover:text-slate-900 transition">
          Categories
        </Link>
        <ChevronRight size={13} className="text-slate-400" />
        <span className="font-bold text-slate-900">{currentCategory.name}</span>
      </nav>

      {/* Category Banner */}
      <header className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${currentCategory.gradient} text-white shadow-xl relative overflow-hidden border-4 border-white/60`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <span>{categorySheets.length} Drawings in Collection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
              {currentCategory.name} Coloring Pages
            </h1>
            <p className="text-sm text-white/90 mt-2 max-w-xl">
              {currentCategory.description} All sheets free for personal, family and educational printing.
            </p>
          </div>

          <button
            onClick={handleDownloadCategoryBook}
            disabled={!categorySheets.length}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-xs sm:text-sm shadow-xl bubbly-btn flex items-center justify-center gap-2 flex-shrink-0 transition"
          >
            <Download size={18} className="text-indigo-600" />
            <span>Download All as 1 Book PDF</span>
          </button>
        </div>
      </header>

      {/* Sub-Filters: Age Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <Filter size={15} className="text-slate-400" />
          <span className="font-bold text-slate-700">Filter by Age:</span>
          {['All Ages', 'Toddlers (1-3)', 'Preschool (3-5)', 'Kids (6-9)', 'Tweens & Teens (10+)'].map((age) => (
            <button
              key={age}
              onClick={() => setSelectedAge(age)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedAge === age
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {age}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{categorySheets.length}</strong> coloring sheets
        </div>
      </div>

      {/* Grid of Sheets */}
      {categorySheets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-amber-300">
          <div className="text-4xl mb-2">🎨</div>
          <h3 className="font-heading font-bold text-lg text-slate-900 mb-1">
            No drawings match this age filter
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try switching back to "All Ages" to see all available coloring pages.
          </p>
          <button
            onClick={() => setSelectedAge('All Ages')}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 font-bold text-xs"
          >
            Show All Sheets
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categorySheets.map((sheet) => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              onColorOnline={onColorOnline}
              onPrint={onPrintSheet}
              onCommercialLicense={onCommercialLicense}
            />
          ))}
        </div>
      )}

      {/* Back to Home Link */}
      <div className="pt-6 border-t border-slate-200 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100"
        >
          <ArrowLeft size={14} />
          <span>Back to All Collections</span>
        </Link>
      </div>
    </div>
  );
};
