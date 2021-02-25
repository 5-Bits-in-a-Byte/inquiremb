import React from 'react';
import PropTypes from 'prop-types';
import OptionsButton from "./OptionsButton"
import styled from "styled-components";

const Options = props => {
    return (
      <OptionsWrapper>
        <OptionsHeader>OPTIONS</OptionsHeader>
        <OptionsPanel>
          <OptionsButton buttonText={"+ New Post"} isPrimary={true} />
          <OptionsButton
            buttonText={"Message Instructor"}
            isPrimary={false}
          />
          <OptionsButton buttonText={"Do a thing"} isPrimary={false} />
          <OptionsButton buttonText={"Do another thing"} isPrimary={false} />
        </OptionsPanel>
      </OptionsWrapper>
    );
};

Options.propTypes = {
    
};

export default Options;

//#region Options Stylings
const OptionsWrapper = styled.div`
  // border: 1px solid green;
  width: 25%;
`;

const OptionsHeader = styled.h1`
  margin: 3em 0 2em 0;

  font-size: 14px;
`;

const OptionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 220px;
  height: 240px;

  // border: 1px solid black;
  border-radius: 5px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;
//#endregion
