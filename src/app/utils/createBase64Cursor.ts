const createBase64Cursor = (
  callback: (size?: number, color?: string) => string,
  size?: number,
  color?: string
) => {
  const svg = callback(size, color);
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default createBase64Cursor;
