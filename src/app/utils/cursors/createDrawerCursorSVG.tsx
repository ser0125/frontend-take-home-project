const createDrawerCursorSVG = (size: number = 20, color?: string) => {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle cx="${size / 2}" cy="${size / 2}" r="${
    size / 2
  }" fill="${color}"/>
        </svg>
      `;
};

export default createDrawerCursorSVG;
