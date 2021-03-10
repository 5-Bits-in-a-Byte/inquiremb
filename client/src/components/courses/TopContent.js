import React from "react";
import styled from "styled-components";
import JoinCourse from "./JoinCourse";
import CreateCourse from "./CreateCourse";

const TopContent = (nestedState, nestedSetter) => {
  return (
    <TopWrapper className="flex-row align">
      <Title>COURSES</Title>
      <JoinCourse nestedState={nestedState} nestedSetter={nestedSetter} />
      <CreateCourse nestedState={nestedState} nestedSetter={nestedSetter} />
    </TopWrapper>
  );
};

export default TopContent;

const Title = styled.h3`
  margin-right: 15px;
`;

const TopWrapper = styled.div`
  margin: 1em 1em 1em 1em;
`;
