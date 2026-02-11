"use client";
import { Tool } from "@/types";
import { Pen, Eraser, Square, Circle, Diamond, ArrowRight, Type, Palette, Grid3X3, Shapes, Triangle, Minus, Star, Hexagon, Hand } from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  color: string;
  onColorChange: (color: string) => void;
  lineWidth: number;
  onLineWidthChange: (width: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  isDarkMode: boolean;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
}

export default function Toolbar({ 
    activeTool, 
    onToolChange, 
    color, 
    onColorChange, 
    lineWidth, 
    onLineWidthChange,
    opacity,
    onOpacityChange,
    isDarkMode,
    showGrid,
    onShowGridChange
}: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [activePanel, setActivePanel] = useState<Tool | null>(null);
  
  const mainTools: { id: Tool | 'shapes'; icon: any; label: string }[] = [
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "shapes", icon: Shapes, label: "Shapes" },
    { id: "text", icon: Type, label: "Text" },
    { id: "pan", icon: Hand, label: "Pan" },
  ];

  const shapeTools: { id: Tool; icon: any; label: string }[] = [
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "diamond", icon: Diamond, label: "Diamond" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "star", icon: Star, label: "Star" },
    { id: "hexagon", icon: Hexagon, label: "Hexagon" },
  ];

  const presetColors = [
    "#000000", "#EF4444", "#F59E0B", "#10B981", 
    "#3B82F6", "#8B5CF6", "#EC4899", "#FFFFFF"
  ];

  return (
    <>
      {/* Floating Bottom Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className={`pointer-events-auto backdrop-blur-xl shadow-2xl border rounded-2xl p-1.5 flex items-center gap-1.5 transition-colors duration-300 ${
            isDarkMode ? "bg-slate-900/90 border-slate-700" : "bg-white/90 border-gray-200/50"
        }`}>
          {/* Main Tools */}
          {mainTools.map((t) => (
            <div key={t.id} className="relative">
              <button
                onClick={() => {
                  if (t.id === 'shapes') {
                    setShowShapesMenu(!showShapesMenu);
                    setShowColorPicker(false);
                    setActivePanel(null);
                  } else {
                    if (activeTool === t.id) {
                      setActivePanel(activePanel === t.id ? null : t.id);
                    } else {
                      onToolChange(t.id as Tool);
                      setActivePanel(null);
                    }
                    setShowShapesMenu(false);
                    setShowColorPicker(false);
                  }
                }}
                className={`group relative p-2.5 rounded-xl transition-all duration-300 ${
                  (activeTool === t.id || (t.id === 'shapes' && shapeTools.some(s => s.id === activeTool)))
                    ? isDarkMode ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                    : isDarkMode 
                      ? "text-slate-400 hover:bg-slate-800 hover:text-indigo-400 hover:scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600 hover:scale-105"
                }`}
                title={t.label}
              >
                <t.icon size={18} strokeWidth={(activeTool === t.id || (t.id === 'shapes' && shapeTools.some(s => s.id === activeTool))) ? 2.5 : 2} />
                
                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {t.label}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </span>
              </button>

              {/* Shapes Submenu */}
              {t.id === 'shapes' && showShapesMenu && (
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[280px] ${
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                }`}>
                  <div className="flex flex-col gap-4">
                    {/* Shape Tools Grid */}
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Shape Type</p>
                      <div className="grid grid-cols-2 gap-2">
                        {shapeTools.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              onToolChange(s.id);
                            }}
                            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                              activeTool === s.id
                                ? isDarkMode ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
                                : isDarkMode ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <s.icon size={18} />
                            <span className="text-[11px] font-medium">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className={`h-px w-full ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`} />

                    {/* Size Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Size</span>
                        <span className={`text-[10px] font-mono ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{lineWidth}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={lineWidth}
                        onChange={(e) => onLineWidthChange(parseInt(e.target.value))}
                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${isDarkMode ? "bg-slate-700" : "bg-indigo-50"}`}
                      />
                    </div>

                    {/* Opacity Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Opacity</span>
                        <span className={`text-[10px] font-mono ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{Math.round(opacity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01"
                        value={opacity}
                        onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${isDarkMode ? "bg-slate-700" : "bg-indigo-50"}`}
                      />
                    </div>
                  </div>
                  {/* Arrow pointer */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent ${isDarkMode ? "border-t-slate-800" : "border-t-white"}`}></div>
                </div>
              )}

              {/* Size/Opacity Panel for Pen and Eraser */}
              {activePanel === t.id && (
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                }`}>
                  <div className="flex flex-col gap-4">
                    {/* Size Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-gray-500">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Size</span>
                        <span className={`text-[10px] font-mono ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{lineWidth}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={lineWidth}
                        onChange={(e) => onLineWidthChange(parseInt(e.target.value))}
                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${isDarkMode ? "bg-slate-700" : "bg-indigo-50"}`}
                      />
                    </div>

                    {/* Opacity Slider - Hide for eraser */}
                    {t.id !== 'eraser' && (
                      <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-center text-gray-500">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Opacity</span>
                          <span className={`text-[10px] font-mono ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{Math.round(opacity * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01"
                          value={opacity}
                          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                          className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${isDarkMode ? "bg-slate-700" : "bg-indigo-50"}`}
                        />
                      </div>
                    )}
                  </div>
                  {/* Arrow pointer */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent ${isDarkMode ? "border-t-slate-800" : "border-t-white"}`}></div>
                </div>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className={`w-px h-7 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-0.5 ${isDarkMode ? "via-slate-700" : "via-gray-300"}`} />

          {/* Color Picker Button */}
          <div className="relative">
            <button
              onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setActivePanel(null);
              }}
              className={`group relative p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"
              }`}
              title="Color Picker"
            >
              <div className="relative">
                <Palette size={18} className={isDarkMode ? "text-slate-300" : "text-gray-600"} strokeWidth={2} />
                <div 
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 shadow-sm ${isDarkMode ? "border-slate-800" : "border-white"}`}
                  style={{ backgroundColor: color }}
                />
              </div>
              
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Colors
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </span>
            </button>

            {/* Color Picker Dropdown */}
            {showColorPicker && (
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 backdrop-blur-xl shadow-2xl border rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[280px] ${
                isDarkMode ? "bg-slate-800/95 border-slate-700" : "bg-white/95 border-gray-200/50"
              }`}>
                <div className="flex flex-col gap-4">
                  <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Palette</p>
                      <div className="grid grid-cols-4 gap-3">
                        {presetColors.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              onColorChange(c);
                              setShowColorPicker(false);
                            }}
                            className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm ${
                              c === "#FFFFFF" ? isDarkMode ? "border-2 border-slate-600" : "border-2 border-gray-200" : ""
                            } ${
                              color === c ? "ring-2 ring-indigo-500 ring-offset-2 scale-110 z-10" : isDarkMode ? "hover:ring-2 hover:ring-slate-600 hover:ring-offset-2 hover:ring-offset-slate-800" : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-2"
                            }`}
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                  </div>
                  
                  <div className={`h-px w-full ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`} />
                  
                  <div className="flex items-center gap-3">
                    <label className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Hex Code</label>
                    <div className={`relative flex-1 flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                        isDarkMode ? "bg-slate-900 border-slate-700 focus-within:border-indigo-500" : "bg-gray-50 border-gray-200 focus-within:border-indigo-300"
                    }`}>
                      <div 
                        className={`w-6 h-6 rounded-lg border shadow-sm ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}
                        style={{ backgroundColor: color }}
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className={`w-full bg-transparent text-sm font-mono uppercase outline-none ${isDarkMode ? "text-slate-200" : "text-gray-700"}`}
                      />
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Arrow pointer */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent ${isDarkMode ? "border-t-slate-800" : "border-t-white/95"}`}></div>
              </div>
            )}
          </div>

          <div className={`w-px h-7 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-0.5 ${isDarkMode ? "via-slate-700" : "via-gray-300"}`} />

          {/* Grid Toggle */}
          <button
            onClick={() => onShowGridChange(!showGrid)}
            className={`group relative p-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
              showGrid
                ? isDarkMode ? "text-indigo-400 bg-indigo-400/10" : "text-indigo-600 bg-indigo-50"
                : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100"
            }`}
            title={showGrid ? "Hide Grid" : "Show Grid"}
          >
            <Grid3X3 size={18} strokeWidth={showGrid ? 2.5 : 2} />
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {showGrid ? "Hide Grid" : "Show Grid"}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </span>
          </button>
        </div>
      </div>

      {/* Close pickers when clicking outside */}
      {(showColorPicker || activePanel || showShapesMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
              setShowColorPicker(false);
              setActivePanel(null);
              setShowShapesMenu(false);
          }}
        />
      )}
    </>
  );
}
