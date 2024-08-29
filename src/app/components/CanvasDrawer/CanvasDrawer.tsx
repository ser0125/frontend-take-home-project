"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CanvasDrawer.module.css";
import textCursorSvg from "/text-cursor.svg";
import Image from "next/image";
import createDrawerCursorSVG from "@/app/utils/cursors/createDrawerCursorSVG";
import createEraserCursorSVG from "@/app/utils/cursors/createEraserCursorSVG";
import createBase64Cursor from "@/app/utils/createBase64Cursor";
import createTextboxCursorSVG from "@/app/utils/cursors/createTextboxCursorSVG";
import useCanvas from "@/app/hooks/useCanvas";

export default function CanvasDrawer() {
  const {
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
    undo,
    clearCanvas,
  } = useCanvas();

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div>
          <button
            data-testid="drawer-button"
            onClick={handleDrawer}
            className={`${styles.buttonControl} ${
              toolSelected === "drawer" ? styles.activate : ""
            }`}
          >
            <Image src="/pencil.svg" alt="Pencil Logo" width={30} height={30} />
          </button>
          <button
            data-testid="textbox-button"
            onClick={handleTextbox}
            className={`${styles.buttonControl} ${
              toolSelected === "textbox" ? styles.activate : ""
            }`}
          >
            <Image src="/letter.svg" alt="Letter Logo" width={30} height={30} />
          </button>
          <button
            data-testid="eraser-button"
            onClick={handleEraser}
            className={`${styles.buttonControl} ${
              toolSelected === "eraser" ? styles.activate : ""
            }`}
          >
            <Image src="/eraser.svg" alt="Eraser Logo" width={30} height={30} />
          </button>
          <button
            data-testid="undo-button"
            onClick={undo}
            className={styles.buttonControl}
          >
            <Image src="/undo.svg" alt="Undo Logo" width={30} height={30} />
          </button>
          <button
            data-testid="clear-button"
            onClick={clearCanvas}
            className={styles.buttonControl}
          >
            <Image src="/clear.svg" alt="Clear Logo" width={30} height={30} />
          </button>
        </div>
        <div className={styles.settings}>
          <label>
            Color:
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              disabled={toolSelected === "eraser"}
            />
          </label>
          <label>
            Size:
            <input
              type="number"
              value={size}
              min="1"
              max="20"
              onChange={handleWidthChange}
            />
          </label>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className={`${styles.canvas} ${
          toolSelected === "eraser" ? styles.eraserMode : ""
        }`}
      />
      {toolSelected === "textbox" && cursorPosition && (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleTextChange}
          onBlur={drawText}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              drawText();
            }
          }}
          style={{
            position: "absolute",
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y + 40}px`,
            backgroundColor: "white",
            border: "1px solid black",
            padding: "2px",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
