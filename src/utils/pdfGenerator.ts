import jsPDF from 'jspdf';
import { ColoringSheet, CommercialLicense } from '../types';
import { ColoringBookData } from '../data/books';

// Helper to load image as base64 or HTMLImageElement
async function getImageDataUrl(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } else {
        resolve(createPlaceholderCanvas(img.width || 600, img.height || 800));
      }
    };
    img.onerror = () => {
      resolve(createPlaceholderCanvas(600, 800));
    };
    img.src = url;
  });
}

function createPlaceholderCanvas(w: number, h: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, w - 60, h - 60);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Coloring Outline', w / 2, h / 2);
  return canvas.toDataURL('image/jpeg', 0.85);
}

// 1. Single Printable Sheet PDF (Ink-Saver Mode)
export async function generateSingleSheetPDF(sheet: ColoringSheet, includeColorGuide: boolean = true) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 27, 75);
  doc.text('BABY ELEPHANT BOOKS • COLOR & LEARN', 15, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Free for personal, family & educational use • Little Trunks, Big Imagination', 15, 19);

  // Little Artist tag
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Little Artist: _______________________   Date: _________', pageWidth - 90, 16);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 22, pageWidth - 15, 22);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(sheet.title, 15, 30);

  try {
    const lineImgData = await getImageDataUrl(sheet.outline);

    if (includeColorGuide && sheet.colorGuide) {
      const colorImgData = await getImageDataUrl(sheet.colorGuide);

      // Left guide box
      doc.setFontSize(9);
      doc.setTextColor(99, 102, 241);
      doc.text('COLOR REFERENCE GUIDE', 15, 37);
      doc.addImage(colorImgData, 'JPEG', 15, 40, 85, 115);

      // Right drawing box
      doc.setTextColor(244, 63, 94);
      doc.text('YOUR TURN TO COLOR!', 110, 37);
      doc.addImage(lineImgData, 'JPEG', 110, 40, 85, 115);

      // Crayon palette guide below
      doc.setFontSize(10);
      doc.setTextColor(30, 27, 75);
      doc.text("Little Artist's Crayon Palette Guide:", 15, 165);

      let x = 15;
      sheet.crayonGuide.slice(0, 4).forEach((c) => {
        doc.setFillColor(c.hex);
        doc.circle(x + 4, 172, 3, 'F');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(`${c.name} (${c.usage})`, x + 10, 173);
        x += 46;
      });
    } else {
      // Full page large line art
      doc.addImage(lineImgData, 'JPEG', 15, 35, pageWidth - 30, pageHeight - 65);
    }
  } catch (err) {
    console.error('Failed to add image to PDF', err);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Published by Baby Elephant Books • Download free at BabyElephantColoring.com', 15, pageHeight - 10);
  doc.text('Page 1 of 1', pageWidth - 30, pageHeight - 10);

  doc.save(`${sheet.id}-babyelephant-coloring.pdf`);
}

// 2. Classroom 2-Per-Page Pack (Cuts paper and ink by 50% for schools)
export async function generateClassroomSetPDF(sheet: ColoringSheet) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const halfWidth = pageWidth / 2;

  const lineImgData = await getImageDataUrl(sheet.outline);

  // Left side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 27, 75);
  doc.text(`Baby Elephant Books • ${sheet.title}`, 12, 12);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Name: ______________________', 12, 17);
  doc.addImage(lineImgData, 'JPEG', 12, 22, halfWidth - 24, pageHeight - 34);

  // Center cut line
  doc.setDrawColor(203, 213, 225);
  doc.setLineDashPattern([3, 3], 0);
  doc.line(halfWidth, 10, halfWidth, pageHeight - 10);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('✂ Cut here to share with classmate', halfWidth - 18, pageHeight - 5);

  // Right side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 27, 75);
  doc.text(`Baby Elephant Books • ${sheet.title}`, halfWidth + 12, 12);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Name: ______________________', halfWidth + 12, 17);
  doc.addImage(lineImgData, 'JPEG', halfWidth + 12, 22, halfWidth - 24, pageHeight - 34);

  doc.save(`${sheet.id}-classroom-2up-set.pdf`);
}

