import React, { useState } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import Modal from "../common/Modal";
import CourseConfirmation from "./createCourse/CourseConfirmation";
import CourseInfo from "./createCourse/CourseInfo";
import CourseCard from "./CourseCard";

/** addNewCourseToList (object, list)
 * @brief takes the new course info from the newCourse object and creates a course to append onto the courseList React State
 *
 * @param {object} newCourse object containing information needed to make a new course card
 * @param {list} courseList the react state list containing all of the React CourseCards
 * @returns new list of courseCards to be updated in React State
 */
const addNewCourseToList = (newCourse, courseList) => {
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

/** CreateCourse
 * @brief Overlay with modal background that allows the user to create a new course.
 *
 * @param {list} courseList React state variable containing list of CourseCards
 * @param {function} setCourseList Method to update the courseList React State variable
 * @returns CreateCourse component
 */
const CreateCourse = ({ courseList, setCourseList }) => {
  const [modalIsShown, toggleModal] = useState(false);
  // Course is set by the CourseInfo component when instructors create the course
  // The info is used to share the course link/access code provided by the API
  const [course, setCourse] = useState(null);

  return (
    <>
      <Button
        secondary={true}
        style={{ marginLeft: 10 }}
        onClick={() => {
          toggleModal(true);
        }}
      >
        Create a Course
      </Button>
      {modalIsShown && (
        <Modal
          close={() => {
            toggleModal(false);
          }}
          width="620px"
          data-testid="join-course-modal"
        >
          {!course ? (
            <CourseInfo setCourse={setCourse} />
          ) : (
            <CourseConfirmation
              course={course}
              close={() => {
                let newCourseList = addNewCourseToList(course, courseList);
                setCourseList(newCourseList);
                toggleModal(false);
                setCourse(null);
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default CreateCourse;
