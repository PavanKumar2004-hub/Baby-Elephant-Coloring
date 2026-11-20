import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, BookOpen, Lock } from 'lucide-react';

interface Props {
  onOpenTipJar: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenTipJar }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-amber-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/branding/baby_elephant_logo.jpg"
                alt="Baby Elephant Books"
                className="w-11 h-11 object-contain rounded-2xl border-2 border-amber-300 bg-white p-0.5 shadow-md"
              />
              <div>
                <span className="font-heading font-bold text-lg text-white">
                  Baby Elephant Books
                </span>
                <div className="text-[11px] text-amber-400 font-semibold">
                  Free & Fun Children's Coloring Books
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Illustrated by <strong>Baby Elephant Illustrations</strong>. Created to nurture focus,
              color recognition, and creative confidence in every young artist.
            </p>

            <div className="text-xs text-amber-400 font-semibold italic">
              "Little Trunks, Big Imagination"
            </div>
          </div>

          {/* Col 2: Collections */}
          <div>
            <h4 className="text-sm font-bold text-white font-heading mb-3 uppercase tracking-wider">
              Browse Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/cartoons" className="hover:text-amber-400 transition">
                  Tom & Jerry Storybook Edition
                </Link>
              </li>
              <li>
                <Link to="/category/alphabet" className="hover:text-amber-400 transition">
                  Alphabet A to Z Phonics
                </Link>
              </li>
              <li>
                <Link to="/category/animals" className="hover:text-amber-400 transition">
                  Animals & Wildlife
                </Link>
              </li>
              <li>
                <Link to="/category/dinosaurs" className="hover:text-amber-400 transition">
                  Dinosaurs & Fantasy
                </Link>
              </li>
              <li>
                <Link to="/category/vehicles" className="hover:text-amber-400 transition">
                  Vehicles & Rescue Trucks
                </Link>
              </li>
              <li>
                <Link to="/category/space" className="hover:text-amber-400 transition">
                  Space & Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Books & Studio */}
          <div>
            <h4 className="text-sm font-bold text-white font-heading mb-3 uppercase tracking-wider">
              Features & Downloads
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/books" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <BookOpen size={13} className="text-amber-400" />
                  <span>Coloring Books (Multi-Page PDF)</span>
                </Link>
              </li>
              <li>
                <Link to="/color-online" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>Interactive Coloring Studio</span>
                </Link>
              </li>
              <li>
                <Link to="/licensing" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-amber-400" />
                  <span>Commercial Use Rights & KDP Licenses</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition">
                  Classroom Printing & Paper Tips
                </Link>
              </li>
              <li>
                <button onClick={onOpenTipJar} className="hover:text-rose-400 transition flex items-center gap-1 text-rose-300">
                  <Heart size={13} className="fill-rose-400" />
                  <span>Support Us with a $3 Crayon Tip</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Child Safety */}
          <div>
            <h4 className="text-sm font-bold text-white font-heading mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={15} className="text-emerald-400" />
              <span>Safe for Kids</span>
            </h4>
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 text-xs text-slate-400 space-y-2 mb-3">
              <div className="text-emerald-400 font-bold">✓ COPPA & Family Certified</div>
              <p>
                Zero intrusive popups, zero personal data harvesting. Wholesome, safe creative play.
              </p>
            </div>

            <div className="text-[11px] text-slate-500">
              <Link to="/admin" className="hover:text-slate-300 transition">
                ⚙️ Portal Management
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 Baby Elephant Books & Baby Elephant Illustrations. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Free for Non-Commercial</span>
            <span>•</span>
            <Link to="/licensing" className="hover:text-amber-400">Commercial Terms</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-amber-400">About & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
