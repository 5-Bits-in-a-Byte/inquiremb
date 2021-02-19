import React, { useState } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import JoinCourse from "./JoinCourse";

const TopContent = () => {
  const [joinCourseIsShown, toggleJoin] = useState(false);

  return (
    <div className="flex-row align">
      <Title>COURSES</Title>
      <Button secondary onClick={() => toggleJoin(true)}>
        Join a Course
      </Button>
      {joinCourseIsShown && (
        <JoinCourse
          close={() => {
            toggleJoin(false);
          }}
        />
      )}
    </div>
  );
};

export default TopContent;

const Title = styled.h4`
  margin-right: 15px;
`;
