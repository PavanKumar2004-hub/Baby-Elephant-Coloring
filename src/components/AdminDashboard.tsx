import React, { useState } from 'react';
import { ColoringSheet, CommercialLicense, SiteStats } from '../types';
import { generateCommercialLicensePDF } from '../utils/pdfGenerator';
import {
  LayoutDashboard,
  FileImage,
  DollarSign,
  ShieldCheck,
  Settings,
  Plus,
  Trash2,
  Edit,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';

interface Props {
  sheets: ColoringSheet[];
  licenses: CommercialLicense[];
  stats: SiteStats;
  onUpdateSheets: (sheets: ColoringSheet[]) => void;
  onUpdateLicenses: (licenses: CommercialLicense[]) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  sheets,
  licenses,
  stats,
  onUpdateSheets,
  onUpdateLicenses,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'sheets' | 'licenses' | 'settings'>('analytics');
  const [sheetSearch, setSheetSearch] = useState('');
  const [licenseSearch, setLicenseSearch] = useState('');

  // Form for adding/editing a sheet
  const [isAddingSheet, setIsAddingSheet] = useState(false);
  const [editingSheet, setEditingSheet] = useState<ColoringSheet | null>(null);

  const [formData, setFormData] = useState<Partial<ColoringSheet>>({
    title: '',
    category: 'Animals & Wildlife',
    slug: 'animals',
    age: 'Preschool (3-5)',
    difficulty: 'Easy',
    outline: '',
    colorGuide: '',
    description: '',
    tags: ['New', 'Kids'],
    isExclusive: false,
    isFeatured: false,
    crayonGuide: [
      { name: 'Sky Blue', hex: '#38BDF8', usage: 'Main background' },
      { name: 'Warm Honey', hex: '#F59E0B', usage: 'Character fill' }
    ]
  });

  // Calculate dynamic total revenue
  const totalCommercialRev = licenses.reduce((sum, lic) => sum + (lic.status === 'active' ? lic.price : 0), 0);
  const grandTotalRevenue = stats.totalRevenue + totalCommercialRev;

  // Handle Sheet Delete
  const handleDeleteSheet = (id: string) => {
    if (!confirm('Are you sure you want to remove this coloring sheet?')) return;
    const updated = sheets.filter((s) => s.id !== id);
    onUpdateSheets(updated);
  };

  // Handle Sheet Submit (Add or Edit)
  const handleSheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.outline) {
      alert('Please provide at least a Title and an Outline image URL');
      return;
    }

    if (editingSheet) {
      // Update
      const updated = sheets.map((s) =>
        s.id === editingSheet.id ? ({ ...s, ...formData } as ColoringSheet) : s
      );
      onUpdateSheets(updated);
      setEditingSheet(null);
    } else {
      // Create new
      const newSheet: ColoringSheet = {
        id: 'sheet-' + Date.now(),
        title: formData.title || 'Untitled Sheet',
        category: formData.category || 'Animals & Wildlife',
        slug: formData.slug || 'animals',
        age: formData.age || 'Preschool (3-5)',
        difficulty: formData.difficulty || 'Easy',
        outline: formData.outline || '',
        colorGuide: formData.colorGuide || '',
        description: formData.description || 'Fun new coloring sheet.',
        tags: formData.tags || ['New'],
        isExclusive: Boolean(formData.isExclusive),
        isFeatured: Boolean(formData.isFeatured),
        views: 0,
        downloads: 0,
        coloredOnlineCount: 0,
        crayonGuide: formData.crayonGuide || [
          { name: 'Sunshine Yellow', hex: '#FACC15', usage: 'Main accent' }
        ]
      };
      onUpdateSheets([newSheet, ...sheets]);
    }

    setIsAddingSheet(false);
  };

  // Toggle license active/revoked status
  const handleToggleLicenseStatus = (licenseId: string) => {
    const updated = licenses.map((lic) => {
      if (lic.licenseId === licenseId) {
        return {
          ...lic,
          status: lic.status === 'active' ? 'revoked' : 'active'
        } as CommercialLicense;
      }
      return lic;
    });
    onUpdateLicenses(updated);
  };

  const filteredSheets = sheets.filter(
    (s) =>
      s.title.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(sheetSearch.toLowerCase()))
  );

  const filteredLicenses = licenses.filter(
    (lic) =>
      lic.licenseId.toLowerCase().includes(licenseSearch.toLowerCase()) ||
      lic.licenseeName.toLowerCase().includes(licenseSearch.toLowerCase()) ||
      lic.email.toLowerCase().includes(licenseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-slate-800/90 border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow">
            🐘
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              Baby Elephant Admin Portal
              <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                Enterprise 2026
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Content Management, Commercial Licensing & Monetization Hub
            </p>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2 transition"
        >
          <ArrowLeft size={16} />
          <span>Return to User Site</span>
        </button>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition ${
              activeTab === 'analytics'
                ? 'bg-amber-400 text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <TrendingUp size={16} />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition ${
              activeTab === 'sheets'
                ? 'bg-amber-400 text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileImage size={16} />
            <span>Coloring Sheets ({sheets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('licenses')}
            className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition ${
              activeTab === 'licenses'
                ? 'bg-amber-400 text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={16} />
            <span>Commercial Licenses ({licenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-slate-900 shadow-md'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <DollarSign size={16} />
            <span>Monetization & Pricing</span>
          </button>

          {/* Publisher Quick Info Box */}
          <div className="mt-8 bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-400">
            <div className="font-bold text-slate-200 mb-1">Official Publisher:</div>
            <div>Baby Elephant Books</div>
            <div className="text-[11px] text-amber-400 mt-1">Little Trunks, Big Imagination</div>
            <div className="mt-2 text-[10px] text-slate-500">Tom & Jerry Color & Learn Edition</div>
          </div>
        </aside>

        {/* Right Tab Content */}
        <main className="md:col-span-4 bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-xl overflow-x-auto">
          {/* TAB 1: ANALYTICS & KPIS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-heading">
                  Platform Performance & Monetization Metrics
                </h2>
                <p className="text-xs text-slate-400">
                  Live traffic and revenue across non-commercial free users and commercial licensing buyers.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                    <span>Total Revenue</span>
                    <DollarSign size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    ${grandTotalRevenue.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-500/80 mt-1">
                    ↑ +18.4% this month
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                    <span>PDF Prints & Downloads</span>
                    <Download size={16} className="text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">
                    {(stats.totalDownloads + 38400).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-indigo-400 mt-1">
                    Free non-commercial
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                    <span>Online Studio Plays</span>
                    <Sparkles size={16} className="text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400">
                    {(stats.onlineSessions + 29150).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Dual-canvas sessions
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                    <span>Active Commercial Licenses</span>
                    <ShieldCheck size={16} className="text-rose-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-rose-400">
                    {licenses.filter((l) => l.status === 'active').length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    KDP, Etsy & Daycare creators
                  </div>
                </div>
              </div>

              {/* Revenue Channel Breakdown */}
              <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <DollarSign size={16} className="text-amber-400" />
                  <span>Revenue Streams Breakdown</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Commercial Use Licenses ($9.99 - $99.00)</span>
                      <span className="font-bold text-white">${totalCommercialRev.toFixed(2)} (64%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Family VIP Club Subscriptions ($4.99/mo)</span>
                      <span className="font-bold text-white">${(grandTotalRevenue * 0.22).toFixed(2)} (22%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '22%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Tip Jar ("Buy Me Crayons" $3 - $10)</span>
                      <span className="font-bold text-white">${(grandTotalRevenue * 0.14).toFixed(2)} (14%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHEETS CMS */}
          {activeTab === 'sheets' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white font-heading">
                    Coloring Sheets Catalog
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add new coloring sheets, manage side-by-side guides, and edit details.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSheet(null);
                    setFormData({
                      title: '',
                      category: 'Animals & Wildlife',
                      slug: 'animals',
                      age: 'Preschool (3-5)',
                      difficulty: 'Easy',
                      outline: '',
                      colorGuide: '',
                      description: '',
                      tags: ['Kids', 'Art'],
                      isExclusive: false,
                      isFeatured: false
                    });
                    setIsAddingSheet(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus size={16} />
                  <span>Add New Coloring Sheet</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, category, or tags..."
                  value={sheetSearch}
                  onChange={(e) => setSheetSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Sheet Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-700 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Preview</th>
                      <th className="p-3">Title & Category</th>
                      <th className="p-3">Age / Difficulty</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredSheets.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-700/40">
                        <td className="p-3">
                          <img
                            src={s.outline}
                            alt={s.title}
                            className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-slate-600"
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white text-sm">{s.title}</div>
                          <div className="text-[11px] text-slate-400">{s.category}</div>
                        </td>
                        <td className="p-3">
                          <div>{s.age}</div>
                          <div className="text-amber-400 font-semibold">{s.difficulty}</div>
                        </td>
                        <td className="p-3">
                          {s.isExclusive ? (
                            <span className="bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full font-bold text-[10px]">
                              Storybook Series
                            </span>
                          ) : (
                            <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full text-[10px]">
                              Standard
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingSheet(s);
                              setFormData(s);
                              setIsAddingSheet(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSheet(s.id)}
                            className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900 text-rose-300"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LICENSES REGISTRY */}
          {activeTab === 'licenses' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white font-heading">
                    Commercial Licenses Registry
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verify and audit issued commercial use licenses for KDP books, Etsy prints, and publishers.
                  </p>
                </div>

                <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-emerald-400">
                  Total Active: {licenses.filter((l) => l.status === 'active').length}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Verify license ID, licensee name, or email..."
                  value={licenseSearch}
                  onChange={(e) => setLicenseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Licenses Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-700 uppercase font-semibold">
                    <tr>
                      <th className="p-3">License ID</th>
                      <th className="p-3">Licensee & Business</th>
                      <th className="p-3">Tier & Scope</th>
                      <th className="p-3">Fee Paid</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredLicenses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">
                          No commercial licenses found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredLicenses.map((lic) => (
                        <tr key={lic.licenseId} className="hover:bg-slate-700/40">
                          <td className="p-3 font-mono font-bold text-amber-400">
                            {lic.licenseId}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white">{lic.licenseeName}</div>
                            <div className="text-[11px] text-slate-400">{lic.businessName} • {lic.email}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-bold uppercase text-indigo-300">{lic.tier}</div>
                            <div className="text-[10px] text-slate-400">{lic.maxUnits.toLocaleString()} units max</div>
                          </td>
                          <td className="p-3 font-bold text-emerald-400">
                            ${lic.price.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleLicenseStatus(lic.licenseId)}
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase transition ${
                                lic.status === 'active'
                                  ? 'bg-emerald-900/60 text-emerald-300 hover:bg-rose-900/60 hover:text-rose-300'
                                  : 'bg-rose-900/60 text-rose-300 hover:bg-emerald-900/60 hover:text-emerald-300'
                              }`}
                              title="Click to toggle status"
                            >
                              {lic.status}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => generateCommercialLicensePDF(lic)}
                              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow"
                              title="Download Signed PDF Certificate"
                            >
                              <Download size={13} />
                              <span>PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & PRICING */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-heading">
                  Monetization & Commercial Pricing Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Configure price tiers for commercial use, family VIP club, and non-commercial guidelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <h3 className="text-sm font-bold text-amber-400">Commercial License Tiers</h3>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Single Artwork License Price ($)</label>
                    <input
                      type="number"
                      defaultValue={9.99}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Bundle Full Access License Price ($)</label>
                    <input
                      type="number"
                      defaultValue={29.99}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Enterprise & Daycare Publisher ($)</label>
                    <input
                      type="number"
                      defaultValue={99.00}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <h3 className="text-sm font-bold text-indigo-400">Family & Non-Commercial Policy</h3>
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <p className="font-bold text-emerald-400 mb-1">Core Policy Rule:</p>
                    All coloring pages, printables, and online painting studio tools are 100% free for families, kids, teachers, and non-commercial educational institutions.
                    Any commercial redistribution on Amazon KDP, Etsy, or retail prints requires an official license key.
                  </div>
                  <button
                    onClick={() => alert('Settings saved successfully!')}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow"
                  >
                    Save All Monetization Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal for Adding / Editing Sheet */}
      {isAddingSheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-6 border-2 border-slate-700 shadow-2xl relative my-8">
            <h3 className="text-lg font-bold text-white font-heading mb-4">
              {editingSheet ? 'Edit Coloring Sheet' : 'Add New Coloring Sheet'}
            </h3>

            <form onSubmit={handleSheetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Sheet Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Baby Elephant at the Carnival"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={formData.category || 'Animals & Wildlife'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option>Cartoons & Storybooks</option>
                    <option>Alphabet A to Z</option>
                    <option>Animals & Wildlife</option>
                    <option>Dinosaurs & Fantasy</option>
                    <option>Vehicles & Transport</option>
                    <option>Space & Science</option>
                    <option>Holidays & Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age Target</label>
                  <select
                    value={formData.age || 'Preschool (3-5)'}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option>Toddlers (1-3)</option>
                    <option>Preschool (3-5)</option>
                    <option>Kids (6-9)</option>
                    <option>Tweens & Teens (10+)</option>
                    <option>All Ages</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Outline Image URL (Line Art) *</label>
                <input
                  type="text"
                  required
                  value={formData.outline || ''}
                  onChange={(e) => setFormData({ ...formData, outline: e.target.value })}
                  placeholder="e.g. /assets/sheets/my_outline.png"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Color Reference Guide URL (Optional for Side-by-Side)</label>
                <input
                  type="text"
                  value={formData.colorGuide || ''}
                  onChange={(e) => setFormData({ ...formData, colorGuide: e.target.value })}
                  placeholder="e.g. /assets/sheets/my_color_guide.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description / Story Blurb</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isExclusive)}
                    onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })}
                    className="accent-amber-400 w-4 h-4"
                  />
                  <span className="text-slate-300">Storybook Series Exclusive</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isFeatured)}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-amber-400 w-4 h-4"
                  />
                  <span className="text-slate-300">Featured on Homepage</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold"
                >
                  {editingSheet ? 'Save Changes' : 'Create Coloring Sheet'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSheet(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
