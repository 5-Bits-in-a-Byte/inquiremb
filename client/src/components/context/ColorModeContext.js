import React, { createContext, useState } from "react";
import Checkbox from "../common/Checkbox";

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
    leaveCourseButton: "#DC2B2B",
    interiorPanel: "#fff",
    iconBrightness: "brightness(100%)",
    whiteAndGreyButton: "#e7e7e7",
    whiteAndGreyHoverBackground: "#dedede",
    buttonSecondaryBorder: "#4a86fa",
    blueToLightGreyButton: "#4A86FA",
    draftTextArea: "white",
    checkbox: "#f1f1f1",
    modalPopup: "#fff",
    selectBorder: "#818181",
    dropDown: "white",
    dropDownHover: "#f0f0f0",
    dropDownText: "#333333",
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
    leaveCourseButton: "white",
    interiorPanel: "#191919",
    iconBrightness: "brightness(3000%)",
    whiteAndGreyButton: "#212121",
    whiteAndGreyHoverBackground: "#1a1a1a",
    buttonSecondaryBorder: "white",
    blueToLightGreyButton: "#3d3d3d",
    draftTextArea: "#181818",
    checkbox: "#3d3d3d",
    modalPopup: "#212121",
    selectBorder: "white",
    dropDown: "#181818",
    dropDownHover: "black",
    dropDownText: "white",
  },
};
