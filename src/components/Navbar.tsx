import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShieldCheck, Heart, Sparkles, BookOpen, PaintBucket, Lock } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenTipJar: () => void;
  announcementText?: string;
  announcementActive?: boolean;
}

export const Navbar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  onOpenTipJar,
  announcementText = '✨ 100% Free Coloring Pages & Multi-Page Books for Families & Classrooms',
  announcementActive = true,
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b-2 border-amber-200 shadow-xs">
      {/* Top Banner Notice with Prominent Admin Access for Site Owner */}
      {announcementActive && (
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-600 text-white text-[11px] font-bold py-1 px-4 text-center flex items-center justify-between gap-2">
          <div className="flex-1 text-center truncate">
            <span>{announcementText}</span>
            <Link
              to="/licensing"
              className="underline hover:text-yellow-100 ml-1.5 text-[10px] uppercase tracking-wider hidden sm:inline"
            >
              Commercial Rights Available →
            </Link>
          </div>

          {/* 1-Click Clear Admin Access */}
          <Link
            to="/admin"
            className="bg-black/30 hover:bg-black/50 text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 transition flex-shrink-0 border border-white/20"
            title="Admin Control Panel & Revenue Dashboard"
          >
            <Lock size={10} />
            <span>Admin Portal</span>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-300 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition animate-jelly">
              <img
                src="/assets/branding/baby_elephant_logo.jpg"
                alt="Baby Elephant Books"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Baby Elephant
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Books
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold tracking-wide">
                Little Trunks, Big Imagination
              </div>
            </div>
          </Link>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <Link
              to="/admin"
              className="px-2 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold"
            >
              Admin
            </Link>
            <button
              onClick={onOpenTipJar}
              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
              title="Tip Jar"
            >
              <Heart size={16} className="fill-rose-500" />
            </button>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search 100+ drawings (e.g. bear, Tom & Jerry, A to Z, dino)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
          />
        </div>

        {/* Right Nav Links */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl font-bold text-xs transition ${
              isActive('/') && location.pathname === '/'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Coloring Pages
          </Link>

          <Link
            to="/books"
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isActive('/books')
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={14} className="text-indigo-600" />
            <span>Coloring Books (PDF)</span>
          </Link>

          <Link
            to="/color-online"
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isActive('/color-online')
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <PaintBucket size={14} className="text-amber-700" />
            <span>Color Online</span>
          </Link>

          <Link
            to="/licensing"
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isActive('/licensing')
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck size={14} className="text-amber-600" />
            <span>Licensing</span>
          </Link>

          <button
            onClick={onOpenTipJar}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition ml-1"
          >
            <Heart size={14} className="fill-rose-500" />
            <span>Tip ($3)</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
