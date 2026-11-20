import React from 'react';
import { ShieldCheck, Heart, Sparkles, BookOpen, Printer, Lock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 p-2 mx-auto mb-3 flex items-center justify-center shadow-sm">
          <img
            src="/assets/branding/baby_elephant_logo.jpg"
            alt="Baby Elephant Logo"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          About Baby Elephant Books
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          "Little Trunks, Big Imagination — Free & Fun Children's Coloring Books"
        </p>
      </header>

      {/* Story Spread */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-4 text-slate-700 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Our Mission</h2>
        <p>
          At <strong>Baby Elephant Books</strong> and <strong>Baby Elephant Illustrations</strong>, we believe every child has a boundless well of creativity.
          Our signature <em>Side-by-Side Color & Learn Edition</em> pairs a finished, vibrant color reference on the left with a clean line drawing on the right.
          This gives young artists the confidence to explore colors, build pencil grip, and enjoy hours of creative calm.
        </p>
        <p>
          We promise to keep our drawings <strong>100% free forever for personal family and educational use</strong>. Parents and teachers should never have to jump through paywalls to print inspiring artwork for their children.
        </p>
      </section>

      {/* Printer & Paper Tips */}
      <section className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-lg font-heading">
          <Printer size={22} className="text-amber-700" />
          <span>Home & School Printing Best Practices</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 mb-1">Standard Paper vs Cardstock:</strong>
            Standard 20lb printer paper works great for crayons and colored pencils. For markers or watercolors, 65lb cardstock prevents bleed-through!
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 mb-1">Ink-Saver Lines:</strong>
            Our outlines are drawn with high-contrast vector lines so you can use your printer's "Draft" or "Eco Mode" and save 40% ink!
          </div>
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <strong className="block text-slate-900 mb-1">2-Per-Page Classroom Pack:</strong>
            Use our 2-Up classroom layout to print two half-sheets side-by-side with scissors cutting lines.
          </div>
        </div>
      </section>

      {/* COPPA & Child Safety */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-lg font-heading">
          <Lock size={20} />
          <span>Child Safety & COPPA Compliance</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Our online coloring studio is built with strict privacy principles. We do not collect personal information from children,
          we do not require accounts or signups to color, and we never display intrusive third-party popups or adult tracking cookies.
          Children can paint safely and independently in a wholesome digital environment.
        </p>
      </section>
    </div>
  );
};
