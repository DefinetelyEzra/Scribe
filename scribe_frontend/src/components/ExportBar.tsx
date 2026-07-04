import { useState } from 'react';
import type { FC } from 'react';
import { toPng } from 'html-to-image';
import { TbFileExport, TbPhoto, TbVectorSpline, TbCopy, TbShare } from 'react-icons/tb';

function getPreviewElement(): HTMLElement | null {
  return document.getElementById('scribe-preview');
}

/** Captures the preview as a PNG data URL, using canvas.toDataURL when a canvas is active. */
async function capturePng(): Promise<string> {
  const el = getPreviewElement();
  if (!el) throw new Error('Preview element not found');

  // Canvas renderer path — html-to-image cannot capture canvas content reliably
  const canvas = el.querySelector('canvas');
  if (canvas) {
    // Composite: draw theme background then the canvas onto a new offscreen canvas
    const off = document.createElement('canvas');
    off.width  = canvas.width;
    off.height = canvas.height;
    const ctx = off.getContext('2d')!;
    const bg  = el.style.backgroundColor || '#0d1117';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(canvas, 0, 0);
    return off.toDataURL('image/png');
  }

  return toPng(el, { pixelRatio: 2 });
}

async function exportPng(): Promise<void> {
  const dataUrl = await capturePng();
  const link = document.createElement('a');
  link.download = 'scribe-export.png';
  link.href = dataUrl;
  link.click();
}

async function copyPng(): Promise<void> {
  const dataUrl = await capturePng();
  const res   = await fetch(dataUrl);
  const blob  = await res.blob();
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

function exportSvg(): void {
  const el = getPreviewElement();
  if (!el) return;
  const svg = el.querySelector('svg');
  if (!svg) return;
  const svgStr = new XMLSerializer().serializeToString(svg);
  const blob   = new Blob([svgStr], { type: 'image/svg+xml' });
  const url    = URL.createObjectURL(blob);
  const link   = document.createElement('a');
  link.download = 'scribe-export.svg';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function copyShareUrl(): void {
  void navigator.clipboard.writeText(window.location.href);
}

export const ExportBar: FC = () => {
  const [busy, setBusy]       = useState(false);
  const [copied, setCopied]   = useState(false);
  const [shared, setShared]   = useState(false);

  async function handleExportPng(): Promise<void> {
    setBusy(true);
    try { await exportPng(); } finally { setBusy(false); }
  }

  async function handleCopyPng(): Promise<void> {
    setBusy(true);
    try {
      await copyPng();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setBusy(false);
    }
  }

  function handleShare(): void {
    copyShareUrl();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-t border-zinc-800 bg-zinc-950">
      <TbFileExport size={14} className="text-zinc-500" aria-hidden="true" />
      <span className="text-xs text-zinc-500 mr-1">Export</span>

      <button
        type="button"
        data-export="png"
        onClick={handleExportPng}
        disabled={busy}
        aria-label="Export as PNG (E)"
        title="Export PNG (E)"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TbPhoto size={13} aria-hidden="true" />
        PNG
      </button>

      <button
        type="button"
        onClick={() => exportSvg()}
        aria-label="Export as SVG"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
      >
        <TbVectorSpline size={13} aria-hidden="true" />
        SVG
      </button>

      <button
        type="button"
        onClick={handleCopyPng}
        disabled={busy}
        aria-label="Copy PNG to clipboard"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors disabled:opacity-50"
      >
        <TbCopy size={13} aria-hidden="true" />
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <div className="ml-auto">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Copy share URL"
          title="Copy share link"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
        >
          <TbShare size={13} aria-hidden="true" />
          {shared ? 'Link copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
};
