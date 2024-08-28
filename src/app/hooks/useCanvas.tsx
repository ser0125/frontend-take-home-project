import { useCallback, useEffect, useRef, useState } from "react";
import createBase64Cursor from "../utils/createBase64Cursor";
import createEraserCursorSVG from "../utils/cursors/createEraserCursorSVG";
import createDrawerCursorSVG from "../utils/cursors/createDrawerCursorSVG";
import createTextboxCursorSVG from "../utils/cursors/createTextboxCursorSVG";
import { useCanvasStore } from "../store/canvasStore";

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const {
    color,
    size,
    toolSelected,
    text,
    cursorPosition,
    history,
    historyIndex,
    setColor,
    setSize,
    setToolSelected,
    setText,
    setCursorPosition,
    setHistoryIndex,
    addToHistory,
    clearHistory,
  } = useCanvasStore();

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      addToHistory(dataURL);
    }
  }, [addToHistory]);

  const draw = useCallback(
    (event: MouseEvent) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (context) {
          context.lineWidth = toolSelected === "eraser" ? size * 2 : size;
          context.strokeStyle = toolSelected === "eraser" ? "#d6dbdc" : color;
          context.lineCap = "round";
          context.lineTo(x, y);
          context.stroke();
          context.beginPath();
          context.moveTo(x, y);
        }
      }
    },
    [color, isDrawing, size, toolSelected]
  );

  const startDrawing = useCallback(
    (event: MouseEvent) => {
      setIsDrawing(true);
      draw(event);
    },
    [draw]
  );

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) context.beginPath();
      saveState();
    }
  }, [saveState]);

  const handleDrawer = () => {
    setToolSelected("drawer");
  };

  const handleEraser = () => {
    setToolSelected("eraser");
    setColor("black");
  };

  const handleTextbox = () => {
    setToolSelected("textbox");
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(e.target.value, 10));
  };

  const handleTextChange = (event: any) => {
    setText(event.target.value);
  };

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleMouseClick = useCallback(
    (event: any) => {
      if (toolSelected === "textbox") {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          setCursorPosition({ x, y });
        }
      }
    },
    [toolSelected, setCursorPosition]
  );

  const drawText = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.font = `${size * 2}px Arial`; // Puedes ajustar el tamaño y tipo de fuente
        context.fillStyle = color;
        context.textAlign = "left";
        context.textBaseline = "top";
        if (cursorPosition) {
          context.fillText(text, cursorPosition.x, cursorPosition.y);
          setText("");
          setCursorPosition(null);
          saveState();
        }
      }
    }
  }, [
    cursorPosition,
    color,
    size,
    text,
    saveState,
    setCursorPosition,
    setText,
  ]);

  const undo = () => {
    if (historyIndex === 0) clearCanvas();
    if (historyIndex < 0) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      const img = new Image();
      img.src = prevState;
      if (context) {
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);
          setHistoryIndex(prevIndex);
        };
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        clearHistory();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (toolSelected !== "textbox") {
        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mouseup", endDrawing);
        canvas.addEventListener("mousemove", draw);

        if (toolSelected === "eraser") {
          const base64EraserCursor = createBase64Cursor(
            createEraserCursorSVG,
            size * 2
          );
          canvas.style.cursor = `url(${base64EraserCursor}) ${size} ${size}, auto`;
        } else {
          const base64DrawerCursor = createBase64Cursor(
            createDrawerCursorSVG,
            size * 2,
            color
          );
          canvas.style.cursor = `url(${base64DrawerCursor}) ${size} ${size}, auto`;
        }

        return () => {
          canvas.removeEventListener("mousedown", startDrawing);
          canvas.removeEventListener("mouseup", endDrawing);
          canvas.removeEventListener("mousemove", draw);
          canvas.removeEventListener("click", handleMouseClick);
        };
      } else {
        canvas.addEventListener("click", handleMouseClick);
        const base64Cursor = createBase64Cursor(createTextboxCursorSVG);
        canvas.style.cursor = `url(${base64Cursor}) ${size} ${size}, auto`;
        return () => {
          canvas.removeEventListener("click", handleMouseClick);
        };
      }
    }
  }, [
    draw,
    startDrawing,
    endDrawing,
    handleMouseClick,
    size,
    toolSelected,
    color,
  ]);

  useEffect(() => {
    if (cursorPosition) {
      focusInput();
    }
  }, [cursorPosition, focusInput]);

  return {
    canvasRef,
    color,
    toolSelected,
    size,
    text,
    cursorPosition,
    inputRef,
    handleDrawer,
    handleEraser,
    handleTextbox,
    handleColorChange,
    handleWidthChange,
    handleTextChange,
    drawText,
    focusInput,
    undo,
    clearCanvas,
  };
};

export default useCanvas;
