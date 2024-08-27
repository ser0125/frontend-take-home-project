"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CanvasDrawer.module.css";
import textCursorSvg from "/text-cursor.svg";

export default function CanvasDrawer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  const [toolSelected, setToolSelected] = useState("drawer");

  const [text, setText] = useState(""); // Contenido del texto
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null); // Posición del cursor para dibujar texto

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
          context.lineWidth =
            toolSelected === "eraser" ? lineWidth * 2 : lineWidth;
          context.strokeStyle = toolSelected === "eraser" ? "#d6dbdc" : color;
          context.lineCap = "round";
          context.lineTo(x, y);
          context.stroke();
          context.beginPath();
          context.moveTo(x, y);
        }
      }
    },
    [color, isDrawing, lineWidth, toolSelected]
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
    }
  }, []);

  const handleDrawer = () => {
    setToolSelected("drawer");
    setLineWidth(5);
  };

  const handleEraser = () => {
    setToolSelected("eraser");
    setColor("black"); // Restablecer el color cuando se activa el borrador
  };

  const handleTextbox = () => {
    setToolSelected("textbox");
    setColor("black"); // Restablecer el color cuando se activa el borrador
  };

  const handleTextChange = (event: any) => {
    setText(event.target.value);
  };

  const handleMouseClick = useCallback(
    (event: any) => {
      if (toolSelected === "textbox") {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          setCursorPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      }
    },
    [toolSelected]
  );

  const drawText = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.font = "20px Arial"; // Puedes ajustar el tamaño y tipo de fuente
        context.fillStyle = color;
        context.textAlign = "left";
        context.textBaseline = "top";
        if (cursorPosition) {
          context.fillText(text, cursorPosition.x, cursorPosition.y);
          setText("");
          setCursorPosition(null);
        }
      }
    }
  }, [cursorPosition, color, text]);

  const createDrawerCursorSVG = useCallback(
    (size: number) => {
      return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}"/>
      </svg>
    `;
    },
    [color]
  );

  const createEraserCursorSVG = (size: number) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect x="0" y="0" width="${size}" height="${size}" fill="white" stroke="black" stroke-width="2"/>
      </svg>
    `;
  };

  const createBase64DrawerCursor = useCallback(
    (size: number) => {
      const svg = createDrawerCursorSVG(size);
      console.log("svg", svg);
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    },
    [createDrawerCursorSVG]
  );

  const createBase64TextboxCursor = () => {
    const base64Cursor = `data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEyLDEzIEwxMC41LDEzIEMxMC4yMjM4NTc2LDEzIDEwLDEyLjc3NjE0MjQgMTAsMTIuNSBDMTAsMTIuMjIzODU3NiAxMC4yMjM4NTc2LDEyIDEwLjUsMTIgTDEyLDEyIEwxMiw1LjUgQzEyLDQuNjcxNTcyODggMTEuMzI4NDI3MSw0IDEwLjUsNCBMOS41LDQgQzkuMjIzODU3NjMsNCA5LDMuNzc2MTQyMzcgOSwzLjUgQzksMy4yMjM4NTc2MyA5LjIyMzg1NzYzLDMgOS41LDMgTDEwLjUsMyBDMTEuMzE3Nzk5NSwzIDEyLjA0Mzg4NTYsMy4zOTI2NzE1NSAxMi41LDMuOTk5NzU2MjcgQzEyLjk1NjExNDQsMy4zOTI2NzE1NSAxMy42ODIyMDA1LDMgMTQuNSwzIEwxNS41LDMgQzE1Ljc3NjE0MjQsMyAxNiwzLjIyMzg1NzYzIDE2LDMuNSBDMTYsMy43NzYxNDIzNyAxNS43NzYxNDI0LDQgMTUuNSw0IEwxNC41LDQgQzEzLjY3MTU3MjksNCAxMyw0LjY3MTU3Mjg4IDEzLDUuNSBMMTMsMTIgTDE0LjUsMTIgQzE0Ljc3NjE0MjQsMTIgMTUsMTIuMjIzODU3NiAxNSwxMi41IEMxNSwxMi43NzYxNDI0IDE0Ljc3NjE0MjQsMTMgMTQuNSwxMyBMMTMsMTMgTDEzLDE5LjUgQzEzLDIwLjMyODQyNzEgMTMuNjcxNTcyOSwyMSAxNC41LDIxIEwxNS41LDIxIEMxNS43NzYxNDI0LDIxIDE2LDIxLjIyMzg1NzYgMTYsMjEuNSBDMTYsMjEuNzc2MTQyNCAxNS43NzYxNDI0LDIyIDE1LjUsMjIgTDE0LjUsMjIgQzEzLjY4MjIwMDUsMjIgMTIuOTU2MTE0NCwyMS42MDczMjg1IDEyLjUsMjEuMDAwMjQzNyBDMTIuMDQzODg1NiwyMS42MDczMjg1IDExLjMxNzc5OTUsMjIgMTAuNSwyMiBMOS41LDIyIEM5LjIyMzg1NzYzLDIyIDksMjEuNzc2MTQyNCA5LDIxLjUgQzksMjEuMjIzODU3NiA5LjIyMzg1NzYzLDIxIDkuNSwyMSBMMTAuNSwyMSBDMTEuMzI4NDI3MSwyMSAxMiwyMC4zMjg0MjcxIDEyLDE5LjUgTDEyLDEzIFoiLz4KPC9zdmc+`;
    return base64Cursor;
  };

  const createBase64EraserCursor = useCallback((size: number) => {
    const svg = createEraserCursorSVG(size);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (toolSelected !== "textbox") {
        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mouseup", endDrawing);
        canvas.addEventListener("mousemove", draw);

        if (toolSelected === "eraser") {
          const base64EraserCursor = createBase64EraserCursor(lineWidth * 2);
          canvas.style.cursor = `url(${base64EraserCursor}) ${lineWidth} ${lineWidth}, auto`;
        } else {
          const base64DrawerCursor = createBase64DrawerCursor(lineWidth * 2);
          canvas.style.cursor = `url(${base64DrawerCursor}) ${lineWidth} ${lineWidth}, auto`;
        }

        return () => {
          canvas.removeEventListener("mousedown", startDrawing);
          canvas.removeEventListener("mouseup", endDrawing);
          canvas.removeEventListener("mousemove", draw);
          canvas.removeEventListener("click", handleMouseClick);
        };
      } else {
        canvas.addEventListener("click", handleMouseClick);
        const base64Cursor = createBase64TextboxCursor();
        canvas.style.cursor = `url(${base64Cursor}) ${lineWidth} ${lineWidth}, auto`;
        return () => {
          canvas.removeEventListener("click", handleMouseClick);
        };
      }
    }
  }, [
    draw,
    startDrawing,
    endDrawing,
    createBase64EraserCursor,
    createBase64DrawerCursor,
    handleMouseClick,
    lineWidth,
    toolSelected,
  ]);

  useEffect(() => {
    if (cursorPosition) {
      drawText();
    }
  }, [drawText, cursorPosition]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={handleDrawer} className="eraser-btn">
          {"Draw"}
        </button>
        <button onClick={handleTextbox} className="eraser-btn">
          {"Textbox"}
        </button>
        <button onClick={handleEraser} className="eraser-btn">
          {"Erase"}
        </button>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={toolSelected === "eraser"}
          />
        </label>
        <label>
          Line Width:
          <input
            type="number"
            value={lineWidth}
            min="1"
            max="20"
            onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
          />
        </label>
        {toolSelected === "textbox" && (
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text here"
            className="text-input"
          />
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className={`${styles.canvas} ${
          toolSelected === "eraser" ? styles.eraserMode : ""
        }`}
      />
    </div>
  );
}
