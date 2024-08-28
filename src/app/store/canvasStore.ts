import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CanvasState {
  color: string;
  size: number;
  toolSelected: string;
  text: string;
  cursorPosition: { x: number; y: number } | null;
  history: string[];
  historyIndex: number;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setToolSelected: (tool: string) => void;
  setText: (text: string) => void;
  setCursorPosition: (position: { x: number; y: number } | null) => void;
  setHistoryIndex: (historyIndex: number) => void;
  addToHistory: (dataURL: string) => void;
  clearHistory: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  devtools(
    persist(
      (set) => ({
        color: "black",
        size: 5,
        toolSelected: "drawer",
        text: "",
        cursorPosition: null,
        history: [],
        historyIndex: -1,
        setSize: (size: number) => set({ size }),
        setColor: (color: string) => set({ color }),
        setToolSelected: (toolSelected: string) => set({ toolSelected }),
        setText: (text) => set({ text }),
        setCursorPosition: (cursorPosition) => set({ cursorPosition }),
        setHistoryIndex: (historyIndex) => set({ historyIndex }),
        addToHistory: (dataURL) =>
          set((state) => {
            let newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory = [...newHistory, dataURL];
            return {
              history: newHistory,
              historyIndex: state.historyIndex + 1,
            };
          }),
        clearHistory: () => set({ history: [], historyIndex: -1 }),
      }),
      {
        name: "canvas-storage",
      }
    )
  )
);
