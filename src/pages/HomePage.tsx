import React from 'react';
import { Link } from 'react-router-dom';
import { ColoringSheet } from '../types';
import { ColoringBookData, COLORING_BOOKS } from '../data/books';
import { SheetCard } from '../components/SheetCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { AdBanner } from '../components/AdBanner';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Printer,
  PaintBucket,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Award,
  Heart,
  Download
} from 'lucide-react';

interface Props {
  sheets: ColoringSheet[];
  onColorOnline: (sheet: ColoringSheet) => void;
  onPrintSheet: (sheet: ColoringSheet) => void;
  onDownloadBook: (book: ColoringBookData) => void;
  onCommercialLicense: (sheet: ColoringSheet) => void;
  onOpenTipJar: () => void;
}

export const HomePage: React.FC<Props> = ({
  sheets,
  onColorOnline,
  onPrintSheet,
  onDownloadBook,
  onCommercialLicense,
  onOpenTipJar,
}) => {
  const featuredBook = COLORING_BOOKS[0]; // Tom & Jerry Book
  const popularSheets = sheets.slice(0, 8);
  const storybookSheets = sheets.filter((s) => s.isExclusive);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-600 p-6 sm:p-10 text-white shadow-2xl border-4 border-white/70">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/4 w-48 h-48 rounded-full bg-yellow-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5 sm:gap-7">
            {/* Mascot */}
            <div
              onClick={() => {
                sound.playSparkle();
                confetti({ particleCount: 40, spread: 60, origin: { x: 0.2, y: 0.3 } });
              }}
              className="cursor-pointer group flex-shrink-0 relative"
              title="Click to play with Baby Elephant!"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2 shadow-2xl border-4 border-amber-200 transform group-hover:scale-105 group-hover:rotate-2 transition flex items-center justify-center">
                <img
                  src="/assets/branding/baby_elephant_logo.jpg"
                  alt="Baby Elephant Logo"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow border-2 border-white animate-bounce">
                Say Hi! 👋
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
                <Sparkles size={13} className="text-yellow-200" />
                <span>100% Free For Families & Classrooms</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight drop-shadow-sm">
                Baby Elephant Coloring & Books
              </h1>
              <p className="text-sm sm:text-base text-white/95 mt-2 font-medium max-w-xl leading-relaxed">
                Free printable coloring pages, side-by-side color & learn storybooks, and an interactive digital painting studio for kids.
              </p>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/color-online"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm shadow-xl bubbly-btn flex items-center justify-center gap-2 transition"
            >
              <PaintBucket size={18} />
              <span>Color Online Studio</span>
            </Link>

            <Link
              to="/books"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-indigo-900 font-extrabold text-sm shadow-xl bubbly-btn flex items-center justify-center gap-2 transition"
            >
              <BookOpen size={18} className="text-indigo-600" />
              <span>Coloring Books (PDF)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Publication: Tom & Jerry Side-by-Side Edition */}
      {featuredBook && (
        <section className="bg-gradient-to-br from-indigo-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-indigo-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow">
            Featured Book Release
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                <BookOpen size={16} />
                <span>Published by Baby Elephant Books</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                {featuredBook.title}
                <span className="block text-indigo-600 text-lg sm:text-xl font-bold mt-0.5">
                  {featuredBook.subtitle}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {featuredBook.description}
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
                {featuredBook.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="bg-white/90 p-2.5 rounded-xl border border-indigo-100 text-xs text-slate-700 font-semibold flex items-center gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onDownloadBook(featuredBook)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-lg bubbly-btn flex items-center gap-2"
                >
                  <Download size={18} />
                  <span>Download Complete 7-Page Book PDF (Free)</span>
                </button>

                <Link
                  to="/category/cartoons"
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>View All 4 Scenes</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Book Cover Preview */}
            <div className="w-56 sm:w-64 flex-shrink-0 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-amber-300 transform rotate-1 hover:rotate-0 transition duration-300">
              <img
                src={featuredBook.coverImage}
                alt={featuredBook.title}
                className="w-full h-auto object-contain rounded-xl"
              />
              <div className="text-center pt-2">
                <span className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">
                  7-Page Printable Book Edition
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Explorer */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              Browse Coloring Collections
            </h2>
            <p className="text-xs text-slate-500">
              Explore alphabet letters, jungle wildlife, dinosaurs, emergency vehicles, space, and holidays
            </p>
          </div>
          <Link
            to="/books"
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
          >
            <span>Browse Full Books</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: 'Cartoons', slug: 'cartoons', icon: '📖', desc: 'Tom & Jerry series', color: 'from-indigo-500 to-purple-600' },
            { name: 'Alphabet A-Z', slug: 'alphabet', icon: '🔤', desc: 'Phonics & letters', color: 'from-pink-500 to-rose-600' },
            { name: 'Animals', slug: 'animals', icon: '🐘', desc: 'Elephants, bears & pets', color: 'from-emerald-400 to-teal-600' },
            { name: 'Dinosaurs', slug: 'dinosaurs', icon: '🦖', desc: 'Prehistoric giants', color: 'from-lime-500 to-green-600' },
            { name: 'Vehicles', slug: 'vehicles', icon: '🚒', desc: 'Fire trucks & cars', color: 'from-blue-500 to-cyan-600' },
            { name: 'Space', slug: 'space', icon: '🚀', desc: 'Rockets & planets', color: 'from-violet-500 to-indigo-700' },
            { name: 'Holidays', slug: 'holidays', icon: '🎄', desc: 'Christmas & parties', color: 'from-amber-500 to-orange-600' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition text-center group flex flex-col items-center justify-between"
            >
              <div className="text-3xl mb-1 transform group-hover:scale-110 transition">
                {cat.icon}
              </div>
              <div className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition">
                {cat.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {cat.desc}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Coloring Sheets Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              Popular Coloring Pages Right Now
            </h2>
          </div>
          <Link
            to="/color-online"
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 transition"
          >
            <PaintBucket size={14} />
            <span>Launch Coloring Studio</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularSheets.map((sheet) => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              onColorOnline={onColorOnline}
              onPrint={onPrintSheet}
              onCommercialLicense={onCommercialLicense}
            />
          ))}
        </div>
      </section>

      {/* Classroom & Paper-Saver Callout */}
      <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
            <Scissors size={28} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl text-emerald-950">
              For Teachers & Homeschool Classrooms: 2-Per-Page Sets
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 mt-1">
              Every coloring sheet can be printed in a <strong>2-Per-Page Half Sheet Layout</strong> with cutting lines and student name fields.
              Saves 50% of your paper and printer ink!
            </p>
          </div>
        </div>

        <Link
          to="/about"
          className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md bubbly-btn flex items-center gap-2 flex-shrink-0"
        >
          <span>Printing Guide & Tips</span>
          <ArrowRight size={14} />
        </Link>
      </section>

      {/* Ethical Sponsor Ad */}
      <AdBanner />
    </div>
  );
};
