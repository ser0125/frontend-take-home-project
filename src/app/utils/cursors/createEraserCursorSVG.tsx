const createEraserCursorSVG = (size?: number) => {
  return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect x="0" y="0" width="${size}" height="${size}" fill="white" stroke="black" stroke-width="2"/>
      </svg>
    `;
};

export default createEraserCursorSVG;
