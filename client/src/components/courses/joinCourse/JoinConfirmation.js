import React from "react";
import styled from "styled-components";
import ShareImg from "../../../imgs/share-white.svg";
import Button from "../../common/Button";
import Input from "../../common/Input";
import InputLabel from "../../common/InputLabel";
import CopyImg from "../../../imgs/copy.svg";
import CheckMark from "../../../imgs/checkmark.svg";
const JoinConfirmation = ({ course, close }) => {
  return (
    <Wrapper className="flex-col align justify">
      {/* <Wrapper> */}
      <img src={CheckMark}></img>
      <Title className="margin-t20" style={{}}>
        CONFIRM COURSE
      </Title>
      <HighlightedSection className="flex-row">
        <CourseInfo>
          <Course>
            <div style={{ opacity: "70%" }}>Course:&nbsp;</div>{" "}
            <TextContent>{course.course}</TextContent>
          </Course>
          <Instructor>
            <div style={{ opacity: "70%" }}>Instructor:&nbsp;</div>
            <TextContent>
              {course.first} {course.last}
            </TextContent>
          </Instructor>
        </CourseInfo>
      </HighlightedSection>
      <BottomButtons>
        <Button secondary autoWidth style={{ margin: "24px 1em 0 1em" }}>
          Back
        </Button>
        <Button
          primary
          autoWidth
          style={{ margin: "24px 1em 0 1em" }}
          onClick={close}
        >
          Confirm
        </Button>
      </BottomButtons>
    </Wrapper>
  );
};

export default JoinConfirmation;

const Wrapper = styled.div``;

const Title = styled.h4`
  font-size: 30px;
`;

const BottomButtons = styled.div`
  display: flex;
  width: 100%;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;

  height: 4em;
`;

const Course = styled.div`
  display: flex;
  flex-direction: row;

  margin: 0.5em 0;
`;

const Instructor = styled.div`
  display: flex;
  flex-direction: row;

  margin: 0.5em 0;
`;

const HighlightedSection = styled.div`
  background-color: #f8f8f8;
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TextContent = styled.div`
  font-weight: 400;
  font-style: normal;
`;
