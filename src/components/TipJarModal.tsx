import React, { useState } from 'react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Coffee, Gift, Check, X, CreditCard } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export const TipJarModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [selectedTip, setSelectedTip] = useState<number>(5);
  const [isVip, setIsVip] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSupport = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    const amount = isVip ? 4.99 : selectedTip;
    onSuccess(amount);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-rose-300 relative my-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Heart size={30} className="fill-rose-500 text-rose-500 animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 font-heading mb-1">
              Support Baby Elephant Books!
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              All coloring pages are 100% free for families and classrooms. Help us draw more wonderful storybooks!
            </p>

            {/* Toggle Support Type */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setIsVip(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  !isVip ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Buy Us Crayons 🖍️
              </button>
              <button
                type="button"
                onClick={() => setIsVip(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  isVip ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                VIP Family Pass 👑
              </button>
            </div>

            {!isVip ? (
              <div>
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {[3, 5, 10].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedTip(amt)}
                      className={`p-3 rounded-2xl border-2 transition ${
                        selectedTip === amt
                          ? 'border-rose-500 bg-rose-50 text-rose-700 font-extrabold shadow-sm'
                          : 'border-slate-200 text-slate-700 font-bold hover:border-slate-300'
                      }`}
                    >
                      <div className="text-lg">${amt}</div>
                      <div className="text-[10px] text-slate-500">
                        {amt === 3 ? '1 Crayon Pack' : amt === 5 ? 'Color Pencils' : 'Art Studio Box'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-rose-50/60 rounded-xl p-3 text-xs text-rose-800 mb-5 text-left flex items-start gap-2">
                  <Sparkles size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Your gift helps keep 100+ coloring sheets 100% free for kids & teachers worldwide!</span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 mb-5 text-left text-xs text-amber-900 space-y-2">
                <div className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                  <Gift size={16} className="text-amber-600" />
                  <span>Baby Elephant VIP Family Club ($4.99/mo)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Check size={14} className="text-emerald-500" />
                  <span>100% Ad-Free Experience across the whole website</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Check size={14} className="text-emerald-500" />
                  <span>Early access to new monthly coloring storybook drops</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Check size={14} className="text-emerald-500" />
                  <span>20% off all Commercial Publisher Licenses</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSupport}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg bubbly-btn flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              <span>
                {isVip ? 'Join VIP Family Club ($4.99/mo)' : `Send $${selectedTip} Tip`}
              </span>
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-heading mb-1">
              Thank You from the Heart!
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Little trunks give you a gigantic hug! Your support fuels our creative coloring books.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-md"
            >
              Back to Coloring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
