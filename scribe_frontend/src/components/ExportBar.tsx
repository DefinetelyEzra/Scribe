import { useState } from 'react';
import type { FC } from 'react';
import { toPng } from 'html-to-image';
import { TbFileExport, TbPhoto, TbVectorSpline } from 'react-icons/tb';

function getPreviewElement(): HTMLElement | null {
  return document.getElementById('scribe-preview');
}

/** Exports the preview area as a PNG via html-to-image. */
async function exportPng(): Promise<void> {
  const el = getPreviewElement();
  if (!el) return;
  const dataUrl = await toPng(el, { pixelRatio: 2 });
  const link = document.createElement('a');
  link.download = 'scribe-export.png';
  link.href = dataUrl;
  link.click();
}

/** Exports the preview area's first SVG as an SVG file. */
function exportSvg(): void {
  const el = getPreviewElement();
  if (!el) return;
  const svg = el.querySelector('svg');
  if (!svg) return;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'scribe-export.svg';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export const ExportBar: FC = () => {
  const [busy, setBusy] = useState(false);

  async function handlePng(): Promise<void> {
    setBusy(true);
    try {
      await exportPng();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-t border-zinc-800 bg-zinc-950">
      <TbFileExport size={14} className="text-zinc-500" aria-hidden="true" />
      <span className="text-xs text-zinc-500 mr-2">Export</span>

      <button
        type="button"
        onClick={handlePng}
        disabled={busy}
        aria-label="Export as PNG"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TbPhoto size={13} aria-hidden="true" />
        PNG
      </button>

      <button
        type="button"
        onClick={exportSvg}
        aria-label="Export as SVG"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
      >
        <TbVectorSpline size={13} aria-hidden="true" />
        SVG
      </button>
    </div>
  );
};
