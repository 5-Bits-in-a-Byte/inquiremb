import React from "react";
import styled, { css } from "styled-components";

import SidebarSection from "./sections/SidebarSection";
import PostFeedSection from "./sections/PostFeedSection";

const CourseView = ({ debug, ...props }) => {
  return (
    <>
      <ClassViewWrapper debug>
        <ScrollingDiv>
          <Wrapper>
            <SidebarSection />
            <PostFeedSection />
          </Wrapper>
        </ScrollingDiv>
      </ClassViewWrapper>
    </>
  );
};

export default CourseView;

const ClassViewWrapper = styled.div`
  ${({ debug }) =>
    debug &&
    css`
      border: 1px solid red;
    `};

  position: relative;
  height: calc(100vh - 66px);
  /* padding: 1em; */
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
