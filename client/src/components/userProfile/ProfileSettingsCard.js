import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

const ProfileSettingsCard = ({ title, width, height, children, ...props }) => {
  // console.log(children);

  const [displayChildren, setDisplayChildren] = useState(false);

  const node = useRef();

  const handleClick = (event) => {
    if (node.current.contains(event.target)) return;

    setDisplayChildren(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <>
      <Wrapper
        ref={node}
        width={width}
        height={displayChildren ? "auto" : "3.5em"}
        children={children}
        onClick={(event) => {
          setDisplayChildren(!displayChildren);
        }}
      >
        {displayChildren ? <></> : <SettingTitle>{title}</SettingTitle>}
        {/* <hr /> */}
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

  border: 2px solid #dfdfdf;
  border-radius: 5px;

  background-color: #f8f8f8;
  box-shadow: 0px 1px 4px 2px rgb(0 0 0 / 7%);

  transition: 150ms ease-out;

  :hover {
    box-shadow: 5px 5px 10px rgb(0 0 0 / 25%);
  }
`;

const SettingTitle = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 16px;

  user-select: none;
`;
