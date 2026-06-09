import type { FC, ReactNode } from 'react';

interface PreviewCanvasProps {
  children: ReactNode;
}

/**
 * Full-bleed preview area that wraps the active module's renderer.
 * The id "scribe-preview" is the capture root for PNG/SVG export.
 */
export const PreviewCanvas: FC<PreviewCanvasProps> = ({ children }) => {
  return (
    <div className="flex-1 h-full overflow-hidden">
      {children}
    </div>
  );
};
