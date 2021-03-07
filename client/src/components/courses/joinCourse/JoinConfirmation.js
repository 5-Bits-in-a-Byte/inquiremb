import React, { useState } from "react";
import styled from "styled-components";
import ShareImg from "../../../imgs/share-white.svg";
import Button from "../../common/Button";
import Input from "../../common/Input";
import InputLabel from "../../common/InputLabel";
import CopyImg from "../../../imgs/copy.svg";
import axios from "axios";
import CheckMarkBlue from "../../../imgs/checkmark_blue.svg";
import CheckMarkGreen from "../../../imgs/checkmark_green.svg";
// import { ReactComponent as CheckMark } from "../../../imgs/checkmark.svg";
import Errors from "../../common/Errors";
import JoinInfo from "./JoinInfo";

const JoinConfirmation = ({
  course,
  joinCourse,
  display,
  toggleDisplay,
  close,
}) => {
  const [loading, toggleLoading] = useState(false);
  const [errors, toggleErrors] = useState(null);
  const [success, toggleSuccess] = useState(null);

  console.log(display);
  console.log("SUCCESS Message: " + success);

  const confirmJoinRequest = () => {
    toggleLoading(true);
    setTimeout(() => {
      const endpoint = "/api/join";
      const data = {
        course_id: course.course_id,
      };
      axios
        .put(process.env.REACT_APP_SERVER_URL + endpoint, data, {
          withCredentials: true,
        })
        .then((res) => {
          toggleSuccess(res.data.success);
          toggleLoading(false);
          toggleDisplay("none");
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            // Set the errors provided by our API request
            console.log(err.response.data.errors);
            toggleLoading(false);
            toggleErrors(err.response.data.errors);
          } else {
            toggleLoading(false);
            toggleErrors([
              "There was an error joining the course. Please try again.",
            ]);
          }
        });
    }, 1000);
  };

  return (
    <Wrapper className="flex-col align justify">
      <img src={display == "none" ? CheckMarkGreen : CheckMarkBlue}></img>
      <Title className="margin-t20" style={{ display: display }}>
        CONFIRM COURSE
      </Title>
      <Success
        style={display == "none" ? { display: "block" } : { display: display }}
      >
        {success}
      </Success>
      <HighlightedSection className="flex-row" style={{ display: display }}>
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
      <BottomButtons style={{ display: display }}>
        <Button
          secondary
          autoWidth
          style={{ margin: "24px 1em 0 1em" }}
          onClick={() => {
            joinCourse(null);
          }}
        >
          Back
        </Button>
        <Button
          primary
          autoWidth
          onClick={confirmJoinRequest}
          loading={loading}
          style={{ margin: "24px 1em 0 1em" }}
        >
          Confirm
        </Button>
      </BottomButtons>
      <Errors errors={errors} />
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

const Success = styled.div`
  display: none;

  font-size: 30px;
`;
