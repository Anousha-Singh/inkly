"use client";
import { Tool } from "@/types";
import { Pen, Eraser, Square, ArrowRight, Type, Palette } from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  color: string;
  onColorChange: (color: string) => void;
  lineWidth: number;
  onLineWidthChange: (width: number) => void;
}

export default function Toolbar({ activeTool, onToolChange, color, onColorChange, lineWidth, onLineWidthChange }: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  
  const tools: { id: Tool; icon: any; label: string }[] = [
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "text", icon: Type, label: "Text" },
  ];

  const presetColors = [
    "#000000", "#EF4444", "#F59E0B", "#10B981", 
    "#3B82F6", "#8B5CF6", "#EC4899", "#FFFFFF"
  ];

  return (
    <>
      {/* Floating Bottom Toolbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 rounded-3xl p-2 flex items-center gap-2">
          {/* Tools */}
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => onToolChange(t.id)}
              className={`group relative p-3.5 rounded-2xl transition-all duration-300 ${
                activeTool === t.id
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600 hover:scale-105"
              }`}
              title={t.label}
            >
              <t.icon size={22} strokeWidth={activeTool === t.id ? 2.5 : 2} />
              
              {/* Tooltip */}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {t.label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </span>
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1" />

          {/* Size Picker */}
          <div className="relative">
             <button 
                onClick={() => {
                    setShowSizePicker(!showSizePicker);
                    setShowColorPicker(false);
                }}
                className="group relative p-3.5 rounded-2xl transition-all duration-300 hover:bg-gray-100 hover:scale-105"
             >
                <div className="w-6 h-6 flex items-center justify-center">
                    <div 
                        className="bg-gray-800 rounded-full transition-all duration-300" 
                        style={{ width: Math.max(4, Math.min(20, lineWidth)), height: Math.max(4, Math.min(20, lineWidth)) }}
                    />
                </div>
                 {/* Tooltip */}
                 <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Size
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </span>
             </button>

             {showSizePicker && (
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 rounded-2xl p-6 h-[200px] flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[60px]">
                    <div className="flex-1 relative w-2 bg-gray-100 rounded-full">
                        <input 
                            type="range" 
                            min="2" 
                            max="50" 
                            value={lineWidth} 
                            onChange={(e) => onLineWidthChange(parseInt(e.target.value))}
                            className="absolute -left-1 w-[150px] h-full rotate-90 origin-left opacity-0 cursor-pointer z-10"
                        />
                         {/* Visual Slider Track */}
                        <div className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-full" style={{ height: `${(lineWidth / 50) * 100}%` }} />
                        {/* Thumb */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow-md pointer-events-none transition-all duration-75" style={{ bottom: `calc(${(lineWidth / 50) * 100}% - 8px)` }} />
                    </div>
                </div>
             )}
          </div>

          {/* Color Picker Button */}
          <div className="relative">
            <button
              onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowSizePicker(false);
              }}
              className="group relative p-3.5 rounded-2xl transition-all duration-300 hover:bg-gray-100 hover:scale-105"
              title="Color Picker"
            >
              <div className="relative">
                <Palette size={22} className="text-gray-600" strokeWidth={2} />
                <div 
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              </div>
              
              {/* Tooltip */}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Colors
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </span>
            </button>

            {/* Color Picker Dropdown */}
            {showColorPicker && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[280px]">
                <div className="flex flex-col gap-4">
                  <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Palette</p>
                      <div className="grid grid-cols-4 gap-3">
                        {presetColors.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              onColorChange(c);
                              setShowColorPicker(false);
                            }}
                            className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm ${
                              c === "#FFFFFF" ? "border-2 border-gray-200" : ""
                            } ${
                              color === c ? "ring-2 ring-indigo-500 ring-offset-2 scale-110 z-10" : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-2"
                            }`}
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                  </div>
                  
                  <div className="h-px bg-gray-100 w-full" />
                  
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Hex Code</label>
                    <div className="relative flex-1 flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <div 
                        className="w-6 h-6 rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-full bg-transparent text-sm font-mono text-gray-700 uppercase outline-none"
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-white/95"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close pickers when clicking outside */}
      {(showColorPicker || showSizePicker) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
              setShowColorPicker(false);
              setShowSizePicker(false);
          }}
        />
      )}
    </>
  );
}
