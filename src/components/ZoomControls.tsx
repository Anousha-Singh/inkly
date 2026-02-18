"use client";
import { Plus, Minus, Maximize2 } from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isDarkMode: boolean;
}

const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

export default function ZoomControls({ zoom, setZoom, setPan, isDarkMode }: ZoomControlsProps) {
  const dark = isDarkMode;

  const containerCls = `relative flex items-center gap-1 transition-colors duration-300 ${
    dark ? "text-slate-300" : "text-gray-600"
  }`;

  const btnCls = `w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 ${
    dark
      ? "hover:bg-slate-700 hover:text-white"
      : "hover:bg-indigo-50 hover:text-indigo-600"
  }`;

  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, parseFloat((z + ZOOM_STEP).toFixed(2))));

  const zoomOut = () =>
    setZoom((z) => Math.max(MIN_ZOOM, parseFloat((z - ZOOM_STEP).toFixed(2))));

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const pct = Math.round(zoom * 100);

  return (
    <div className={containerCls}>
      {/* Zoom out */}
      <button onClick={zoomOut} disabled={zoom <= MIN_ZOOM} className={btnCls} title="Zoom out (Ctrl+Scroll)">
        <Minus size={13} strokeWidth={2.5} />
      </button>

      {/* Zoom % — click to reset */}
      <button
        onClick={resetView}
        title="Reset view (100%)"
        className={`px-2 h-7 rounded-lg text-[11px] font-mono font-semibold tabular-nums transition-all duration-150 min-w-[44px] text-center ${
          dark
            ? "hover:bg-slate-700 hover:text-white"
            : "hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        {pct}%
      </button>

      {/* Zoom in */}
      <button onClick={zoomIn} disabled={zoom >= MAX_ZOOM} className={btnCls} title="Zoom in (Ctrl+Scroll)">
        <Plus size={13} strokeWidth={2.5} />
      </button>

      {/* Divider */}
      <div className={`w-px h-4 mx-0.5 ${dark ? "bg-slate-700" : "bg-gray-200"}`} />

      {/* Fit / Reset */}
      <button onClick={resetView} className={btnCls} title="Reset to 100% and re-center">
        <Maximize2 size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}
