export interface CrayonColor {
  name: string;
  hex: string;
  usage: string;
}

export interface ColoringSheet {
  id: string;
  title: string;
  category: string;
  slug: string;
  age: 'Toddlers (1-3)' | 'Preschool (3-5)' | 'Kids (6-9)' | 'Tweens & Teens (10+)' | 'All Ages';
  difficulty: 'Easy' | 'Medium' | 'Detailed';
  colorGuide?: string;
  outline: string;
  description: string;
  tags: string[];
  isExclusive?: boolean;
  isFeatured?: boolean;
  crayonGuide: CrayonColor[];
  views?: number;
  downloads?: number;
  coloredOnlineCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  count?: number;
  gradient: string;
}

export interface CommercialLicense {
  licenseId: string;
  licenseeName: string;
  businessName: string;
  email: string;
  tier: 'single' | 'bundle' | 'enterprise';
  itemTitle: string;
  price: number;
  purchasedAt: string;
  status: 'active' | 'revoked';
  maxUnits: number;
  allowedChannels: string[];
}

export interface SiteStats {
  totalPageViews: number;
  totalDownloads: number;
  totalPrintJobs: number;
  onlineSessions: number;
  totalRevenue: number;
  commercialLicensesIssued: number;
}

export interface AdSettings {
  networkMode: 'mock' | 'adsense' | 'monetag' | 'custom';
  adsenseClientId: string; // e.g. ca-pub-XXXXXXXXXXXXXXXX
  adsenseBannerSlot: string; // e.g. 1234567890
  adsenseInterstitialSlot: string;
  monetagZoneId: string;
  monetagDirectLink: string;
  showDownloadAds: boolean;
  showBannerAds: boolean;
  estimatedCpm: number;
  coppaStrict: boolean;
  customScriptHeader?: string;
}

export interface GlobalSettings {
  announcementText: string;
  announcementActive: boolean;
  enableBubbles: boolean;
  enableAudio: boolean;
  defaultInkSaver: boolean;
  watermarkText: string;
  siteName: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'download' | 'print' | 'colored' | 'license' | 'ad_impression';
  title: string;
  detail: string;
  badgeColor: string;
}

