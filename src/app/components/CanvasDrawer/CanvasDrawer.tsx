"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CanvasDrawer.module.css";

export default function CanvasDrawer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  const [isErasing, setIsErasing] = useState(false);

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
          context.lineWidth = isErasing ? lineWidth * 2 : lineWidth;
          context.strokeStyle = isErasing ? "#d6dbdc" : color;
          context.lineCap = "round";
          context.lineTo(x, y);
          context.stroke();
          context.beginPath();
          context.moveTo(x, y);
        }
      }
    },
    [color, isDrawing, lineWidth, isErasing]
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

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    if (isErasing) {
      setColor("black"); // Restablecer el color cuando se activa el borrador
    }
  };

  const createEraserCursorSVG = (size: number) => {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect x="0" y="0" width="${size}" height="${size}" fill="white" stroke="black" stroke-width="2"/>
      </svg>
    `;
  };

  const createBase64EraserCursor = useCallback((size: number) => {
    const svg = createEraserCursorSVG(size);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mouseup", endDrawing);
      canvas.addEventListener("mousemove", draw);

      const base64EraserCursor = createBase64EraserCursor(lineWidth);
      canvas.style.cursor = isErasing
        ? `url(${base64EraserCursor}) ${lineWidth / 2} ${lineWidth / 2}, auto`
        : "default";

      return () => {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mouseup", endDrawing);
        canvas.removeEventListener("mousemove", draw);
      };
    }
  }, [
    draw,
    startDrawing,
    endDrawing,
    createBase64EraserCursor,
    lineWidth,
    isErasing,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isErasing}
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
        <button onClick={toggleEraser} className="eraser-btn">
          {isErasing ? "Draw" : "Erase"}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className={`${styles.canvas} ${isErasing ? styles.eraserMode : ""}`}
      />
    </div>
  );
}
