import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColoringSheet } from '../types';
import { sound } from '../utils/audio';
import { buildOutlineMask, executeFloodFill, MaskData } from '../utils/floodFill';
import confetti from 'canvas-confetti';
import {
  PaintBucket,
  Brush,
  Sparkles,
  Eraser,
  Undo2,
  Redo2,
  Printer,
  Download,
  Award,
  RotateCcw,
  Volume2,
  VolumeX,
  SplitSquareVertical,
  X,
  Palette,
  Pipette,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Smile,
  Layers,
  Sparkle,
  Move
} from 'lucide-react';

interface Props {
  sheet: ColoringSheet;
  allSheets?: ColoringSheet[];
  onSelectSheet?: (s: ColoringSheet) => void;
  onClose: () => void;
  onOpenCertificate: (sheet: ColoringSheet, artworkUrl: string) => void;
}

// 4 Curated Child-Safe Palettes + Book Palette
const PALETTE_GROUPS = [
  {
    name: 'Classics',
    colors: ['#E53950', '#FF6A1F', '#FFD84D', '#2FA86C', '#156B45', '#3F6FE0', '#7A4DD8', '#E8408E', '#A86B3C', '#5B6470', '#000000', '#FFFFFF']
  },
  {
    name: 'Pastel',
    colors: ['#FDA4AF', '#FBCFE8', '#DDD6FE', '#C7D2FE', '#BAE6FD', '#A7F3D0', '#FEF08A', '#FED7AA', '#F5D0C5', '#FFFFFF']
  },
  {
    name: 'Neon',
    colors: ['#FF0055', '#FF5500', '#FFDD00', '#00FF66', '#00F0FF', '#7000FF', '#FF00A0', '#CCFF00', '#0066FF', '#FFFFFF']
  },
  {
    name: 'Safari',
    colors: ['#166534', '#15803D', '#4D7C0F', '#854D0E', '#9A3412', '#78350F', '#451A03', '#334155', '#64748B', '#FFFFFF']
  }
];

const BRUSH_SIZES = [
  { label: 'S', size: 4 },
  { label: 'M', size: 12 },
  { label: 'L', size: 24 },
  { label: 'XL', size: 44 },
];

