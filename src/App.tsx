import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ColoringSheet, CommercialLicense, SiteStats, AdSettings, GlobalSettings, ActivityItem } from './types';
import { INITIAL_SHEETS } from './data/sheets';
import { COLORING_BOOKS, ColoringBookData } from './data/books';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingBubbles } from './components/FloatingBubbles';
import { DownloadAdModal } from './components/DownloadAdModal';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { SheetDetailPage } from './pages/SheetDetailPage';
import { BooksPage } from './pages/BooksPage';
import { LicensingPage } from './pages/LicensingPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { ColoringStudio } from './components/ColoringStudio';
import { ClassroomPrintModal } from './components/ClassroomPrintModal';
import { CommercialLicenseModal } from './components/CommercialLicenseModal';
import { LittleArtistCertificateModal } from './components/LittleArtistCertificateModal';
import { TipJarModal } from './components/TipJarModal';
import { generateCompleteBookPDF, generateSingleSheetPDF, generateClassroomSetPDF } from './utils/pdfGenerator';
import {
  fetchSheetsFromCloud,
  fetchBooksFromCloud,
  seedInitialCloudDataIfNeeded
} from './utils/supabase';

export const AppContent: React.FC = () => {
  // 1. Data States (persisted to LocalStorage + synced to Supabase Cloud)
  const [sheets, setSheets] = useState<ColoringSheet[]>(() => {
    const saved = localStorage.getItem('be_sheets');
    return saved ? JSON.parse(saved) : INITIAL_SHEETS;
  });

  const [books, setBooks] = useState<ColoringBookData[]>(() => {
    const saved = localStorage.getItem('be_books');
    return saved ? JSON.parse(saved) : COLORING_BOOKS;
  });

  // Cloud Sync on Mount: Fetch real-time published sheets & books from Supabase Cloud
  useEffect(() => {
    let isMounted = true;
    async function syncCloud() {
      try {
        const cloudSheets = await fetchSheetsFromCloud();
        if (isMounted && cloudSheets && cloudSheets.length > 0) {
          setSheets(cloudSheets);
          localStorage.setItem('be_sheets', JSON.stringify(cloudSheets));
        }

        const cloudBooks = await fetchBooksFromCloud();
        if (isMounted && cloudBooks && cloudBooks.length > 0) {
          setBooks(cloudBooks);
          localStorage.setItem('be_books', JSON.stringify(cloudBooks));
        }

        // Auto-seed initial catalog if cloud database is brand new and empty
        if ((!cloudSheets || cloudSheets.length === 0) || (!cloudBooks || cloudBooks.length === 0)) {
          await seedInitialCloudDataIfNeeded(INITIAL_SHEETS, COLORING_BOOKS);
        }
      } catch (e) {
        console.warn('Supabase initial fetch skipped / offline:', e);
      }
    }
    syncCloud();
    return () => { isMounted = false; };
  }, []);

  const [licenses, setLicenses] = useState<CommercialLicense[]>(() => {
    const saved = localStorage.getItem('be_licenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out legacy dummy licenses
        const clean = parsed.filter((l: CommercialLicense) => !l.licenseId?.startsWith('BE-LIC-KDP-8921') && !l.licenseId?.startsWith('BE-LIC-ETS-4105'));
        return clean;
      } catch {
        return [];
      }
    }
    return [];
  });

  const [stats, setStats] = useState<SiteStats>(() => {
    const saved = localStorage.getItem('be_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear legacy fake stats (e.g. 41200 or 84200)
        if (parsed.totalDownloads >= 40000 || parsed.totalPageViews >= 80000) {
          return {
            totalPageViews: 0,
            totalDownloads: 0,
            totalPrintJobs: 0,
            onlineSessions: 0,
            totalRevenue: 0,
            commercialLicensesIssued: 0,
          };
        }
        return parsed;
      } catch {
        // fallback
      }
    }
    return {
      totalPageViews: 0,
      totalDownloads: 0,
      totalPrintJobs: 0,
      onlineSessions: 0,
      totalRevenue: 0,
      commercialLicensesIssued: 0,
    };
  });

  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    const saved = localStorage.getItem('be_ad_settings');
    return saved ? JSON.parse(saved) : {
      networkMode: 'mock',
      adsenseClientId: '',
      adsenseBannerSlot: '',
      adsenseInterstitialSlot: '',
      monetagZoneId: '',
      monetagDirectLink: '',
      showDownloadAds: true,
      showBannerAds: true,
      estimatedCpm: 8.50,
      coppaStrict: true,
    };
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('be_global_settings');
    return saved ? JSON.parse(saved) : {
      announcementText: '✨ 100% Free Coloring Pages & Multi-Page Books for Families & Classrooms',
      announcementActive: true,
      enableBubbles: true,
      enableAudio: true,
      defaultInkSaver: true,
      watermarkText: 'Baby Elephant Books • 100% Free Non-Commercial Edition',
      siteName: 'Baby Elephant Books'
    };
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('be_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const clean = parsed.filter((a: ActivityItem) => !a.id?.startsWith('act-'));
        return clean;
      } catch {
        return [];
      }
    }
    return [];
  });

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('be_sheets', JSON.stringify(sheets));
  }, [sheets]);

  useEffect(() => {
    localStorage.setItem('be_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('be_licenses', JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
    localStorage.setItem('be_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('be_ad_settings', JSON.stringify(adSettings));
  }, [adSettings]);

  useEffect(() => {
    localStorage.setItem('be_global_settings', JSON.stringify(globalSettings));
  }, [globalSettings]);

  useEffect(() => {
    localStorage.setItem('be_activities', JSON.stringify(activities));
  }, [activities]);

  // Activity Logger
  const handleAddActivity = (activity: ActivityItem) => {
    setActivities((prev) => [activity, ...prev.slice(0, 49)]); // keep last 50
  };

  const handleClearActivities = () => {
    setActivities([]);
  };

  const handleRestoreAllData = (data: any) => {
    if (data.sheets) setSheets(data.sheets);
    if (data.books) setBooks(data.books);
    if (data.licenses) setLicenses(data.licenses);
    if (data.stats) setStats(data.stats);
    if (data.adSettings) setAdSettings(data.adSettings);
    if (data.globalSettings) setGlobalSettings(data.globalSettings);
    if (data.activities) setActivities(data.activities);
  };

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeStudioSheet, setActiveStudioSheet] = useState<ColoringSheet | null>(null);
  const [activePrintSheet, setActivePrintSheet] = useState<ColoringSheet | null>(null);
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
  const [activeCommercialSheet, setActiveCommercialSheet] = useState<ColoringSheet | null>(null);
  const [isCommercialModalOpen, setIsCommercialModalOpen] = useState(false);
  const [isTipJarOpen, setIsTipJarOpen] = useState(false);
  const [certificateData, setCertificateData] = useState<{ sheet: ColoringSheet; artworkUrl: string } | null>(null);

  // Download Ad Interstitial
  const [pendingDownload, setPendingDownload] = useState<{ title: string; action: () => void } | null>(null);

  // Handlers
  const handleOpenStudio = (sheet: ColoringSheet) => {
    setActiveStudioSheet(sheet);
    setStats((prev) => ({
      ...prev,
      onlineSessions: prev.onlineSessions + 1
    }));
    handleAddActivity({
      id: 'act-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'colored',
      title: 'Studio Session Started',
      detail: `Started coloring "${sheet.title}"`,
      badgeColor: 'bg-amber-400'
    });
  };

  const handleOpenPrint = (sheet?: ColoringSheet) => {
    const s = sheet || sheets[0];
    if (adSettings.showDownloadAds) {
      setPendingDownload({
        title: s.title,
        action: () => {
          setActivePrintSheet(s);
          setIsClassroomModalOpen(true);
        }
      });
    } else {
      setActivePrintSheet(s);
      setIsClassroomModalOpen(true);
    }
  };

  const handleDownloadBookWithAd = (book: ColoringBookData) => {
    const downloadAction = async () => {
      const bookSheets = sheets.filter((s) => book.sheetIds.includes(s.id));
      const finalSheets = bookSheets.length > 0 ? bookSheets : sheets.slice(0, book.pageCount - 2);
      await generateCompleteBookPDF(book, finalSheets, "Little Artist");
      setStats((prev) => ({
        ...prev,
        totalDownloads: prev.totalDownloads + 1,
        totalRevenue: prev.totalRevenue + (adSettings.estimatedCpm / 1000)
      }));
      handleAddActivity({
        id: 'act-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'download',
        title: 'Full Coloring Book Downloaded',
        detail: `"${book.title}" (${book.pageCount} Pages PDF)`,
        badgeColor: 'bg-emerald-500'
      });
    };

    if (adSettings.showDownloadAds) {
      setPendingDownload({
        title: `${book.title} (Complete ${book.pageCount}-Page Volume)`,
        action: downloadAction
      });
    } else {
      downloadAction();
    }
  };

  const handleOpenCommercial = (sheet?: ColoringSheet) => {
    setActiveCommercialSheet(sheet || null);
    setIsCommercialModalOpen(true);
  };

  const handleSaveLicense = (lic: CommercialLicense) => {
    setLicenses((prev) => [lic, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalRevenue: prev.totalRevenue + lic.price,
      commercialLicensesIssued: prev.commercialLicensesIssued + 1
    }));
    handleAddActivity({
      id: 'act-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'license',
      title: 'Commercial License Purchased',
      detail: `${lic.licenseId} issued for ${lic.licenseeName} ($${lic.price.toFixed(2)})`,
      badgeColor: 'bg-indigo-500'
    });
  };

  const handleTipSuccess = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      totalRevenue: prev.totalRevenue + amount
    }));
    handleAddActivity({
      id: 'act-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'license',
      title: 'Community Tip Received',
      detail: `Family supporter tipped $${amount.toFixed(2)}`,
      badgeColor: 'bg-amber-400'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] relative">
      {/* Floating Animated Bubbles for Kids Fun (Toggleable from Admin) */}
      {globalSettings.enableBubbles && <FloatingBubbles />}

      <Routes>
        {/* Isolated Enterprise Admin Dashboard Route (Completely Hidden from Public Visitors) */}
        {['/admin', '/manage', '/publisher'].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <AdminPage
                sheets={sheets}
                books={books}
                licenses={licenses}
                stats={stats}
                adSettings={adSettings}
                globalSettings={globalSettings}
                activities={activities}
                onUpdateSheets={setSheets}
                onUpdateBooks={setBooks}
                onUpdateLicenses={setLicenses}
                onUpdateStats={setStats}
                onUpdateAdSettings={setAdSettings}
                onUpdateGlobalSettings={setGlobalSettings}
                onAddActivity={handleAddActivity}
                onClearActivities={handleClearActivities}
                onRestoreAllData={handleRestoreAllData}
              />
            }
          />
        ))}

        {/* Public Routes with Navbar & Footer */}
        <Route
          path="*"
          element={
            <>
              <Navbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenTipJar={() => setIsTipJarOpen(true)}
                announcementText={globalSettings.announcementText}
                announcementActive={globalSettings.announcementActive}
              />

              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        sheets={sheets}
                        onColorOnline={handleOpenStudio}
                        onPrintSheet={handleOpenPrint}
                        onDownloadBook={handleDownloadBookWithAd}
                        onCommercialLicense={handleOpenCommercial}
                        onOpenTipJar={() => setIsTipJarOpen(true)}
                      />
                    }
                  />

                  <Route
                    path="/category/:slug"
                    element={
                      <CategoryPage
                        sheets={sheets}
                        onColorOnline={handleOpenStudio}
                        onPrintSheet={handleOpenPrint}
                        onCommercialLicense={handleOpenCommercial}
                      />
                    }
                  />

                  <Route
                    path="/sheet/:id"
                    element={
                      <SheetDetailPage
                        sheets={sheets}
                        onColorOnline={handleOpenStudio}
                        onCommercialLicense={handleOpenCommercial}
                      />
                    }
                  />

                  <Route
                    path="/books"
                    element={<BooksPage sheets={sheets} books={books} />}
                  />

                  <Route
                    path="/color-online"
                    element={
                      <div className="py-2">
                        <ColoringStudio
                          sheet={sheets[0]}
                          allSheets={sheets}
                          onSelectSheet={setActiveStudioSheet}
                          onClose={() => window.location.hash = '#/'}
                          onOpenCertificate={(sheet, artworkUrl) => setCertificateData({ sheet, artworkUrl })}
                        />
                      </div>
                    }
                  />

                  <Route
                    path="/licensing"
                    element={
                      <LicensingPage
                        licenses={licenses}
                        onOpenCommercialModal={() => handleOpenCommercial()}
                      />
                    }
                  />

                  <Route
                    path="/about"
                    element={<AboutPage />}
                  />
                </Routes>
              </main>

              <Footer onOpenTipJar={() => setIsTipJarOpen(true)} />
            </>
          }
        />
      </Routes>

      {/* Floating Studio Modal when launched from cards */}
      {activeStudioSheet && (
        <ColoringStudio
          sheet={activeStudioSheet}
          allSheets={sheets}
          onSelectSheet={setActiveStudioSheet}
          onClose={() => setActiveStudioSheet(null)}
          onOpenCertificate={(sheet, artworkUrl) => {
            setCertificateData({ sheet, artworkUrl });
            setActiveStudioSheet(null);
            handleAddActivity({
              id: 'act-' + Date.now(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'colored',
              title: 'Artist Diploma Awarded',
              detail: `Diploma generated for "${sheet.title}"`,
              badgeColor: 'bg-amber-400'
            });
          }}
        />
      )}

      {/* Download Interstitial Ad Modal */}
      {pendingDownload && (
        <DownloadAdModal
          title={pendingDownload.title}
          onConfirmDownload={() => {
            pendingDownload.action();
            setPendingDownload(null);
          }}
          onClose={() => setPendingDownload(null)}
          onAdImpression={() => {
            setStats((prev) => ({
              ...prev,
              totalRevenue: prev.totalRevenue + (adSettings.estimatedCpm / 1000)
            }));
            handleAddActivity({
              id: 'act-' + Date.now(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'ad_impression',
              title: 'Ad Impression Recorded',
              detail: `Ad viewed on download of "${pendingDownload.title.slice(0, 30)}..."`,
              badgeColor: 'bg-rose-500'
            });
          }}
          onAdClick={() => {
            setStats((prev) => ({
              ...prev,
              totalRevenue: prev.totalRevenue + 0.85
            }));
            handleAddActivity({
              id: 'act-' + Date.now(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'ad_impression',
              title: 'Ad Click Generated',
              detail: 'Visitor clicked sponsored family art offer ($0.85 earned)',
              badgeColor: 'bg-emerald-400'
            });
          }}
        />
      )}

      {/* Print / Classroom / Book Modal */}
      {isClassroomModalOpen && (
        <ClassroomPrintModal
          sheet={activePrintSheet}
          allSheets={sheets}
          onClose={() => setIsClassroomModalOpen(false)}
        />
      )}

      {/* Commercial License Modal */}
      {isCommercialModalOpen && (
        <CommercialLicenseModal
          sheet={activeCommercialSheet}
          onClose={() => setIsCommercialModalOpen(false)}
          onSaveLicense={handleSaveLicense}
        />
      )}

      {/* Little Artist Diploma Modal */}
      {certificateData && (
        <LittleArtistCertificateModal
          sheet={certificateData.sheet}
          artworkUrl={certificateData.artworkUrl}
          onClose={() => setCertificateData(null)}
        />
      )}

      {/* Tip Jar Modal */}
      {isTipJarOpen && (
        <TipJarModal
          onClose={() => setIsTipJarOpen(false)}
          onSuccess={handleTipSuccess}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};
