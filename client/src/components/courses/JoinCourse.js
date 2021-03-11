import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import JoinConfirmation from "./joinCourse/JoinConfirmation";
import JoinInfo from "./joinCourse/JoinInfo";
import CourseCard from "./CourseCard";

const AddNewCourseToList = (newCourse, courseList) => {
  console.log("Course to add: ", newCourse);
  console.log("Example from list: ", courseList[0]);
  console.log("Before: ", "\nCourseList: ", courseList);

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
      key={newCourse.course_id}
      id={newCourse.course_id}
      courseName={newCourse.course_name}
      courseTerm="Winter 2021"
      color={newCourse.color || "#121212"}
    />
  );

  console.log("After: ", "\nCourseList: ", ret);
  return ret;
};

const JoinCourse = ({ courseList, setCourseList }) => {
  const [modalIsShown, toggleModal] = useState(false);
  const [course, joinCourse] = useState(null);
  const [display, toggleDisplay] = useState("flex");

  return (
    <>
      <Button secondary onClick={() => toggleModal(true)}>
        Join a Course
      </Button>
      {modalIsShown && (
        <Modal
          close={() => {
            console.log(course);
            let newCourseList = AddNewCourseToList(course, courseList);
            setCourseList(newCourseList);
            toggleModal(false);
            toggleDisplay("flex");
          }}
          width="724px"
          data-testid="join-course-modal"
        >
          {!course ? (
            <JoinInfo joinCourse={joinCourse} />
          ) : (
            <JoinConfirmation
              course={course}
              joinCourse={joinCourse}
              display={display}
              toggleDisplay={toggleDisplay}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default JoinCourse;
