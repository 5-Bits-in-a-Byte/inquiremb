import React from "react";
import PropTypes from "prop-types"
import styled from "styled-components";

const SectionTab = (props) => {
  const shouldHighlight = props.selectedTab === true ? HighlightTab : {marginRight: "0em"};
  // TODO: change to use state to render tab as highlighted or not

  return (
    <Tab style={shouldHighlight}>
      <Icon src={props.imageLocation}/>
      <TabText>{props.tabText}</TabText>
    </Tab>
  );
}

SectionTab.propTypes = {
  selectedTab: PropTypes.bool,
  tabText: PropTypes.string,
  imageLocation: PropTypes.string
}

export default SectionTab;

const HighlightTab = {
  borderLeft: "0.3rem solid #4A86FA",
  background: "rgba(76, 134, 250, 0.09)"
}


//#region Tab Stylings
const Tab = styled.div`
  display: flex;

  // border: 1px solid grey;
  width: 80%;
  height: 1.75em;
  margin: 0.25rem 0;

  align-items: center;

  :hover {
    cursor: pointer;
  }
`;

const TabText = styled.h3`
  font-size: 1rem;

  user-select: none;
  transition: 150ms ease-in-out;

  :hover {
    cursor: pointer;
  }
`;

const Icon = styled.img`
  float: left;

  width: 18px;
  height: 18px;
  margin-right: 1em;
  margin-left: 0.75em;

  user-select: none;
`;
//#endregion
