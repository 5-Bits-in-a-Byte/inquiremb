import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components";

const OptionsButton = (props) => {
  if (!props.isPrimary)
  {
    return (
      <SecondaryButtonWrapper>
        <SecondaryButtonText>{props.buttonText}</SecondaryButtonText>
      </SecondaryButtonWrapper>
    )
  }

  else
  {
    return (
      <PrimaryButtonWrapper>
        <PrimaryButtonText>{props.buttonText}</PrimaryButtonText>
      </PrimaryButtonWrapper>
    )
  }
}

OptionsButton.propTypes = {
  buttonText: PropTypes.string,
  isPrimary: PropTypes.bool
}

export default OptionsButton;

//#region Options Button
const PrimaryButtonWrapper = styled.div`
  width: 80%;
  height: 36px;
  margin: 5px 0;

  border-radius: 3px;

  background-color: #4A86FA;

  text-align: center;
  line-height: 36px;

  user-select: none;
  transition: 100ms ease-in-out;

  :hover {
    cursor: pointer;

    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.07);

    transform: translateY(-2px);
  }

  :active {
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.07);

    transform: translateY(0px);
  }
`;

const PrimaryButtonText = styled.h2`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;

  color: #fff;
`;

const SecondaryButtonWrapper = styled.div`
  width: 80%;
  height: 36px;
  margin: 5px 0;

  border: 1px solid #4A86FA;
  border-radius: 3px;

  // background-color: #4A86FA;

  text-align: center;
  line-height: 36px;

  user-select: none;
  transition: 100ms ease-in-out;

  :hover {
    cursor: pointer;

    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.07);

    transform: translateY(-2px);
  }

  :active {
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.07);

    transform: translateY(0px);
  }
`;

const SecondaryButtonText = styled.h2`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;

  color: #4A86FA;
`;
//#endregion
