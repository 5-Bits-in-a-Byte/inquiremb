import React from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const SectionTab = ({
  setHighlightedSection,
  highlightedSection,
  imageLocation,
  tabText,
}) => {
  const { courseId, postid } = useParams();

  return (
    <Tab
      highlight={highlightedSection === tabText}
      onClick={() => {
        setHighlightedSection(tabText);
      }}
    >
      {/* <Link to={"/course/" + courseId} style={{ textDecoration: "none" }}> */}
      <Icon src={imageLocation} />
      <TabText>{tabText}</TabText>
      {/* </Link> */}
    </Tab>
  );
};

SectionTab.propTypes = {
  section: PropTypes.string,
  tabText: PropTypes.string,
  imageLocation: PropTypes.string,
};

export default SectionTab;

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

  ${(props) =>
    props.highlight &&
    css`
      border-left: 0.3rem solid #4a86fa;
      background: rgba(76, 134, 250, 0.09);
    `}
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
