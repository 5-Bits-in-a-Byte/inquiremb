import React, { useState, useEffect, useContext, useParams } from "react";
import styled, { css } from "styled-components";
import Options from "../Options";
import OptionsPanel from "./OptionsPanel";
import PostWrapper from "./PostWrapper";

const PostRefactor = ({ userRole, highlightedSection, ...props }) => {
  return (
    <>
      <FlexWrapper>
        <Wrapper>
          <PostFeedWrapper>
            <PostWrapper />
            <PostWrapper />
            <PostWrapper />
            <PostWrapper />
          </PostFeedWrapper>
          <OptionsPanel userRole={false} />
        </Wrapper>
        <OverflowCounter offsetAmount={"2.5rem"} />
      </FlexWrapper>
    </>
  );
};

export default PostRefactor;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;

  /* border: 1px solid orange; */
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 100%;
  height: 100%;
  overflow: auto;

  /* border: 1px solid green; */
`;

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
const OverflowCounter = styled.div`
  width: 100%;
  ${(props) =>
    props.offsetAmount &&
    css`
      padding: ${props.offsetAmount};
    `}/* border: 3px solid black; */
`;

const PostFeedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1200px;
  padding: 1rem;
  /* border: 1px solid green; */
`;
