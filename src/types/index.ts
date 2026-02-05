export type Point = { x: number; y: number };

export type Tool = 'pen' | 'eraser' | 'rect' | 'circle' | 'diamond' | 'line' | 'triangle' | 'star' | 'hexagon' | 'arrow' | 'text';

export interface DrawAction {
    type: Tool;
    points: Point[]; // For pen: multiple points. For rect: [start, end]. For arrow: [start, end].
    color: string;
    width: number;
    opacity: number;
    text?: string; // For text tool
    id: string; // unique ID for undo/redo
}

export interface CursorPosition {
    x: number;
    y: number;
    userId: string;
    username: string;
    color: string;
}
