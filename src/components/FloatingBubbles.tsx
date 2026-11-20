import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
}

const BUBBLE_COLORS = [
  'rgba(254, 240, 138, 0.45)', // yellow
  'rgba(251, 207, 232, 0.45)', // pink
  'rgba(186, 230, 253, 0.45)', // sky blue
  'rgba(221, 214, 254, 0.45)', // lavender
  'rgba(167, 243, 208, 0.45)'  // mint
];

export const FloatingBubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate initial cheerful floating bubbles
    const generated: Bubble[] = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 32) + 24, // 24px - 56px
      left: Math.floor(Math.random() * 90) + 5,   // 5% - 95%
      duration: Math.floor(Math.random() * 8) + 12, // 12s - 20s
      delay: Math.floor(Math.random() * 10),
      color: BUBBLE_COLORS[i % BUBBLE_COLORS.length]
    }));
    setBubbles(generated);
  }, []);

  const handlePop = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    sound.playPop(750 + Math.random() * 300);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 15,
      spread: 40,
      startVelocity: 12,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#F59E0B', '#EC4899', '#6366F1', '#10B981'],
      disableForReducedMotion: true
    });

    // Respawn bubble
    setBubbles((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              left: Math.floor(Math.random() * 90) + 5,
              delay: 0,
              size: Math.floor(Math.random() * 30) + 24
            }
          : b
      )
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {bubbles.map((b) => (
        <div
          key={b.id}
          onClick={(e) => handlePop(e, b.id)}
          className="floating-bubble border-2 border-white/60 shadow-inner group"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            backgroundColor: b.color,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
          title="Pop me!"
        >
          {/* Highlight shine reflection */}
          <div className="w-2.5 h-2.5 rounded-full bg-white/80 absolute top-1.5 left-2" />
        </div>
      ))}
    </div>
  );
};
