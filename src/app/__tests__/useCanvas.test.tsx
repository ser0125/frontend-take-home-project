import { renderHook, act } from "@testing-library/react";
import useCanvas from "../hooks/useCanvas";
import { useCanvasStore } from "../store/canvasStore";
import React from "react";

describe("useCanvas", () => {
  const mockCanvas = document.createElement("canvas");
  const mockContext = {
    font: "",
    fillStyle: "",
    textAlign: "",
    textBaseline: "",
    fillText: jest.fn(),
    clearRect: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(React, "useRef").mockReturnValue({ current: mockCanvas });
    mockCanvas.getContext = jest.fn().mockReturnValue(mockContext);
    mockCanvas.toDataURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    //Arrange
    const { result } = renderHook(() => useCanvas());

    //Assert
    expect(result.current.color).toBe("black");
    expect(result.current.size).toBe(5);
    expect(result.current.toolSelected).toBe("drawer");
    expect(result.current.text).toBe("");
    expect(result.current.cursorPosition).toBe(null);
  });

  it("should change the tool to eraser, drawer and ", () => {
    //Arrange
    const { result } = renderHook(() => useCanvas());

    //Act
    act(() => {
      result.current.handleEraser();
    });

    //Assert
    expect(result.current.toolSelected).toBe("eraser");

    //Act
    act(() => {
      result.current.handleDrawer();
    });

    //Assert
    expect(result.current.toolSelected).toBe("drawer");

    //Act
    act(() => {
      result.current.handleTextbox();
    });

    //Assert
    expect(result.current.toolSelected).toBe("textbox");
  });

  it("should update the color and size", () => {
    //Arrange
    const { result } = renderHook(() => useCanvas());

    //Act
    act(() => {
      result.current.handleColorChange({
        target: { value: "red" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    //Assert
    expect(result.current.color).toBe("red");

    //Act
    act(() => {
      result.current.handleWidthChange({
        target: { value: "10" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    //Assert
    expect(result.current.size).toBe(10);
  });

  it("should update the text", () => {
    //Arrange
    const { result } = renderHook(() => useCanvas());

    //Act
    act(() => {
      result.current.handleTextChange({ target: { value: "Hello" } });
    });

    //Assert
    expect(result.current.text).toBe("Hello");
  });

  it("should called fillText in the context when the drawText event fired", () => {
    //Arrange
    const { result } = renderHook(() => useCanvas());
    const { result: storeResult } = renderHook(() => useCanvasStore());

    // Act
    act(() => {
      storeResult.current.setCursorPosition({ x: 10, y: 10 });
    });

    // Act
    act(() => {
      result.current.drawText();
    });

    // Assert
    expect(mockContext.fillText).toHaveBeenCalledWith("Hello", 10, 10);
    expect(mockContext.font).toBe("20px Arial");
    expect(mockContext.fillStyle).toBe("red");
    expect(mockContext.textAlign).toBe("left");
    expect(mockContext.textBaseline).toBe("top");
  });

  it("should clear the canvas", () => {
    //Arrange
    const { result } = renderHook(() => useCanvas());
    const { result: storeResult } = renderHook(() => useCanvasStore());

    // Act
    act(() => {
      storeResult.current.setCursorPosition({ x: 10, y: 10 });
    });
    // Act
    act(() => {
      result.current.drawText();
      result.current.clearCanvas();
    });

    expect(mockContext.fillText).toHaveBeenCalledWith("", 10, 10);
    expect(storeResult.current.history.length).toBe(0);
    expect(storeResult.current.historyIndex).toBe(-1);
  });
});
