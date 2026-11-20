import React, { useState } from 'react';
import { CommercialLicense } from '../types';
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, Download, CreditCard, Sparkles, Building2, User } from 'lucide-react';
import { generateCommercialLicensePDF } from '../utils/pdfGenerator';

interface Props {
  licenses: CommercialLicense[];
  onOpenCommercialModal: () => void;
}

export const LicensingPage: React.FC<Props> = ({ licenses, onOpenCommercialModal }) => {
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<CommercialLicense | null | 'not_found'>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyQuery.trim()) return;
    const match = licenses.find(
      (l) => l.licenseId.toLowerCase() === verifyQuery.trim().toLowerCase()
    );
    if (match) {
      setVerificationResult(match);
    } else {
      setVerificationResult('not_found');
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
          <ShieldCheck size={14} className="text-amber-700" />
          <span>Legal & Commercial Rights Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Licensing Guidelines & Verification
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Our artwork is <strong>100% free forever for personal, family and educational non-commercial use</strong>.
          For commercial distribution on Amazon KDP, Etsy, or retail prints, an official license is required.
        </p>
      </header>

      {/* Comparison: Free Non-Commercial vs Commercial License */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-max mb-3 uppercase">
              Non-Commercial Use
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-heading mb-1">
              $0 (Free Forever)
            </div>
            <p className="text-xs text-slate-500 mb-6">
              For children, parents, families, homeschooling and teachers.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Unlimited home coloring & single-sheet printing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>2-Per-Page classroom paper-saver print sets</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Full multi-page storybook downloads & diplomas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Interactive online coloring studio with all tools</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400">
            No registration or credit card needed. Just click and print!
          </div>
        </div>

        {/* Commercial Tier */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/70 rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-lg flex flex-col justify-between relative">
          <div className="absolute top-4 right-4 bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
            Commercial Use
          </div>

          <div>
            <div className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full w-max mb-3 uppercase">
              Publishers & Creators
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-heading mb-1">
              From $9.99
            </div>
            <p className="text-xs text-slate-500 mb-6">
              For Amazon KDP publishers, Etsy sellers, daycare businesses and merch.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0" />
                <span>Sell print-on-demand books on <strong>Amazon KDP</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0" />
                <span>Sell printable worksheets on <strong>Etsy & Shopify</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0" />
                <span>Commercial daycare & private school curricula</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0" />
                <span>Instant cryptographically signed <strong>Legal PDF Certificate</strong></span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={onOpenCommercialModal}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md bubbly-btn flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              <span>Purchase Commercial Rights</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive License Key Verification Tool */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
        <div className="max-w-xl mx-auto text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-2 font-bold">
            🔍
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading">
            Live License Verification Tool
          </h2>
          <p className="text-xs text-slate-500">
            Auditors, marketplaces (Amazon KDP, Etsy) and customers can verify the authenticity of any Baby Elephant Books commercial license.
          </p>
        </div>

        <form onSubmit={handleVerify} className="max-w-lg mx-auto flex gap-2 mb-6">
          <input
            type="text"
            required
            placeholder="Enter License ID (e.g. BE-LIC-KDP-8921)"
            value={verifyQuery}
            onChange={(e) => setVerifyQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow"
          >
            Verify License
          </button>
        </form>

        {/* Verification Result Card */}
        {verificationResult && verificationResult !== 'not_found' && (
          <div className="max-w-lg mx-auto bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-left text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm pb-2 border-b border-emerald-200">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>OFFICIAL COMMERCIAL LICENSE VERIFIED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">License ID:</span>
                <strong className="font-mono text-indigo-800">{verificationResult.licenseId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Licensee:</span>
                <strong>{verificationResult.licenseeName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Business:</span>
                <strong>{verificationResult.businessName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status:</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-extrabold uppercase text-[9px]">
                  {verificationResult.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => generateCommercialLicensePDF(verificationResult)}
              className="mt-3 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Download size={14} />
              <span>Download Official Legal PDF Certificate</span>
            </button>
          </div>
        )}

        {verificationResult === 'not_found' && (
          <div className="max-w-lg mx-auto bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-center text-xs text-rose-800 flex items-center justify-center gap-2">
            <AlertTriangle size={18} className="text-rose-600" />
            <span>No active license found matching "{verifyQuery}". Please check the ID or contact support.</span>
          </div>
        )}
      </section>
    </div>
  );
};
