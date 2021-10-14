import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css, ThemeConsumer } from "styled-components";
import Icon from "../../common/Icon";
import { ColorContext } from "../../context/ColorModeContext";

const SectionTab = ({
  setHighlightedSection,
  highlightedSection,
  imageLocation,
  tabText,
}) => {
  const theme = useContext(ColorContext);
  return (
    <Tab
      theme={theme}
      highlight={highlightedSection === tabText}
      onClick={() => {
        setHighlightedSection(tabText);
      }}
    >
      <Icon
        src={imageLocation}
        width={"18px"}
        style={{
          float: "left",
          marginRight: "1em",
          marginLeft: "0.75em",
          userSelect: "none",
        }}
      />
      <TabText theme={theme}>{tabText}</TabText>
    </Tab>
  );
};

SectionTab.propTypes = {
  section: PropTypes.string,
  tabText: PropTypes.string,
  imageLocation: PropTypes.string,
};

export default SectionTab;

//#region Tab Stylings
const Tab = styled.div`
  filter: ${(props) => props.theme.iconBrightness};
  display: flex;
  // border: 1px solid grey;
  width: 95%;
  height: 1.75em;
  margin: 0.25rem 0;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  ${(props) =>
    props.highlight &&
    css`
      border-left: 0.3rem solid #4a86fa;
      background: rgba(76, 134, 250, 0.09);
    `}
`;

const TabText = styled.h3`
  color: ${(props) => props.theme.logoFontColor};
  font-size: 1rem;

  user-select: none;
  transition: 150ms ease-in-out;

  :hover {
    cursor: pointer;
  }
`;
//#endregion
