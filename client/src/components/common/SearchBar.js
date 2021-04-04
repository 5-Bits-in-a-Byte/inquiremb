import React from "react";
import styled from "styled-components";
import SearchImg from "../../imgs/search-gray.svg";

/** SearchBar Component
 *
 *
 * @param {function} onChange event handler called when the textfield changes.
 * @param {string} placeholder placeholder text in the search textfield
 * @returns
 */
const SearchBar = ({ onChange, placeholder }) => {
  return (
    <SearchDiv className="secondary-btn flex-row">
      <Icon src={SearchImg} />
      <TextInput type="text" onChange={onChange} placeholder={placeholder} />
    </SearchDiv>
  );
};

export default SearchBar;

const SearchDiv = styled.div`
  height: 32px;
  align-items: center;
  border-radius: 3px;
  max-width: 360px;
  margin: auto;
  &:focus-within {
    box-shadow: 0 0 0px 0.4px #818181;
  }
`;

const Icon = styled.img`
  height: 16px;
  padding: 0 7px 0 11px;
  border-right: 1px solid #818181;
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