// 3. Complete Authentic Multi-Page Coloring Book PDF Generator
export async function generateCompleteBookPDF(
  book: ColoringBookData,
  sheets: ColoringSheet[],
  childName: string = "Little Artist"
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ================= PAGE 1: COVER SPREAD =================
  doc.setFillColor(254, 248, 237); // Warm cream
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(245, 158, 11); // Amber
  doc.setLineWidth(2.5);
  doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 6, 6);

  doc.setDrawColor(99, 102, 241); // Indigo inner
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 4, 4);

  // Top Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(180, 83, 9);
  doc.text('FREE DOWNLOAD • COLOR & LEARN EDITION', pageWidth / 2, 28, { align: 'center' });

  // Main Book Title
  doc.setFontSize(28);
  doc.setTextColor(30, 27, 75);
  doc.text(book.title.toUpperCase(), pageWidth / 2, 44, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(99, 102, 241);
  doc.text(book.subtitle, pageWidth / 2, 53, { align: 'center' });

  // Subtitle Blurb
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Filled color picture on the left side and matching black-and-white outline on the right side — designed to make coloring fun and easy for kids!',
    pageWidth / 2,
    62,
    { align: 'center', maxWidth: pageWidth - 50 }
  );

  // Dedication "This Book Belongs To"
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(30, 78, pageWidth - 60, 42, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(30, 78, pageWidth - 60, 42, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(99, 102, 241);
  doc.text('THIS COLORING BOOK BELONGS TO:', pageWidth / 2, 89, { align: 'center' });

  doc.setFontSize(20);
  doc.setTextColor(244, 63, 94);
  doc.text(childName, pageWidth / 2, 104, { align: 'center' });

  // Cover image / illustration in center
  try {
    const coverData = await getImageDataUrl(book.coverImage);
    doc.addImage(coverData, 'JPEG', pageWidth / 2 - 45, 126, 90, 85);
  } catch {}

  // Publisher Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('PUBLISHED BY', pageWidth / 2, 225, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(99, 102, 241);
  doc.text('Baby Elephant Books', pageWidth / 2, 233, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Free & Fun Children's Coloring Books", pageWidth / 2, 239, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('ILLUSTRATED BY', pageWidth / 2, 250, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(244, 63, 94);
  doc.text('Baby Elephant Illustrations', pageWidth / 2, 258, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Little Trunks, Big Imagination', pageWidth / 2, 264, { align: 'center' });

  // ================= PAGES 2 TO N: STORY SPREADS =================
  const totalPages = sheets.length + 3; // Cover + Sheets + Guide Page + Diploma Page

  for (let i = 0; i < sheets.length; i++) {
    const s = sheets[i];
    doc.addPage();
    const currentPageNum = i + 2;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 27, 75);
    doc.text(`Baby Elephant Books • ${book.title}`, 15, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${currentPageNum} of ${totalPages}`, pageWidth - 35, 12);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(15, 16, pageWidth - 15, 16);

    // Scene Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(s.title, 15, 23);

    const lineImgData = await getImageDataUrl(s.outline);

    if (s.colorGuide) {
      // Side-by-Side Spread: Left = Color Reference, Right = Line Art
      const colorImgData = await getImageDataUrl(s.colorGuide);

      // Left Box
      doc.setFontSize(9);
      doc.setTextColor(99, 102, 241);
      doc.text('COLOR REFERENCE GUIDE', 15, 30);
      doc.addImage(colorImgData, 'JPEG', 15, 33, 85, 115);

      // Right Box
      doc.setTextColor(244, 63, 94);
      doc.text('YOUR TURN TO COLOR!', 110, 30);
      doc.addImage(lineImgData, 'JPEG', 110, 33, 85, 115);

      // Crayon palette guide below
      doc.setFontSize(9);
      doc.setTextColor(30, 27, 75);
      doc.text("Little Artist's Crayon Guide — Pick Your Colors:", 15, 158);

      let x = 15;
      s.crayonGuide.slice(0, 4).forEach((c) => {
        doc.setFillColor(c.hex);
        doc.circle(x + 3, 165, 3, 'F');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(`${c.name} (${c.usage})`, x + 9, 166);
        x += 46;
      });

      // Description text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(s.description, 15, 178, { maxWidth: pageWidth - 30 });
    } else {
      // Full page large coloring drawing
      doc.addImage(lineImgData, 'JPEG', 15, 28, pageWidth - 30, pageHeight - 55);
    }

    // Spread footer
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Baby Elephant Books • Color on Left, Draw on Right • Little Trunks, Big Imagination', 15, pageHeight - 8);
  }

  // ================= CRAYON GUIDE SPREAD =================
  doc.addPage();
  const guidePageNum = sheets.length + 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 27, 75);
  doc.text(`Baby Elephant Books • ${book.title}`, 15, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Page ${guidePageNum} of ${totalPages}`, pageWidth - 35, 12);

  doc.setDrawColor(226, 232, 240);
  doc.line(15, 16, pageWidth - 15, 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("Fuel Your Child's Imagination", pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(99, 102, 241);
  doc.text("Creative Coloring & Learning Books by Baby Elephant Books", pageWidth / 2, 36, { align: 'center' });

  // 3 Educational feature boxes
  const colW = (pageWidth - 40) / 3;
  const features = [
    { title: "Color & Learn Books", desc: "Each spread pairs a finished color picture on the left with a crisp line drawing on the right so young artists color with confidence." },
    { title: "Playful Story Scenes", desc: "Bold, easy-to-follow outlines crafted for crayons, colored pencils, and markers — keeping coloring joyful and stress-free." },
    { title: "Baby Elephant Studio", desc: "Created to nurture focus, color recognition, and hand-eye coordination while sparking storytelling and creative play at home." }
  ];

  features.forEach((f, idx) => {
    const bx = 15 + idx * (colW + 5);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(bx, 45, colW, 45, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, 45, colW, 45, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 27, 75);
    doc.text(f.title, bx + 4, 54);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(f.desc, bx + 4, 61, { maxWidth: colW - 8 });
  });

  // Little Artist Crayon Palette Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Little Artist's Crayon Guide — Pick Your Colors Before You Start!", 15, 105);

  const crayonGuideList = [
    { color: "Slate Blue-Grey", hex: "#708090", usage: "Tom's fur, ears, and tail" },
    { color: "Warm Brown", hex: "#A0522D", usage: "Jerry's fur, wooden floor, cookie" },
    { color: "Sunny Yellow", hex: "#FFD700", usage: "Swiss cheese, sun, balloons" },
    { color: "Berry Red", hex: "#DC143C", usage: "Strawberries, apples, picnic blanket" },
    { color: "Leaf Green", hex: "#2E7D32", usage: "Park grass, trees, potted plant" },
    { color: "Sky Blue", hex: "#87CEEB", usage: "Sunny sky, windows, blue balloons" }
  ];

  let ty = 115;
  crayonGuideList.forEach((cg) => {
    doc.setFillColor(cg.hex);
    doc.circle(20, ty + 2, 3.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(cg.color, 28, ty + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(cg.usage, 80, ty + 3);

    doc.setDrawColor(241, 245, 249);
    doc.line(15, ty + 7, pageWidth - 15, ty + 7);
    ty += 11;
  });

  // ================= DIPLOMA SPREAD (BACK COVER) =================
  doc.addPage();
  doc.setFillColor(254, 250, 242);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(3);
  doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 6, 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 27, 75);
  doc.text(`${book.title.toUpperCase()}`, pageWidth / 2, 38, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(99, 102, 241);
  doc.text('Side-by-Side Color & Learn Edition', pageWidth / 2, 47, { align: 'center' });

  // Belongs to
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(25, 60, pageWidth - 50, 65, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, 60, pageWidth - 50, 65, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(99, 102, 241);
  doc.text('THIS COLORING BOOK BELONGS TO:', pageWidth / 2, 72, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(244, 63, 94);
  doc.text(`Little Artist's Name: ${childName}`, 32, 88);

  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text('Age:  ____________________', 32, 100);
  doc.text('My Favorite Page:  ____________________', 32, 112);

  // Policy text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This coloring book is created for personal, family, and educational non-commercial use. Please share it with friends and family to spread the joy of coloring and creativity. Thank you for coloring with Baby Elephant Books!',
    pageWidth / 2,
    145,
    { align: 'center', maxWidth: pageWidth - 60 }
  );

  // Signatures
  doc.setDrawColor(99, 102, 241);
  doc.line(pageWidth / 2 - 35, 215, pageWidth / 2 + 35, 215);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 27, 75);
  doc.text('Official Baby Elephant Books Seal', pageWidth / 2, 222, { align: 'center' });

  doc.save(`${book.id}-${childName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export async function generateFullBookPDF(
  sheets: ColoringSheet[],
  bookTitle: string = "Baby Elephant's Big Coloring Adventure",
  childName: string = "Little Artist"
) {
  const dummyBook: ColoringBookData = {
    id: 'custom-book',
    title: bookTitle,
    subtitle: 'Side-by-Side Color & Learn Edition',
    coverImage: sheets[0]?.colorGuide || sheets[0]?.outline,
    badge: 'Custom Book',
    pageCount: sheets.length + 2,
    targetAge: 'All Ages',
    description: 'Personalized coloring book compiled by Baby Elephant Books.',
    theme: 'from-amber-400 to-indigo-600',
    sheetIds: sheets.map((s) => s.id),
    features: ['Custom dedication cover', 'Crayon Guide palette', 'Creativity Diploma']
  };
  return generateCompleteBookPDF(dummyBook, sheets, childName);
}

// 4. Commercial License Certificate PDF
export function generateCommercialLicensePDF(lic: CommercialLicense) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(2.5);
  doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4);

  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 3, 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9);
  doc.text('BABY ELEPHANT ENTERPRISES • LEGAL & LICENSING DIVISION', pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATE OF COMMERCIAL LICENSE', pageWidth / 2, 42, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Official License ID: ${lic.licenseId}`, pageWidth / 2, 50, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  const grantText = `This document certifies that Baby Elephant Books grants non-exclusive, worldwide commercial reproduction and distribution rights for the artwork titled "${lic.itemTitle}" to the registered entity detailed below:`;
  doc.text(grantText, 25, 65, { maxWidth: pageWidth - 50 });

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(25, 82, pageWidth - 50, 65, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, 82, pageWidth - 50, 65, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Licensee Details:', 32, 92);

  doc.setFont('helvetica', 'normal');
  doc.text(`• Registered Entity / Name: ${lic.licenseeName}`, 32, 100);
  doc.text(`• Business Name: ${lic.businessName || 'Independent Business'}`, 32, 107);
  doc.text(`• Contact Email: ${lic.email}`, 32, 114);
  doc.text(`• License Tier: ${lic.tier.toUpperCase()} COMMERCIAL LICENSE`, 32, 121);
  doc.text(`• Date of Issuance: ${new Date(lic.purchasedAt).toLocaleDateString()}`, 32, 128);
  doc.text(`• Maximum Production Cap: ${lic.maxUnits.toLocaleString()} physical / digital units`, 32, 135);

  doc.setFont('helvetica', 'bold');
  doc.text('Permitted Commercial Channels:', 25, 160);
  doc.setFont('helvetica', 'normal');
  lic.allowedChannels.forEach((ch, idx) => {
    doc.text(`✓ ${ch}`, 25, 168 + idx * 7);
  });

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const terms = "Non-transferable. Sub-licensing or raw digital line-art re-sale in vector format without modification is prohibited. License is valid in perpetuity under stated production caps.";
  doc.text(terms, 25, 235, { maxWidth: pageWidth - 50 });

  doc.setDrawColor(15, 23, 42);
  doc.line(pageWidth - 85, 260, pageWidth - 25, 260);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Signatory: Baby Elephant IP', pageWidth - 85, 266);

  doc.save(`Commercial-License-${lic.licenseId}.pdf`);
}
