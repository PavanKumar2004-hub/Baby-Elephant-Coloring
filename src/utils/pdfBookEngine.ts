// Professional Multi-Page Printable PDF Book Studio Engine
// Matches the architecture, page order, and visual styling of Christmas.pdf
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface PDFGeneratorConfig {
  bookTitle: string;
  bookSubtitle: string;
  bgColor: string; // e.g. '#4A94FF' (Christmas Sky Blue)
  titleColor: string; // e.g. '#FFFFFF'
  subtitleColor: string; // e.g. '#FEF08A'
  titleFontFamily: string; // 'helvetica', 'times', 'courier'
  titleFontSize: number; // e.g. 36 pt
  subtitleFontFamily: string;
  subtitleFontSize: number; // e.g. 20 pt
  coverImageUrl: string;
  brandLogoUrl: string; // '/assets/branding/baby_elephant_logo.jpg'
  websiteUrl: string; // e.g. 'www.babyelephantbooks.com'
  publisherName: string; // e.g. 'Baby Elephant Books'
  publisherTagline: string; // e.g. "Free & personalised children's books"
  illustratorName: string; // e.g. 'Baby Elephant Illustrations'
  pdfDownloadUrl: string; // dynamic URL for QR code
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  // Related books with multiple covers per category for Page N-1
  relatedCategories: Array<{
    category: string;
    title: string;
    ctaText: string;
    covers: string[]; // 1 to 4 book covers for the fan-out display
  }>;
  // Specific selected sheets to include in the book (in order)
  selectedSheets: Array<{
    id: string;
    title: string;
    outline: string;
    colorGuide?: string;
  }>;
}

