import React, { useState } from 'react';
import { ColoringSheet } from '../types';
import jsPDF from 'jspdf';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Award, Download, X, Star } from 'lucide-react';

interface Props {
  sheet: ColoringSheet;
  artworkUrl: string;
  onClose: () => void;
}

export const LittleArtistCertificateModal: React.FC<Props> = ({ sheet, artworkUrl, onClose }) => {
  const [childName, setChildName] = useState('Little Artist');
  const [age, setAge] = useState('5');

  const handleDownloadPDF = () => {
    sound.playFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background & Borders
    doc.setFillColor(254, 252, 246);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Double Royal Gold & Indigo Border
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(3);
    doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 6, 6);

    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1);
    doc.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 4, 4);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(30, 27, 75);
    doc.text('LITTLE ARTIST DIPLOMA', pageWidth / 2, 34, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('BABY ELEPHANT BOOKS • LITTLE TRUNKS, BIG IMAGINATION', pageWidth / 2, 42, { align: 'center' });

    // Recipient
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text('This Masterpiece Award is Proudly Presented To:', pageWidth / 2, 58, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(244, 63, 94);
    doc.text(childName.toUpperCase(), pageWidth / 2, 72, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(`Age: ${age} Years Old • Masterpiece: "${sheet.title}"`, pageWidth / 2, 80, { align: 'center' });

    // Embed colored artwork image in center
    try {
      doc.addImage(artworkUrl, 'PNG', pageWidth / 2 - 40, 88, 80, 75);
    } catch {}

    // Bottom signatures
    doc.setDrawColor(148, 163, 184);
    doc.line(35, pageHeight - 25, 95, pageHeight - 25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Parent / Teacher Signature', 65, pageHeight - 19, { align: 'center' });

    doc.line(pageWidth - 95, pageHeight - 25, pageWidth - 35, pageHeight - 25);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Baby Elephant Books Seal', pageWidth - 65, pageHeight - 19, { align: 'center' });

    doc.save(`${childName.toLowerCase().replace(/\s+/g, '-')}-artist-diploma.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative my-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Award size={36} />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
          Little Artist Award!
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Celebrate your child's creativity with an official Baby Elephant Books Certificate
        </p>

        {/* Artwork Preview Card */}
        <div className="bg-amber-50/70 p-3 rounded-2xl border-2 border-amber-200 mb-4 flex items-center justify-center">
          <img
            src={artworkUrl}
            alt="Colored Artwork"
            className="max-h-44 object-contain rounded-xl shadow-md border-2 border-white"
          />
        </div>

        {/* Child Info Form */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-left">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Little Artist's Name:
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Age:
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadPDF}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg bubbly-btn flex items-center justify-center gap-2"
        >
          <Download size={18} />
          <span>Download Printable Diploma (PDF)</span>
        </button>

        <div className="flex items-center justify-center gap-1 text-[11px] text-amber-700 mt-3 font-semibold">
          <Star size={13} className="fill-amber-500 text-amber-500" />
          <span>Hang it proudly on your refrigerator or bedroom wall!</span>
        </div>
      </div>
    </div>
  );
};
