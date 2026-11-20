// High-Precision Cartoon & Sketch Line-Art Extractor
// Converts colored cartoon/character illustrations into clean, delicate, studio-grade black-and-white coloring book outlines
// Filters out cel-shading shadows, eye bags, and hair masks while preserving true cartoon ink strokes with 256-level anti-aliasing

export async function extractLineArtFromColorImage(
  imageSource: string,
  _sensitivity: number = 28,
  _lineThickness: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Preserve ultra-high resolution up to 2400px
      const maxDim = 2400;
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Draw source color image
      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const outImg = ctx.createImageData(width, height);
      const outData = outImg.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Perceptual luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // Chroma (color saturation level)
        const chroma = Math.max(r, g, b) - Math.min(r, g, b);

        // Core cartoon ink stroke detection:
        // True cartoon outlines have low luminance (< 32) and neutral chroma (< 18).
        // Antialiased stroke edges transition smoothly up to lum 90 and chroma 24.
        // Cel-shading shadows (under eyes, chin, hair) have lum > 100 or chroma > 24, so they are cleanly filtered out!
        const inkFactor = Math.min(1.0, Math.max(0.0, (90.0 - lum) / 60.0));
        const colorSuppress = Math.min(1.0, Math.max(0.0, (24.0 - chroma) / 14.0));
        let ink = inkFactor * colorSuppress;

        if (lum < 32 && chroma < 18) {
          ink = 1.0;
        }

        // Clean white background (suppress faint noise/artifacts < 0.15)
        if (ink < 0.15) {
          ink = 0.0;
        } else {
          ink = (ink - 0.15) / 0.85;
        }

        // Full 8-bit anti-aliased grayscale (0 = jet black ink, 255 = pure white space)
        const gray = Math.round(255 * (1.0 - ink));

        outData[i] = gray;
        outData[i + 1] = gray;
        outData[i + 2] = gray;
        outData[i + 3] = 255;
      }

      ctx.putImageData(outImg, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Could not load source color image for outline extraction.'));
    };

    img.src = imageSource;
  });
}
