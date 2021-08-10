import React from "react";
import styled from "styled-components";
import SearchImg from "../../imgs/search-gray.svg";
import Icon from "../common/Icon";

/** SearchBar Component
 *
 *
 * @param {function} onChange event handler called when the textfield changes.
 * @param {string} placeholder placeholder text in the search textfield
 * @returns
 */
const SearchBar = ({ onChange, placeholder, displayIcon }) => {
  return (
    <SearchDiv className="secondary-btn flex-row">
      {displayIcon ? (
        <Icon
          src={SearchImg}
          style={{
            height: "16px",
            padding: "0 7px 0 11px",
            borderRight: "1px solid #818181",
          }}
        />
      ) : (
        <></>
      )}
      <TextInput type="text" onChange={onChange} placeholder={placeholder} />
    </SearchDiv>
  );
};

export default SearchBar;

const SearchDiv = styled.div`
  height: 32px;
  align-items: center;
  border-radius: 3px;
  width: 100%;
  max-width: 360px;
  &:focus-within {
    box-shadow: 0 0 0px 0.4px #818181;
  }
`;

const TextInput = styled.input`
  height: 100%;
  border: none;
  background-color: transparent;
  width: 100%;
  padding-left: 11px;
  font-size: 16px;

  &:focus {
    outline: none;
  }

  &::selection {
    background: #81818150; /* WebKit/Blink Browsers */
  }
`;
