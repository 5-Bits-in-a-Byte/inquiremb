import React, { useState, useContext } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import CheckMarkBlue from "../../../imgs/checkmark_blue.svg";
import CheckMarkGreen from "../../../imgs/checkmark_green.svg";
import Errors from "../../common/Errors";
import CourseCard from "../CourseCard";
import { UserContext, UserDispatchContext } from "../../context/UserProvider";
import LazyFetch from "../../common/requests/LazyFetch";
import CoursePanel from "./CoursePanel";

const AddNewCourseToList = (newCourse, courseList) => {
  if (newCourse === null) return;
  // console.log("Course to add: ", newCourse);
  // console.log("Example from list: ", courseList[0]);
  // console.log("Before: ", "\nCourseList: ", courseList);

  let ret = [];
  for (let i = 0; i < courseList.length; i++) {
    // console.log(courseList[i]);
    ret.push(
      <CourseCard
        key={courseList[i].props.id}
        id={courseList[i].props.id}
        courseName={courseList[i].props.courseName}
        courseTerm="Winter 2021"
        color={courseList[i].props.color || "#121212"}
      />
    );
  }

  ret.push(
    <CourseCard
      key={newCourse.courseId}
      id={newCourse.courseId}
      courseName={newCourse.courseName}
      courseTerm="Winter 2021"
      color={newCourse.color || "#121212"}
    />
  );

  // console.log("After: ", "\nCourseList: ", ret);
  return ret;
};

const GenerateCoursesList = (courses, selectedCourse, setSelectedCourse) => {
  // const [selectedCourse, setSelectedCourse] = useState(null);
  return courses.map((course, index) => (
    <CoursePanel
      key={index}
      courseId={course.courseId}
      courseName={course.course}
      instructorName={course.first + " " + course.last}
      selectedCourse={selectedCourse}
      setSelectedCourse={setSelectedCourse}
    />
  ));
};

const JoinConfirmation = ({
  courses,
  joinCourse,
  display,
  toggleDisplay,
  courseList,
  setCourseList,
}) => {
  console.log("courseList:", courseList);
  const [loading, toggleLoading] = useState(false);
  const [errors, toggleErrors] = useState(null);
  const [success, toggleSuccess] = useState(null);
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  console.log(display);
  console.log("SUCCESS Message: " + success);

  const confirmJoinRequest = () => {
    toggleLoading(true);
    setTimeout(() => {
      LazyFetch({
        type: "put",
        endpoint: "/join",
        data: { courseId: selectedCourse },
        onSuccess: (data) => {
          console.log("RESPONSE LENGTH:", data.length);
          let newCourseList = AddNewCourseToList(data.course, courseList);
          if (newCourseList != null) setCourseList(newCourseList);
          joinCourse(data.course);

          // have to update the user model in order to correct get the course page
          let temp = user;
          temp.courses.push(data.course);
          setUser(temp);

          toggleSuccess(data.success);
          toggleLoading(false);
          toggleDisplay("none");
        },
        onFailure: (err) => {
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
        },
      });
    }, 1000);
  };

  const [selectedCourse, setSelectedCourse] = useState(null);

  // Only call GenerateCoursesList if the return value is an array
  let potentialCourses = courses.length
    ? GenerateCoursesList(courses, selectedCourse, setSelectedCourse)
    : null;

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
          {potentialCourses}
          {/* <Course>
            <div style={{ opacity: "70%" }}>Course:&nbsp;</div>
            <TextContent>{courses.course}</TextContent>
          </Course>
          <Instructor>
            <div style={{ opacity: "70%" }}>Instructor:&nbsp;</div>
            <TextContent>
              {courses.first} {courses.last}
            </TextContent>
          </Instructor> */}
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
          onClick={() => {
            confirmJoinRequest();
          }}
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
  overflow: auto;
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
