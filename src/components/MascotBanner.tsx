import React, { useState } from 'react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, BookOpen, Heart, Award, ArrowRight } from 'lucide-react';

interface Props {
  onExploreStorybook: () => void;
  onOpenTipJar: () => void;
}

export const MascotBanner: React.FC<Props> = ({ onExploreStorybook, onOpenTipJar }) => {
  const [elephantMood, setElephantMood] = useState<'happy' | 'dancing' | 'excited'>('happy');
  const [speechBubble, setSpeechBubble] = useState<string>("Hello, little artist! Pick a sheet and let's color together!");

  const cheerList = [
    "You have such a wonderful imagination! 🌟",
    "Look at those gorgeous colors you choose! 🎨",
    "Little trunks, BIG dreams and giant creativity! 🐘",
    "Did you know our coloring pages are 100% free for families? 💖",
    "Check out our new Tom & Jerry Side-by-Side Storybook! 🧀"
  ];

  const handleMascotClick = () => {
    sound.playSparkle();
    const nextMood = elephantMood === 'happy' ? 'dancing' : elephantMood === 'dancing' ? 'excited' : 'happy';
    setElephantMood(nextMood);
    const randomCheer = cheerList[Math.floor(Math.random() * cheerList.length)];
    setSpeechBubble(randomCheer);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: 0.15, y: 0.3 }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 p-6 sm:p-8 text-white shadow-xl border-4 border-white/60 mb-8">
      {/* Background Decorative Circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full bg-yellow-300/20 blur-lg pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Mascot & Interactive Voice Bubble */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div
            onClick={handleMascotClick}
            className="cursor-pointer group relative flex-shrink-0"
            title="Click me to play!"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-2 shadow-2xl border-4 border-amber-200 transform group-hover:scale-110 group-hover:rotate-3 transition duration-300 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/branding/baby_elephant_logo.jpg"
                alt="Baby Elephant Mascot"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow border-2 border-white animate-bounce">
              Tap Me!
            </span>
          </div>

          <div className="max-w-md">
            {/* Mascot Speech Bubble */}
            <div className="relative bg-white/95 text-slate-900 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md mb-2 inline-block border-2 border-amber-300">
              <span className="text-amber-500 mr-1">💬</span>
              {speechBubble}
              {/* Triangle pointer */}
              <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-white/95 border-b-[6px] border-b-transparent" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight drop-shadow-sm leading-tight">
              Baby Elephant Coloring & Books
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium">
              Free Printable Coloring Pages • Side-by-Side Storybooks • Online Painting Studio
            </p>
          </div>
        </div>

        {/* Right CTA Cards */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onExploreStorybook}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-xs sm:text-sm shadow-lg bubbly-btn flex items-center gap-2 transition"
          >
            <BookOpen size={18} className="text-indigo-600" />
            <span>Storybook Series (Tom & Jerry)</span>
            <ArrowRight size={14} className="text-slate-400" />
          </button>

          <button
            onClick={onOpenTipJar}
            className="px-4 py-3 rounded-2xl bg-rose-500/90 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-md bubbly-btn flex items-center gap-1.5 transition border border-white/30"
          >
            <Heart size={16} className="fill-white" />
            <span>Support Us ($3 Crayon Box)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
