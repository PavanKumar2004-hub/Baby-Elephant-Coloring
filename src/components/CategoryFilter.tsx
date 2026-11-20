import React from 'react';
import { CATEGORIES_LIST } from '../data/sheets';
import { Sparkles, BookOpen, GraduationCap, PawPrint, Flame, Car, Rocket, Gift } from 'lucide-react';

interface Props {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  sheetCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  sheetCounts,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'BookOpen': return <BookOpen size={16} />;
      case 'GraduationCap': return <GraduationCap size={16} />;
      case 'PawPrint': return <PawPrint size={16} />;
      case 'Flame': return <Flame size={16} />;
      case 'Car': return <Car size={16} />;
      case 'Rocket': return <Rocket size={16} />;
      case 'Gift': return <Gift size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <span>Explore Coloring Collections</span>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
            A to Z Topics
          </span>
        </h2>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Free printable and digital studio
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = sheetCounts[cat.slug] || (cat.slug === 'all' ? sheetCounts['all'] : 0);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition flex-shrink-0 border-2 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <span className={isSelected ? 'text-amber-400' : 'text-slate-500'}>
                {getIcon(cat.icon)}
              </span>
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
