import React from "react";
import styled from "styled-components";
import SearchImg from "../../imgs/search-gray.svg";

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
  height: 26px;
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
  padding: 0 11px;
  border-right: 1px solid #818181;
`;

const TextInput = styled.input`
  height: 100%;
  border: none;
  background-color: transparent;
  width: 100%;
  padding-left: 11px;

  &:focus {
    outline: none;
  }

  &::selection {
    background: #81818150; /* WebKit/Blink Browsers */
  }
`;
