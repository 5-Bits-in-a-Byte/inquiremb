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
    <div className="flex-col align justify">
      <img src={CheckMark}></img>
      <h4 className="margin-t20" style={{}}>
        CONFIRM COURSE
      </h4>
      <HighlightedSection className="flex-row">
        <CourseInfo>
          <Course>
            <div style={{ opacity: "70%" }}>Course:&nbsp;</div>{" "}
            <div>{course.course}</div>
          </Course>
          <Instructor>
            <div style={{ opacity: "70%" }}>Instructor:&nbsp;</div>
            <div>
              {course.first} {course.last}
            </div>
          </Instructor>
        </CourseInfo>
      </HighlightedSection>
      <BottomButtons>
        <Button secondary autoWidth style={{ marginTop: 24 }}>
          Back
        </Button>
        <Button primary autoWidth style={{ marginTop: 24 }} onClick={close}>
          Confirm
        </Button>
      </BottomButtons>
    </div>
  );
};

export default JoinConfirmation;

const BottomButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Course = styled.div`
  display: flex;
  flex-direction: row;
`;

const Instructor = styled.div`
  display: flex;
  flex-direction: row;
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
