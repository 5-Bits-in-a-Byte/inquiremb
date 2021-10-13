import { BlockMapBuilder } from "draft-js";
import React, { createContext, useState } from "react";

const ColorContext = createContext(undefined);
const ColorDispatchContext = createContext(undefined);

function ColorProvider({ children }) {
  const [colorTheme, setColorTheme] = useState(colorThemes.light);

  return (
    <ColorContext.Provider value={colorTheme}>
      <ColorDispatchContext.Provider value={setColorTheme}>
        {children}
      </ColorDispatchContext.Provider>
    </ColorContext.Provider>
  );
}

export { ColorContext, ColorDispatchContext, ColorProvider };

export const colorThemes = {
  light: {
    background: "white",
    panel: "#162B55",
    header: "white",
    textColor: "black",
    button: "#e7e7e7",
    logoFontColor: "#162B55",
    buttonHover: "dedede",
    menuItemActive: "#0B1B3A",
    aboutPanelColor: "#fff",
    panelContentHighlight: "#f8f8f8",
    test: "black",
    buttonBorder: "#dfdfdf",
  },
  dark: {
    background: "#181818",
    panel: "#212121",
    header: "#212121",
    textColor: "white",
    button: "#3d3d3d",
    logoFontColor: "white",
    buttonHover: "3d3d3d",
    menuItemActive: "#3d3d3d",
    aboutPanelColor: "#212121",
    panelContentHighlight: "#181818",
    test: "black",
    buttonBorder: "black",
  },
};
