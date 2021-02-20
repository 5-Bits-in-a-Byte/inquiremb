import React, { useState } from "react";
import styled, { css } from "styled-components";
import ClickAway from "./ClickAway";
import DropdownOption from "./DropdownOption";

const Dropdown = (props) => {
  const [open, toggle] = useState(false);
  return (
    <ClickAway
      style={{ display: "inline-block", height: "fit-content" }}
      onClick={() => toggle(!open)}
      onClickAway={() => toggle(false)}
      closeCallback={props.closeCallback}
      contents={
        <>
          <Wrapper>
            {props.children}
            {props.options && open && (
              <Options {...props} open={open}>
                {props.options.map((option, index) => (
                  <DropdownOption
                    onClick={option.onClick}
                    key={option.key || index}
                  >
                    {option.label}
                  </DropdownOption>
                ))}
              </Options>
            )}
            {props.content && open && props.content}
          </Wrapper>
        </>
      }
    />
  );
};

export default Dropdown;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Options = styled.div`
  display: none;
  position: absolute;
  overflow: hidden;
  height: 0;
  top: 115%;
  ${(props) =>
    props.right
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `};
  min-width: 100%;
  z-index: 10;

  ${(props) =>
    props.open &&
    css`
      display: block;
      background: white;
      border-radius: 4px;
      padding: 5px 0;
      height: auto;
      box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.32);
    `}
`;