export const ColoringStudio: React.FC<Props> = ({
  sheet,
  allSheets = [],
  onSelectSheet,
  onClose,
  onOpenCertificate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);

  // Tools & Settings
  const [activeTool, setActiveTool] = useState<'fill' | 'crayon' | 'brush' | 'marker' | 'sparkle' | 'stamp' | 'eraser' | 'eyedropper' | 'pan'>('fill');
  const [selectedColor, setSelectedColor] = useState<string>('#FFD84D');
  const [brushSize, setBrushSize] = useState<number>(12);
  const [selectedStamp, setSelectedStamp] = useState<'star' | 'heart' | 'flower' | 'smile'>('star');
  const [fillPattern, setFillPattern] = useState<'solid' | 'dots' | 'stripes' | 'stars'>('solid');
  const [activePaletteIndex, setActivePaletteIndex] = useState<number>(-1); // Default to Book Crayon Guide if available!

  // Fullscreen & Pan & Zoom state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleNudgePan = (dx: number, dy: number) => {
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleResetPan = () => {
    setPan({ x: 0, y: 0 });
  };

  // States
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(sound.isEnabled());
  const [showSideBySide, setShowSideBySide] = useState<boolean>(Boolean(sheet.colorGuide));
  const [showSheetDrawer, setShowSheetDrawer] = useState<boolean>(false);
  const [canvasReady, setCanvasReady] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Tap any closed space to fill!');

  // Pre-computed Outline Mask
  const maskRef = useRef<MaskData | null>(null);
  const guideContainerRef = useRef<HTMLDivElement>(null);

  // History stack
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Load Image and Initialize Canvases
  useEffect(() => {
    setCanvasReady(false);
    const colorCanvas = colorCanvasRef.current;
    const outlineCanvas = outlineCanvasRef.current;
    if (!colorCanvas || !outlineCanvas) return;

    const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });
    const outlineCtx = outlineCanvas.getContext('2d', { willReadFrequently: true });
    if (!colorCtx || !outlineCtx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // High-Definition Studio resolution (up to 2048px preserves 100% native clarity)
      const maxDim = 2048;
      let width = img.naturalWidth || 800;
      let height = img.naturalHeight || 1000;

      const scale = Math.min(maxDim / width, maxDim / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      // Set internal canvas pixel resolution
      colorCanvas.width = width;
      colorCanvas.height = height;
      outlineCanvas.width = width;
      outlineCanvas.height = height;

      // Enable high-definition image smoothing
      colorCtx.imageSmoothingEnabled = true;
      colorCtx.imageSmoothingQuality = 'high';
      outlineCtx.imageSmoothingEnabled = true;
      outlineCtx.imageSmoothingQuality = 'high';

      // Lock container aspect ratio to match the drawing 100% (zero letterbox padding)
      if (containerRef.current) {
        containerRef.current.style.aspectRatio = `${width} / ${height}`;
      }
      if (guideContainerRef.current) {
        guideContainerRef.current.style.aspectRatio = `${width} / ${height}`;
      }

      // Color canvas starts pure white
      colorCtx.fillStyle = '#FFFFFF';
      colorCtx.fillRect(0, 0, width, height);

      // Draw outline onto outline canvas
      outlineCtx.clearRect(0, 0, width, height);
      outlineCtx.drawImage(img, 0, 0, width, height);

      // Build outline line barrier (125 threshold for pristine line boundaries without clogging open crevices)
      maskRef.current = buildOutlineMask(outlineCanvas, 125);

      // Save initial snapshot
      const initialSnapshot = colorCtx.getImageData(0, 0, width, height);
      setHistory([initialSnapshot]);
      setHistoryIndex(0);
      setCanvasReady(true);
      setStatusMessage('Tap any space to fill cleanly!');
    };

    img.onerror = () => {
      setStatusMessage('Could not load image outline.');
    };

    img.src = sheet.outline;
    if (img.complete && img.naturalWidth > 0) {
      img.onload(new Event('load') as any);
    }
  }, [sheet.outline]);

  // Push history snapshot
  const pushHistory = useCallback(() => {
    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const snapshot = ctx.getImageData(0, 0, colorCanvas.width, colorCanvas.height);
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      if (next.length > 25) next.shift();
      return [...next, snapshot];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo
  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const prevIndex = historyIndex - 1;
    ctx.putImageData(history[prevIndex], 0, 0);
    setHistoryIndex(prevIndex);
    sound.playPop(350);
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const nextIndex = historyIndex + 1;
    ctx.putImageData(history[nextIndex], 0, 0);
    setHistoryIndex(nextIndex);
    sound.playPop(520);
  };

  // Coordinates Converter (100% Pixel-Accurate Coordinate Mapping)
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    return {
      x: Math.max(0, Math.min(canvas.width - 1, x)),
      y: Math.max(0, Math.min(canvas.height - 1, y)),
    };
  };

  // Eyedropper Tool
  const pickColorFromCanvas = (x: number, y: number) => {
    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase();
    setSelectedColor(hex);
    sound.playPop(600);
    setStatusMessage(`Picked color: ${hex}`);
    setActiveTool('fill');
  };

  // Draw stamp
  const drawStampAt = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.fillStyle = selectedColor;
    const sz = brushSize * 2;

    if (selectedStamp === 'star') {
      const spikes = 5;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(x, y - sz);
      for (let i = 0; i < spikes; i++) {
        let cx = x + Math.cos(rot) * sz;
        let cy = y + Math.sin(rot) * sz;
        ctx.lineTo(cx, cy);
        rot += step;
        cx = x + Math.cos(rot) * (sz / 2);
        cy = y + Math.sin(rot) * (sz / 2);
        ctx.lineTo(cx, cy);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
    } else if (selectedStamp === 'heart') {
      ctx.beginPath();
      const topCurveHeight = sz * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - sz / 2, y, x - sz / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - sz / 2, y + (sz + topCurveHeight) / 2, x, y + (sz + topCurveHeight) / 1.4, x, y + sz);
      ctx.bezierCurveTo(x, y + (sz + topCurveHeight) / 1.4, x + sz / 2, y + (sz + topCurveHeight) / 2, x + sz / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + sz / 2, y, x, y, x, y + topCurveHeight);
      ctx.closePath();
      ctx.fill();
    } else if (selectedStamp === 'flower') {
      for (let i = 0; i < 5; i++) {
        const ang = (i * 2 * Math.PI) / 5;
        const px = x + Math.cos(ang) * (sz * 0.6);
        const py = y + Math.sin(ang) * (sz * 0.6);
        ctx.beginPath();
        ctx.arc(px, py, sz * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, y, sz * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (selectedStamp === 'smile') {
      ctx.beginPath();
      ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x - sz * 0.3, y - sz * 0.2, sz * 0.15, 0, Math.PI * 2);
      ctx.arc(x + sz * 0.3, y - sz * 0.2, sz * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x, y, sz * 0.6, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Pointer Down
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Check if pan mode or middle-click pan
    const isMiddleClick = 'button' in e && (e as React.MouseEvent).button === 1;
    if (activeTool === 'pan' || isMiddleClick) {
      isPanningRef.current = true;
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      panStartRef.current = { x: clientX - pan.x, y: clientY - pan.y };
      return;
    }

    const coords = getCoordinates(e);
    if (!coords) return;

    if (activeTool === 'eyedropper') {
      pickColorFromCanvas(coords.x, coords.y);
      return;
    }

    if (activeTool === 'fill') {
      if (!maskRef.current) return;
      const res = executeFloodFill(
        colorCanvasRef.current!,
        maskRef.current,
        coords.x,
        coords.y,
        selectedColor,
        fillPattern
      );

      if (res.success) {
        pushHistory();
        sound.playPop(520);
        setStatusMessage('Space filled cleanly!');
      } else if (res.message) {
        setStatusMessage(res.message);
      }
      return;
    }

    if (activeTool === 'stamp') {
      const colorCanvas = colorCanvasRef.current;
      if (!colorCanvas) return;
      const ctx = colorCanvas.getContext('2d');
      if (!ctx) return;
      drawStampAt(ctx, coords.x, coords.y);
      pushHistory();
      sound.playPop(580);
      return;
    }

    setIsDrawing(true);
    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    if (activeTool === 'crayon') {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.85;
      sound.playBrush();
    } else if (activeTool === 'marker') {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize * 1.5;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.globalAlpha = 0.45;
      sound.playBrush();
    } else if (activeTool === 'brush') {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      sound.playBrush();
    } else if (activeTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
    } else if (activeTool === 'sparkle') {
      ctx.globalAlpha = 1.0;
      sound.playSparkle();
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPanningRef.current) {
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      setPan({ x: clientX - panStartRef.current.x, y: clientY - panStartRef.current.y });
      return;
    }

    if (!isDrawing) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d');
    if (!ctx) return;

    if (activeTool === 'crayon' || activeTool === 'brush' || activeTool === 'marker' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'sparkle') {
      if (Math.random() > 0.6) {
        drawStampAt(ctx, coords.x, coords.y);
      }
    }
  };

  // Pointer Up
  const handlePointerUp = () => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      return;
    }

    if (isDrawing) {
      setIsDrawing(false);
      const colorCanvas = colorCanvasRef.current;
      if (colorCanvas) {
        const ctx = colorCanvas.getContext('2d');
        if (ctx) ctx.globalAlpha = 1.0;
      }
      pushHistory();
    }
  };

  // Clear
  const handleClear = () => {
    if (!confirm('Start over with a fresh blank page?')) return;
    const colorCanvas = colorCanvasRef.current;
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, colorCanvas.width, colorCanvas.height);
    pushHistory();
    sound.playPop(300);
    setStatusMessage('Started over!');
  };

  // Merged artwork for saving
  const getMergedArtworkDataUrl = (): string => {
    const colorCanvas = colorCanvasRef.current;
    const outlineCanvas = outlineCanvasRef.current;
    if (!colorCanvas || !outlineCanvas) return '';

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = colorCanvas.width;
    exportCanvas.height = colorCanvas.height;
    const ctx = exportCanvas.getContext('2d')!;

    ctx.drawImage(colorCanvas, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(outlineCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10, exportCanvas.height - 35, 360, 26);
    ctx.fillStyle = '#1E1B4B';
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillText('Baby Elephant Books • Little Artist Masterpiece', 18, exportCanvas.height - 18);

    return exportCanvas.toDataURL('image/png');
  };

  // Save PNG
  const handleDownloadImage = () => {
    const dataUrl = getMergedArtworkDataUrl();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `${sheet.id}-colored-masterpiece.png`;
    link.href = dataUrl;
    link.click();

    sound.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // Print
  const handlePrint = () => {
    const dataUrl = getMergedArtworkDataUrl();
    if (!dataUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${sheet.title} - Baby Elephant Books</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; }
            h2 { margin: 10px 0 4px 0; color: #1E1B4B; }
            p { margin: 0 0 10px 0; font-size: 12px; color: #64748B; }
            img { max-width: 95vw; max-height: 88vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <h2>${sheet.title}</h2>
          <p>Baby Elephant Books • Free & Fun Children's Coloring</p>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Award Diploma
  const handleAwardDiploma = () => {
    const dataUrl = getMergedArtworkDataUrl();
    sound.playFanfare();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    onOpenCertificate(sheet, dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-1 sm:p-2 overflow-hidden select-none">
      {/* 1. SLIM HIGH-EFFICIENCY TOP BAR (Maximized space!) */}
      <div className="w-full bg-white rounded-xl px-3 py-1.5 shadow flex items-center justify-between gap-2 border border-amber-200 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 p-0.5 flex items-center justify-center flex-shrink-0 animate-jelly">
            <img src="/assets/branding/baby_elephant_logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-md" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate flex items-center gap-1.5">
              <span>{sheet.title}</span>
              {sheet.isExclusive && (
                <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-bold uppercase hidden sm:inline">
                  Storybook
                </span>
              )}
            </h2>
            <div className="text-[10px] text-amber-700 font-bold truncate">
              {statusMessage}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Switch Drawing */}
          {allSheets.length > 0 && (
            <button
              onClick={() => setShowSheetDrawer(!showSheetDrawer)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1"
              title="Switch picture"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">Drawings ({allSheets.length})</span>
            </button>
          )}

          {/* Toggle Side-by-Side */}
          {sheet.colorGuide && (
            <button
              onClick={() => setShowSideBySide(!showSideBySide)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
                showSideBySide
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Finished Color Reference Guide on the left"
            >
              <SplitSquareVertical size={13} />
              <span className="hidden md:inline">Side Guide</span>
            </button>
          )}

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold text-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
              disabled={zoomLevel <= 1}
              className="p-1 hover:bg-white rounded disabled:opacity-30"
              title="Zoom out"
            >
              <ZoomOut size={12} />
            </button>
            <span className="px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              disabled={zoomLevel >= 2.5}
              className="p-1 hover:bg-white rounded disabled:opacity-30"
              title="Zoom in"
            >
              <ZoomIn size={12} />
            </button>
            {zoomLevel > 1 && (
              <button onClick={() => { setZoomLevel(1); setPan({ x: 0, y: 0 }); }} className="px-1 bg-white rounded text-[9px]">
                100%
              </button>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Toggle Fullscreen Canvas"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* Sound */}
          <button
            onClick={() => setSoundActive(sound.toggleSound())}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Toggle Sound Effects"
          >
            {soundActive ? <Volume2 size={15} className="text-indigo-600" /> : <VolumeX size={15} className="text-slate-400" />}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center gap-1"
            title="Print"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Save Image */}
          <button
            onClick={handleDownloadImage}
            className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1"
            title="Save PNG"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Diploma */}
          <button
            onClick={handleAwardDiploma}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1"
            title="Award Diploma"
          >
            <Award size={13} />
            <span>Diploma</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 ml-0.5"
            title="Exit Studio"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 2. CENTRAL CANVAS STAGE (Auto-fitted with Zero Dead-Zones & Zero Letterboxing) */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center gap-4 overflow-hidden px-2 py-1 relative">
        {/* Left Side Guide: Expands gracefully in side-by-side mode */}
        {showSideBySide && sheet.colorGuide && (
          <div
            ref={guideContainerRef}
            className="h-full max-h-full bg-white rounded-2xl p-1.5 shadow-xl border-2 border-indigo-200 flex flex-col items-center justify-center relative flex-shrink-0 animate-fade"
            style={{
              maxWidth: '44%'
            }}
          >
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow z-10 uppercase">
              Color Guide
            </span>
            <img
              src={sheet.colorGuide}
              alt="Finished color guide"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        )}

        {/* Right / Center Drawing Canvas: Matched Aspect Ratio with ZERO letterbox dead zones */}
        <div
          ref={containerRef}
          className="relative h-full max-h-full bg-white rounded-2xl p-1 shadow-2xl border-4 border-amber-300 flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{
            maxWidth: showSideBySide && sheet.colorGuide ? '54%' : '100%',
            touchAction: 'none',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isPanningRef.current ? 'none' : 'transform 0.12s ease-out'
          }}
        >
          {/* Bottom Paint Canvas */}
          <canvas
            ref={colorCanvasRef}
            className={`w-full h-full block rounded-xl ${
              activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : activeTool === 'fill' ? 'cursor-pointer' : activeTool === 'eyedropper' ? 'cursor-crosshair' : 'cursor-crosshair'
            }`}
            style={{ imageRendering: 'auto' }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />

          {/* Top Line-Art Outline Layer (Multiply blend so dark lines stay crisp) */}
          <canvas
            ref={outlineCanvasRef}
            className="absolute inset-0 w-full h-full block rounded-xl pointer-events-none"
            style={{ mixBlendMode: 'multiply', imageRendering: 'auto' }}
          />

          {!canvasReady && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center text-slate-600 z-10">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs font-bold">Sharpening crayons & analyzing closed boundaries...</p>
            </div>
          )}
        </div>

        {/* Floating Pan Navigator / Nudge Arrows (Active when Zoomed In) */}
        {zoomLevel > 1 && (
          <div className="absolute bottom-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-amber-400/60 flex flex-col items-center gap-1 text-white animate-fade">
            <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-wider">Move Sketch</span>
            <button
              onClick={() => handleNudgePan(0, 70)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center font-bold text-xs"
              title="Move Up"
            >
              ▲
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNudgePan(70, 0)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center font-bold text-xs"
                title="Move Left"
              >
                ◀
              </button>
              <button
                onClick={handleResetPan}
                className="w-7 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 flex items-center justify-center font-bold text-xs"
                title="Reset to Center"
              >
                🎯
              </button>
              <button
                onClick={() => handleNudgePan(-70, 0)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center font-bold text-xs"
                title="Move Right"
              >
                ▶
              </button>
            </div>
            <button
              onClick={() => handleNudgePan(0, -70)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center font-bold text-xs"
              title="Move Down"
            >
              ▼
            </button>
          </div>
        )}

        {/* Switcher Drawer */}
        {showSheetDrawer && allSheets.length > 0 && (
          <div className="absolute inset-y-0 right-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-40 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b mb-2">
              <h4 className="font-bold text-xs text-slate-800">Switch Coloring Sheet</h4>
              <button onClick={() => setShowSheetDrawer(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {allSheets.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSheet?.(s);
                    setShowSheetDrawer(false);
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer border text-xs transition ${
                    s.id === sheet.id ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={s.outline} alt={s.title} className="w-10 h-10 object-contain bg-white rounded border p-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{s.title}</div>
                    <div className="text-[10px] text-slate-400">{s.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. COMPACT FLOATING TOOLDOCK (Zero wasted space!) */}
      <div className="w-full max-w-6xl bg-white rounded-xl px-3 py-1.5 shadow-lg border border-amber-200 flex flex-wrap items-center justify-between gap-1.5 flex-shrink-0">
        {/* Left: Tools Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg overflow-x-auto">
          <button
            onClick={() => { setActiveTool('fill'); sound.playPop(480); setStatusMessage('Magic Fill: Tap any closed space!'); }}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'fill' ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PaintBucket size={14} />
            <span>Fill</span>
          </button>

          <button
            onClick={() => { setActiveTool('crayon'); sound.playPop(440); setStatusMessage('Wax Crayon: Draw with natural texture!'); }}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'crayon' ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brush size={14} />
            <span>Crayon</span>
          </button>

          <button
            onClick={() => { setActiveTool('brush'); sound.playPop(460); setStatusMessage('Paintbrush: Smooth vector strokes'); }}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'brush' ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Paint</span>
          </button>

          <button
            onClick={() => { setActiveTool('marker'); sound.playPop(420); setStatusMessage('Watercolor Marker: Semi-transparent wash'); }}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'marker' ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Marker</span>
          </button>

          <button
            onClick={() => { setActiveTool('sparkle'); sound.playSparkle(); setStatusMessage('Glitter Stars: Paint sparkling star trails'); }}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'sparkle' ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={14} />
            <span>Glitter</span>
          </button>

          <button
            onClick={() => { setActiveTool('stamp'); sound.playPop(520); setStatusMessage('Stamps: Tap anywhere to stamp cute shapes'); }}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'stamp' ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smile size={14} />
            <span>Stamp</span>
          </button>

          <button
            onClick={() => { setActiveTool('eyedropper'); sound.playPop(600); setStatusMessage('Eyedropper: Tap canvas to pick color'); }}
            className={`p-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'eyedropper' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Pick color"
          >
            <Pipette size={14} />
          </button>

          <button
            onClick={() => { setActiveTool('eraser'); sound.playPop(300); setStatusMessage('Eraser: Rub out color (lines stay protected)'); }}
            className={`p-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'eraser' ? 'bg-amber-400 text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Eraser"
          >
            <Eraser size={14} />
          </button>

          <button
            onClick={() => { setActiveTool('pan'); sound.playPop(480); setStatusMessage('Move / Pan: Drag canvas with mouse or finger to view any corner!'); }}
            className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 transition ${
              activeTool === 'pan' ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Move / Pan zoomed canvas"
          >
            <Move size={14} />
            <span className="hidden sm:inline">Move</span>
          </button>
        </div>

        {/* Center: Tool Sub-Options (Patterns, Sizes, Stamps) */}
        <div className="flex items-center gap-1 text-xs">
          {activeTool === 'fill' && (
            <div className="flex items-center gap-0.5 bg-amber-50 p-0.5 rounded-lg border border-amber-200 text-[10px]">
              {(['solid', 'dots', 'stripes', 'stars'] as const).map((pat) => (
                <button
                  key={pat}
                  onClick={() => setFillPattern(pat)}
                  className={`px-1.5 py-0.5 rounded font-bold capitalize ${
                    fillPattern === pat ? 'bg-amber-400 text-slate-900' : 'bg-white text-slate-600'
                  }`}
                >
                  {pat}
                </button>
              ))}
            </div>
          )}

          {activeTool === 'stamp' && (
            <div className="flex items-center gap-0.5 bg-rose-50 p-0.5 rounded-lg border border-rose-200">
              {[
                { id: 'star', label: '⭐' },
                { id: 'heart', label: '💖' },
                { id: 'flower', label: '🌸' },
                { id: 'smile', label: '😊' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStamp(st.id as any)}
                  className={`px-1.5 py-0.5 rounded text-xs ${
                    selectedStamp === st.id ? 'bg-rose-400 text-white' : 'bg-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}

          {(activeTool === 'crayon' || activeTool === 'brush' || activeTool === 'marker' || activeTool === 'eraser' || activeTool === 'stamp') && (
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[10px]">
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.size}
                  onClick={() => setBrushSize(b.size)}
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    brushSize === b.size ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 border-l pl-1 border-slate-200">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30"
              title="Undo"
            >
              <Undo2 size={13} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30"
              title="Redo"
            >
              <Redo2 size={13} />
            </button>
            <button
              onClick={handleClear}
              className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600"
              title="Start Over"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Right: Palettes & Swatches */}
        <div className="flex items-center gap-1">
          {/* Palette Switcher */}
          <div className="flex items-center gap-0.5">
            {sheet.crayonGuide && (
              <button
                onClick={() => setActivePaletteIndex(-1)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition ${
                  activePaletteIndex === -1 ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                Book Guide ★
              </button>
            )}
            {PALETTE_GROUPS.map((grp, idx) => (
              <button
                key={grp.name}
                onClick={() => setActivePaletteIndex(idx)}
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                  activePaletteIndex === idx ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {grp.name}
              </button>
            ))}
          </div>

          {/* Swatches */}
          <div className="flex items-center gap-1 pl-1">
            {activePaletteIndex === -1 && sheet.crayonGuide ? (
              sheet.crayonGuide.map((cg) => (
                <button
                  key={cg.hex}
                  onClick={() => { setSelectedColor(cg.hex); sound.playPop(540); }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 ${
                    selectedColor.toLowerCase() === cg.hex.toLowerCase()
                      ? 'border-indigo-600 scale-125 ring-2 ring-indigo-300'
                      : 'border-white shadow-xs'
                  }`}
                  style={{ backgroundColor: cg.hex }}
                  title={`${cg.name}: ${cg.usage}`}
                />
              ))
            ) : (
              PALETTE_GROUPS[Math.max(0, activePaletteIndex)].colors.map((color) => (
                <button
                  key={color}
                  onClick={() => { setSelectedColor(color); sound.playPop(500); }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border transition-transform hover:scale-125 ${
                    selectedColor.toLowerCase() === color.toLowerCase()
                      ? 'border-indigo-600 scale-125 ring-2 ring-indigo-300'
                      : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))
            )}

            {/* Custom Color Wheel */}
            <label
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-300 cursor-pointer flex items-center justify-center bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-400 hover:scale-125 transition relative"
              title="Custom Color"
            >
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
