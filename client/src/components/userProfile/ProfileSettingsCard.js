import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import styled, { css } from "styled-components";
import { useOnClickAway } from "../common/CustomHooks";
import { ColorContext } from "../context/ColorModeContext";

const ProfileSettingsCard = ({ title, width, height, children, ...props }) => {
  // console.log(children);

  const [displayChildren, setDisplayChildren] = useState(false);

  const node = useOnClickAway((event) => {
    setDisplayChildren(false);
  });

  const theme = useContext(ColorContext);

  return (
    <>
      <Wrapper
        theme={theme}
        ref={node}
        width={width}
        height={displayChildren ? "auto" : "3.5em"}
        children={children}
        onClick={(event) => {
          setDisplayChildren(!displayChildren);
        }}
      >
        {displayChildren ? (
          <></>
        ) : (
          <SettingTitle theme={theme}>{title}</SettingTitle>
        )}
        {displayChildren ? children : <></>}
      </Wrapper>
    </>
  );
};

export default ProfileSettingsCard;

const Wrapper = styled.div`
  cursor: pointer;
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => props.height};
  padding: 1em;
  margin: 1em;

  border: 2px solid ${(props) => props.theme.buttonBorder};
  border-radius: 5px;

  background-color: ${(props) => props.theme.button};
  color: ${(props) => props.theme.logoFontColor};
  box-shadow: 0px 1px 4px 2px rgb(0 0 0 / 7%);

  transition: 150ms ease-out;

  :hover {
    box-shadow: 5px 5px 10px rgb(0 0 0 / 25%);
  }
`;

const SettingTitle = styled.h1`
  color: ${(props) => props.theme.logoFontColor};
  width: 100%;
  text-align: center;
  font-size: 16px;

  user-select: none;
`;
