/**
 * @param color needs to be a hex value string
 *
 * This code was obtained from https://awik.io/determine-color-bright-dark-using-javascript/
 */
export const ContrastDetector = (color) => {
  var r, g, b, colorVal;

  // Convert hex value to integer - MAGIC
  color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

  // Bit manipulation to obtain rgb values
  r = color >> 16;
  g = (color >> 8) & 255;
  b = color & 255;

  // Get a value between 0 and 255 using rgb values
  colorVal = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Determine if the color is light or dark
  if (colorVal > 127.5) {
    return "light";
  } else {
    return "dark";
  }
};
