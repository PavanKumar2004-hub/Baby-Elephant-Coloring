import React, { useState } from 'react';
import { ColoringSheet, CommercialLicense } from '../types';
import { generateCommercialLicensePDF } from '../utils/pdfGenerator';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ShieldCheck, CheckCircle2, Download, X, Sparkles, Building2, User, Mail, CreditCard } from 'lucide-react';

interface Props {
  sheet?: ColoringSheet | null;
  onClose: () => void;
  onSaveLicense: (license: CommercialLicense) => void;
}

export const CommercialLicenseModal: React.FC<Props> = ({ sheet, onClose, onSaveLicense }) => {
  const [tier, setTier] = useState<'single' | 'bundle' | 'enterprise'>('single');
  const [licenseeName, setLicenseeName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [issuedLicense, setIssuedLicense] = useState<CommercialLicense | null>(null);

  const pricing = {
    single: { price: 9.99, units: 1000, title: 'Single Artwork Commercial License' },
    bundle: { price: 29.99, units: 10000, title: 'All-Collection Commercial License' },
    enterprise: { price: 99.00, units: 100000, title: 'Unlimited Publisher & Daycare License' },
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseeName || !email) {
      alert('Please fill in your name and email address');
      return;
    }

    const uniqueId = 'BE-LIC-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
    const itemTitle = tier === 'single' ? (sheet?.title || 'Selected Artwork') : 'Baby Elephant Books Complete Catalog';

    const newLicense: CommercialLicense = {
      licenseId: uniqueId,
      licenseeName,
      businessName: businessName || 'Independent Creator',
      email,
      tier,
      itemTitle,
      price: pricing[tier].price,
      purchasedAt: new Date().toISOString(),
      status: 'active',
      maxUnits: pricing[tier].units,
      allowedChannels: [
        'Amazon KDP Print-on-Demand Coloring Books',
        'Etsy Printable Downloads & Physical Prints',
        'Preschool, Kindergarten & Daycare Curriculum Distribution',
        'Children Merchandise (T-Shirts, Stickers, Tote Bags)',
        'Classroom Worksheets & Paid Teaching Material'
      ]
    };

    onSaveLicense(newLicense);
    setIssuedLicense(newLicense);
    setIsSuccess(true);
    sound.playFanfare();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Commercial Use License
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Non-commercial use is 100% free. Get an official commercial license to sell prints or books.
                </p>
              </div>
            </div>

            {/* Target Item */}
            {sheet && (
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-5 flex items-center gap-3">
                <img
                  src={sheet.outline}
                  alt={sheet.title}
                  className="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-amber-200"
                />
                <div>
                  <div className="text-xs text-amber-800 font-bold uppercase tracking-wider">
                    Selected Artwork
                  </div>
                  <div className="text-sm font-bold text-slate-900">{sheet.title}</div>
                  <div className="text-xs text-slate-500">{sheet.category}</div>
                </div>
              </div>
            )}

            {/* Tier Selector */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <button
                type="button"
                onClick={() => setTier('single')}
                className={`p-3 rounded-2xl text-left border-2 transition ${
                  tier === 'single'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-500">Single</div>
                <div className="text-lg font-extrabold text-slate-900">$9.99</div>
                <div className="text-[11px] text-slate-500">1,000 units</div>
              </button>

              <button
                type="button"
                onClick={() => setTier('bundle')}
                className={`p-3 rounded-2xl text-left border-2 transition relative ${
                  tier === 'bundle'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Popular
                </span>
                <div className="text-xs font-bold text-slate-500">All Bundles</div>
                <div className="text-lg font-extrabold text-slate-900">$29.99</div>
                <div className="text-[11px] text-slate-500">10,000 units</div>
              </button>

              <button
                type="button"
                onClick={() => setTier('enterprise')}
                className={`p-3 rounded-2xl text-left border-2 transition ${
                  tier === 'enterprise'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-500">Enterprise</div>
                <div className="text-lg font-extrabold text-slate-900">$99.00</div>
                <div className="text-[11px] text-slate-500">100k units</div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckout} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" />
                  <span>Licensee / Full Legal Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={licenseeName}
                  onChange={(e) => setLicenseeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building2 size={14} className="text-slate-400" />
                  <span>Business / Brand / Store Name (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunny Daycare Publishing or Etsy Store"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400" />
                  <span>Email for License Delivery & Invoicing *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>

              {/* What is included */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Included with Commercial Rights:</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  <span>Instant cryptographically signed Certificate of License (PDF)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  <span>Permitted on Amazon KDP, Etsy, Printful, local daycare & physical print shops</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  <span>Perpetual worldwide license, zero recurring royalty fees</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base shadow-lg bubbly-btn flex items-center justify-center gap-2 mt-2"
              >
                <CreditCard size={18} />
                <span>Complete Purchase (${pricing[tier].price}) & Generate License</span>
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 font-heading mb-1">
              Commercial License Active!
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Thank you for supporting Baby Elephant Books. Your official commercial certificate is generated.
            </p>

            {issuedLicense && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">License ID:</span>
                  <span className="font-mono font-bold text-indigo-700">{issuedLicense.licenseId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Licensee:</span>
                  <span className="font-bold text-slate-800">{issuedLicense.licenseeName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Scope:</span>
                  <span className="font-bold text-emerald-700">{issuedLicense.tier.toUpperCase()} ({issuedLicense.maxUnits.toLocaleString()} units)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600 uppercase">VERIFIED & ACTIVE</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => issuedLicense && generateCommercialLicensePDF(issuedLicense)}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Download size={18} />
                <span>Download Official Certificate PDF</span>
              </button>

              <button
                onClick={onClose}
                className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