// Convert image url or base64 to HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('Empty image source'));
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src.slice(0, 50)}...`));
    img.src = src;
  });
}

// Generate Crisp Official Social Media Icon PNG Data URL
function createSocialIconDataUrl(type: 'fb' | 'tw' | 'in' | 'wa', size = 96): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const scale = size / 24;

  if (type === 'fb') {
    // Facebook Blue
    ctx.fillStyle = '#1877F2';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.22);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    const p = new Path2D('M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z');
    ctx.save();
    ctx.scale(scale, scale);
    ctx.fill(p);
    ctx.restore();
  } else if (type === 'tw') {
    // X (Twitter) Black
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.22);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    const p = new Path2D('M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z');
    ctx.save();
    ctx.scale(scale, scale);
    ctx.fill(p);
    ctx.restore();
  } else if (type === 'in') {
    // LinkedIn Blue
    ctx.fillStyle = '#0A66C2';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.22);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    const p = new Path2D('M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.95 0-1.72.77-1.72 1.72s.77 1.72 1.72 1.72 1.72-.77 1.72-1.72-.77-1.72-1.72-1.72z');
    ctx.save();
    ctx.scale(scale, scale);
    ctx.fill(p);
    ctx.restore();
  } else if (type === 'wa') {
    // WhatsApp Green
    ctx.fillStyle = '#25D366';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.22);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    const p = new Path2D('M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1 1.49-.07 1.47-.61 1.68-1.2.21-.59.21-1.1.15-1.2-.06-.1-.22-.17-.47-.29');
    ctx.save();
    ctx.scale(scale, scale);
    ctx.fill(p);
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

export async function generateCustomMarketBookPDF(config: PDFGeneratorConfig): Promise<void> {
  // Exact US Letter dimensions matching Christmas.pdf (612 x 792 points)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [612, 792]
  });

  const pageWidth = 612;
  const pageHeight = 792;

  // Pre-load Brand Logo
  let brandLogoImg: HTMLImageElement | null = null;
  const brandLogoUrl = config.brandLogoUrl || '/assets/branding/baby_elephant_logo.jpg';
  try {
    brandLogoImg = await loadImage(brandLogoUrl);
  } catch (err) {
    console.warn('Brand logo could not be loaded:', err);
  }

  // Pre-generate Dynamic QR Code
  const qrUrl = config.pdfDownloadUrl || `https://${config.websiteUrl}/#/books`;
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(qrUrl, { margin: 1, width: 256 });
  } catch (err) {
    console.error('QR code generation failed', err);
  }

  // Pre-generate official social icons
  const fbIcon = createSocialIconDataUrl('fb');
  const twIcon = createSocialIconDataUrl('tw');
  const inIcon = createSocialIconDataUrl('in');
  const waIcon = createSocialIconDataUrl('wa');

  // Background RGB
  const cleanHex = config.bgColor.replace('#', '');
  const bgR = parseInt(cleanHex.substring(0, 2), 16) || 74;
  const bgG = parseInt(cleanHex.substring(2, 4), 16) || 148;
  const bgB = parseInt(cleanHex.substring(4, 6), 16) || 255;

  const titleFont = config.titleFontFamily || 'helvetica';
  const subtitleFont = config.subtitleFontFamily || 'helvetica';

  // ==========================================
  // PAGE 1: FRONT COVER (Matching Christmas.pdf Page 1)
  // ==========================================
  doc.setFillColor(bgR, bgG, bgB);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Left: Free Download Badge (Clean crisp white rounded ribbon matching reference)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(1.2);
  doc.roundedRect(28, 28, 100, 48, 8, 8, 'FD');
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text('Free', 78, 48, { align: 'center' });
  doc.setFontSize(13);
  doc.text('Download', 78, 66, { align: 'center' });

  // Top Right: Dynamic QR Code Box
  if (qrDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 84, 28, 56, 56, 8, 8, 'F');
    doc.addImage(qrDataUrl, 'PNG', pageWidth - 80, 32, 48, 48);
  }

  // Cover Main Title
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(config.titleFontSize || 42);
  doc.setTextColor(255, 255, 255);
  doc.text(config.bookTitle.toUpperCase(), pageWidth / 2, 130, { align: 'center' });

  // Cover Subtitle
  doc.setFont(subtitleFont, 'bold');
  doc.setFontSize(config.subtitleFontSize || 26);
  doc.setTextColor(254, 240, 138); // Warm yellow
  doc.text(config.bookSubtitle.toUpperCase(), pageWidth / 2, 165, { align: 'center' });

  // Cover Main Illustration Image
  if (config.coverImageUrl) {
    try {
      const coverImg = await loadImage(config.coverImageUrl);
      const maxImgW = 440;
      const maxImgH = 430;
      const imgRatio = coverImg.width / coverImg.height;
      let drawW = maxImgW;
      let drawH = maxImgW / imgRatio;
      if (drawH > maxImgH) {
        drawH = maxImgH;
        drawW = maxImgH * imgRatio;
      }
      const imgX = (pageWidth - drawW) / 2;
      const imgY = 190 + (maxImgH - drawH) / 2;

      // Draw subtle white border frame
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(imgX - 4, imgY - 4, drawW + 8, drawH + 8, 10, 10, 'F');
      doc.addImage(coverImg, 'PNG', imgX, imgY, drawW, drawH);
    } catch (e) {
      console.warn('Cover image load error:', e);
    }
  }

  // Cover Footer: Illustrated by (Left) and Published by (Right) WITH BRAND LOGO ICON
  // Left: Illustrated by
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Illustrated by', 28, pageHeight - 48);

  if (brandLogoImg) {
    doc.addImage(brandLogoImg, 'JPEG', 28, pageHeight - 40, 24, 24);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(config.illustratorName, brandLogoImg ? 58 : 28, pageHeight - 24);

  // Right: Published by
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Published by', pageWidth - 28, pageHeight - 48, { align: 'right' });

  if (brandLogoImg) {
    doc.addImage(brandLogoImg, 'JPEG', pageWidth - 52, pageHeight - 40, 24, 24);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(config.publisherName, brandLogoImg ? pageWidth - 58 : pageWidth - 28, pageHeight - 24, { align: 'right' });

  // ==========================================
  // PAGES 2 to N-2: SELECTED BOOK SPREADS
  // In strict order: [Color Guide Spread] -> [Line-Art Drawing Spread]
  // ==========================================
  const activeSheets = config.selectedSheets && config.selectedSheets.length > 0
    ? config.selectedSheets
    : [];

  for (let idx = 0; idx < activeSheets.length; idx++) {
    const sheet = activeSheets[idx];

    // 1. Color Reference Guide Spread (If guide available)
    if (sheet.colorGuide) {
      doc.addPage();
      // Outer neat frame matching Christmas.pdf
      doc.setDrawColor(30, 30, 30);
      doc.setLineWidth(1.0);
      doc.rect(34, 40, pageWidth - 68, pageHeight - 88);

      // Top label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`COLOR REFERENCE GUIDE • ${sheet.title.toUpperCase()}`, pageWidth / 2, 30, { align: 'center' });

      try {
        const colorImg = await loadImage(sheet.colorGuide);
        const maxW = pageWidth - 96;
        const maxH = pageHeight - 128;
        const ratio = colorImg.width / colorImg.height;
        let w = maxW;
        let h = maxW / ratio;
        if (h > maxH) {
          h = maxH;
          w = maxH * ratio;
        }
        const x = (pageWidth - w) / 2;
        const y = 52 + (maxH - h) / 2;
        doc.addImage(colorImg, 'JPEG', x, y, w, h);
      } catch (err) {
        console.warn('Color guide image load error:', err);
      }

      // Footer: Left website copyright, Right brand logo + brand name
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(`© ${config.websiteUrl}`, 34, pageHeight - 28);

      if (brandLogoImg) {
        doc.addImage(brandLogoImg, 'JPEG', pageWidth - 50, pageHeight - 40, 16, 16);
      }
      doc.setFont('helvetica', 'bold');
      doc.text(config.publisherName, brandLogoImg ? pageWidth - 56 : pageWidth - 34, pageHeight - 28, { align: 'right' });
    }

    // 2. Line-Art Outline Spread (For kid to color)
    doc.addPage();
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(1.0);
    doc.rect(34, 40, pageWidth - 68, pageHeight - 88);

    try {
      const outlineImg = await loadImage(sheet.outline);
      const maxW = pageWidth - 96;
      const maxH = pageHeight - 128;
      const ratio = outlineImg.width / outlineImg.height;
      let w = maxW;
      let h = maxW / ratio;
      if (h > maxH) {
        h = maxH;
        w = maxH * ratio;
      }
      const x = (pageWidth - w) / 2;
      const y = 52 + (maxH - h) / 2;
      doc.addImage(outlineImg, 'PNG', x, y, w, h);
    } catch (err) {
      console.warn('Outline image load error:', err);
    }

    // Footer on line art page
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`© ${config.websiteUrl}`, 34, pageHeight - 28);

    if (brandLogoImg) {
      doc.addImage(brandLogoImg, 'JPEG', pageWidth - 50, pageHeight - 40, 16, 16);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(config.publisherName, brandLogoImg ? pageWidth - 56 : pageWidth - 34, pageHeight - 28, { align: 'right' });
  }

  // ==========================================
  // PAGE N-1: RELATED BOOKS CATALOG (Matching Christmas.pdf Page 22)
  // Background Warm Amber/Yellow #FEA316 with 3 speech-bubble cards & MULTIPLE BOOK COVERS
  // ==========================================
  doc.addPage();
  doc.setFillColor(254, 163, 22); // #FEA316 vibrant warm amber
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(255, 255, 255);
  doc.text("Fuel Your Child's", pageWidth / 2, 52, { align: 'center' });
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text('Imagination', pageWidth / 2, 88, { align: 'center' });

  // 3 Speech Bubble Category Cards
  const defaultCategories = [
    {
      category: 'books',
      title: "Free\nChildren's Books",
      ctaText: 'Discover More',
      covers: [
        '/assets/branding/book_cover_banner.jpg',
        '/assets/sheets/elephant_river.webp',
        '/assets/sheets/bear_brushing_teeth.webp'
      ]
    },
    {
      category: 'posters',
      title: 'Free\nEducational Posters',
      ctaText: 'Discover More',
      covers: [
        '/assets/sheets/letter_a_apple.png',
        '/assets/sheets/letter_b_butterfly.png',
        '/assets/sheets/letter_c_cat.png'
      ]
    },
    {
      category: 'coloring',
      title: 'Free\nColoring Books',
      ctaText: 'Discover More',
      covers: [
        '/assets/sheets/tj_cheese_chase_color.jpg',
        '/assets/sheets/tj_birthday_cake_color.jpg',
        '/assets/sheets/tj_park_picnic_color.jpg'
      ]
    }
  ];

  const catList = config.relatedCategories && config.relatedCategories.length > 0
    ? config.relatedCategories
    : defaultCategories;

  for (let i = 0; i < Math.min(3, catList.length); i++) {
    const item = catList[i];
    const cardY = 115 + i * 192;
    const cardW = pageWidth - 60;
    const cardH = 172;

    // White rounded speech bubble card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(30, cardY, cardW, cardH, 16, 16, 'F');

    // Speech bubble tail pointing left
    doc.setFillColor(255, 255, 255);
    doc.triangle(30, cardY + 40, 30, cardY + 70, 16, cardY + 55, 'F');

    // Left Side: Category Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(20, 20, 20);
    const titleLines = item.title.split('\n');
    titleLines.forEach((tLine, lineIdx) => {
      doc.text(tLine, 54, cardY + 46 + lineIdx * 24);
    });

    // Red pill button: "Discover More"
    const btnY = cardY + 46 + titleLines.length * 24 + 10;
    doc.setFillColor(220, 38, 38); // Vibrant red
    doc.roundedRect(54, btnY, 130, 32, 16, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(item.ctaText || 'Discover More', 119, btnY + 20, { align: 'center' });

    // Right Side: MULTIPLE BOOK COVERS (Fanned out / side-by-side array)
    const covers = item.covers && item.covers.length > 0 ? item.covers : [];
    if (covers.length > 0) {
      const coverAreaX = 205;
      const coverAreaW = cardW - 185;
      const numCovers = Math.min(4, covers.length);
      const coverW = Math.min(88, (coverAreaW - 16) / numCovers);
      const coverH = coverW * 1.35;
      const startX = coverAreaX + (coverAreaW - (numCovers * coverW + (numCovers - 1) * 12)) / 2;
      const coverY = cardY + (cardH - coverH) / 2;

      for (let cIdx = 0; cIdx < numCovers; cIdx++) {
        try {
          const cImg = await loadImage(covers[cIdx]);
          const xPos = startX + cIdx * (coverW + 12);
          // Drop shadow effect
          doc.setFillColor(210, 210, 210);
          doc.roundedRect(xPos + 2, coverY + 2, coverW, coverH, 4, 4, 'F');
          // Cover image
          doc.addImage(cImg, 'PNG', xPos, coverY, coverW, coverH);
          // Thin border
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.roundedRect(xPos, coverY, coverW, coverH, 4, 4, 'S');
        } catch (e) {
          console.warn('Related book cover image skipped:', e);
        }
      }
    }
  }

  // Footer on Related Books Page (Brand Logo + Publisher Name • Website URL)
  const footerY = pageHeight - 44;
  const logoSize = 28;
  const logoSpacing = 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const nameW = doc.getTextWidth(config.publisherName);

  const sep = '   •   ';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  const sepW = doc.getTextWidth(sep);
  const urlW = doc.getTextWidth(config.websiteUrl);

  const totalContentW = (brandLogoImg ? logoSize + logoSpacing : 0) + nameW + sepW + urlW;

  if (totalContentW <= pageWidth - 60) {
    let curX = (pageWidth - totalContentW) / 2;
    if (brandLogoImg) {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(curX - 2, footerY - 20, logoSize + 4, logoSize + 4, 4, 4, 'F');
      doc.addImage(brandLogoImg, 'JPEG', curX, footerY - 18, logoSize, logoSize);
      curX += logoSize + logoSpacing;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(20, 20, 20);
    doc.text(config.publisherName, curX, footerY);
    curX += nameW;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(60, 60, 60);
    doc.text(sep, curX, footerY);
    curX += sepW;

    doc.setTextColor(30, 30, 30);
    doc.text(config.websiteUrl, curX, footerY);
  } else {
    // If text is exceptionally wide, cleanly center 2 lines: Name above, URL below
    if (brandLogoImg) {
      const topW = logoSize + logoSpacing + nameW;
      const topStartX = (pageWidth - topW) / 2;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(topStartX - 2, footerY - 30, logoSize + 4, logoSize + 4, 4, 4, 'F');
      doc.addImage(brandLogoImg, 'JPEG', topStartX, footerY - 28, logoSize, logoSize);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(20, 20, 20);
      doc.text(config.publisherName, topStartX + logoSize + logoSpacing, footerY - 10);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(20, 20, 20);
      doc.text(config.publisherName, pageWidth / 2, footerY - 10, { align: 'center' });
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text(config.websiteUrl, pageWidth / 2, footerY + 10, { align: 'center' });
  }

  // ==========================================
  // PAGE N: BACK COVER (Matching Christmas.pdf Page 23)
  // Background matches cover #4A94FF with Compact White Notice Box, Official Social Icons & QR
  // ==========================================
  doc.addPage();
  doc.setFillColor(bgR, bgG, bgB);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Title
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(config.titleFontSize || 38);
  doc.setTextColor(255, 255, 255);
  doc.text(config.bookTitle.toUpperCase(), pageWidth / 2, 110, { align: 'center' });

  // Subtitle
  doc.setFont(subtitleFont, 'bold');
  doc.setFontSize(config.subtitleFontSize || 24);
  doc.setTextColor(254, 240, 138);
  doc.text(config.bookSubtitle.toUpperCase(), pageWidth / 2, 142, { align: 'center' });

  // Center White Rounded Notice & Mission Card (Compact, Comfortable Spacing - Zero Empty Bloat)
  const boxW = 500;
  const boxH = 260;
  const boxX = (pageWidth - boxW) / 2;
  const boxY = 200;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(boxX, boxY, boxW, boxH, 18, 18, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('The colouring books are for non-commercial use.', pageWidth / 2, boxY + 44, { align: 'center' });
  doc.text('If they are used commercially, please give us the credit and link', pageWidth / 2, boxY + 66, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(bgR, bgG, bgB);
  doc.text(`back to our website ${config.websiteUrl}`, pageWidth / 2, boxY + 88, { align: 'center' });

  // Soft divider line
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.8);
  doc.line(boxX + 40, boxY + 110, boxX + boxW - 40, boxY + 110);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('Please share our books with your friends and family to', pageWidth / 2, boxY + 138, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(234, 88, 12); // Orange-600
  doc.text('support our mission. Thank you', pageWidth / 2, boxY + 160, { align: 'center' });

  // 4 Official Real Social Media Vector Icons (Facebook, Twitter/X, LinkedIn, WhatsApp)
  const iconSize = 34;
  const iconGap = 20;
  const totalIconsW = iconSize * 4 + iconGap * 3;
  const iconStartX = (pageWidth - totalIconsW) / 2;
  const iconY = boxY + 195;

  if (fbIcon) doc.addImage(fbIcon, 'PNG', iconStartX, iconY, iconSize, iconSize);
  if (twIcon) doc.addImage(twIcon, 'PNG', iconStartX + (iconSize + iconGap), iconY, iconSize, iconSize);
  if (inIcon) doc.addImage(inIcon, 'PNG', iconStartX + (iconSize + iconGap) * 2, iconY, iconSize, iconSize);
  if (waIcon) doc.addImage(waIcon, 'PNG', iconStartX + (iconSize + iconGap) * 3, iconY, iconSize, iconSize);

  // Dynamic QR Code Slot below the white card
  if (qrDataUrl) {
    const qrSize = 64;
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = boxY + boxH + 24;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 8, 8, 'F');
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Scan for Free Interactive PDF Book', pageWidth / 2, qrY + qrSize + 18, { align: 'center' });
  }

  // Back Cover Bottom Footer: Published by (Left) and Illustrated by (Right) WITH BRAND LOGO ICON
  // Left: Published by
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Published by', 28, pageHeight - 48);

  if (brandLogoImg) {
    doc.addImage(brandLogoImg, 'JPEG', 28, pageHeight - 40, 24, 24);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(config.publisherName, brandLogoImg ? 58 : 28, pageHeight - 24);

  // Right: Illustrated by
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Illustrated by', pageWidth - 28, pageHeight - 48, { align: 'right' });

  if (brandLogoImg) {
    doc.addImage(brandLogoImg, 'JPEG', pageWidth - 52, pageHeight - 40, 24, 24);
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(config.illustratorName, brandLogoImg ? pageWidth - 58 : pageWidth - 28, pageHeight - 24, { align: 'right' });

  // Save PDF file
  const safeFilename = config.bookTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`${safeFilename}_coloring_book.pdf`);
}
