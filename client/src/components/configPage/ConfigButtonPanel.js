import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Button from "../common/Button";
import "../common/css/noTextSelection.css";

/**
 *
 * @param {string} panelText the text description of the panel...
 * @returns
 */
const ConfigButtonPanel = ({ panelText, ...props }) => {
  return (
    <ConfigPanelWrapper className={"noselect"}>
      <ConfigTextWrapper>{panelText}</ConfigTextWrapper>
      <ConfigChildrenWrapper>{props.children}</ConfigChildrenWrapper>
    </ConfigPanelWrapper>
  );
};

export default ConfigButtonPanel;

// ConfigButtonPanel.PropTypes = {};

const ConfigPanelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  max-width: 1200px;
  margin: 1em 0;
  padding: 0.5em;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
  border-radius: 5px;

  /* border: 1px solid black; */
  /* border-radius: 0.25em; */
`;

const ConfigTextWrapper = styled.div`
  color: #737373;

  margin: 0 2rem;

  /* border: 1px solid orange; */
  border-radius: 0.25em;
`;

const ConfigChildrenWrapper = styled.div`
  flex-shrink: 0;
  margin: 0 2rem;

  /* border: 1px solid blue; */
`;
