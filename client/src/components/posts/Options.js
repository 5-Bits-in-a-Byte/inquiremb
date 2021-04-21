import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import { Link } from "react-router-dom";

/**
 * Options Component ~ Button side panel for displaying buttons for the user
 *
 * @param {string} courseId given to the "+ New Post" button to route to the Post form page
 */
const Options = ({ courseId }) => {
  return (
    <OptionsWrapper>
      <OptionsHeader>OPTIONS</OptionsHeader>
      <OptionsPanel>
        <Link
          style={{ width: "100%", textDecoration: "none" }}
          to={"/course/" + courseId + "/post/new"}
        >
          <Button primary autoWidth>
            + New Post
          </Button>
        </Link>
      </OptionsPanel>
    </OptionsWrapper>
  );
};

Options.propTypes = {
  courseId: PropTypes.string,
};

export default Options;

const OptionsWrapper = styled.div`
  width: 280px; // Need to make same width as nav + menu bar
  flex-grow: 1;
  position: absolute;
  right: -40px;
  top: 0;
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
  background: #fff;
  width: 220px;
  padding: 14px;
  border-radius: 5px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;
