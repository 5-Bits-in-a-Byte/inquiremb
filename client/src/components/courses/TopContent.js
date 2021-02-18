import React from "react";
import styled from "styled-components";
import Button from "../common/Button";

const TopContent = () => {
  return (
    <div className="flex-row align">
      <Title>COURSES</Title>
      <Button secondary>Join a Course</Button>
    </div>
  );
};

export default TopContent;

const Title = styled.h4`
  margin-right: 15px;
`;
