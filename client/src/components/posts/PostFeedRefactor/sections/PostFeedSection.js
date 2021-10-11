import React from "react";
import styled, { css } from "styled-components";

const PostFeedSection = ({ debug, ...props }) => {
  return (
    <>
      <Wrapper debug></Wrapper>
    </>
  );
};

export default PostFeedSection;

const Wrapper = styled.div`
  ${({ debug }) =>
    debug &&
    css`
      border: 1px solid green;
    `};

  height: 32px;
  margin: 1em;
  padding: 1em;
`;
