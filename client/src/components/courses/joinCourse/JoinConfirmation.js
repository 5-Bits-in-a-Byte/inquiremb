import React, { useState } from "react";
import styled from "styled-components";
import ShareImg from "../../../imgs/share-white.svg";
import Button from "../../common/Button";
import Input from "../../common/Input";
import InputLabel from "../../common/InputLabel";
import CopyImg from "../../../imgs/copy.svg";
import axios from "axios";
import CheckMark from "../../../imgs/checkmark.svg";
import Errors from "../../common/Errors";
import JoinInfo from "./JoinInfo";

const JoinConfirmation = ({ course, close }) => {
  const [back, toggleBack] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [errors, toggleErrors] = useState(null);
  const [success, toggleSuccess] = useState(null);

  const goBack = () => {
    toggleBack(true);
  };

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
          toggleSuccess(res.data);
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
        <Button secondary autoWidth style={{ marginTop: 24 }} onClick={goBack}>
          Back
        </Button>
        <Button
          primary
          autoWidth
          style={{ marginTop: 24 }}
          onClick={confirmJoinRequest}
          loading={loading}
        >
          Confirm
        </Button>
      </BottomButtons>
      <Errors errors={errors} />
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
