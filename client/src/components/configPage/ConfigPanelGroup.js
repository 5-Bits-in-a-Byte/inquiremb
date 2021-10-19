import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InfoIcon from "../../imgs/Info_tip.svg";
import { ColorContext } from "../context/ColorModeContext";

const ConfigPanelGroup = ({ panelHeader, children, ...props }) => {
  const theme = useContext(ColorContext);
  return (
    <GroupWrapper>
      <HeaderGroup>
        <HeaderText theme={theme}>{panelHeader}</HeaderText>
        <HeaderInfoIcon theme={theme} src={InfoIcon} />
      </HeaderGroup>
      {children}
    </GroupWrapper>
  );
};

export default ConfigPanelGroup;

const GroupWrapper = styled.div`
  margin: 1rem;
  padding: 2rem;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
`;

const HeaderGroup = styled.div`
  display: flex;
  align-items: center;

  padding: 0.25rem;

  /* border: 1px solid orange; */
`;

const HeaderText = styled.p`
  color: ${(props) => props.theme.logoFontColor};
  margin: 0 0.5rem 0 0;

  font-size: 16px;
  font-weight: 600;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

const HeaderInfoIcon = styled.img`
  filter: ${(props) => props.theme.iconBrightness};
  width: 16px;
  height: 16px;
`;
