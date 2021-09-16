import React, { useContext, useState } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import Modal from "../common/Modal";
import CourseConfirmation from "./createCourse/CourseConfirmation";
import CourseInfo from "./createCourse/CourseInfo";
import CourseCard from "./CourseCard";
import { fetchUser } from "../common/externalMethods/FetchUser";
import {
  generateCourseList,
  addNewCourseToList,
} from "../common/externalMethods/CoursesHelperMethods";
import { UserContext, UserDispatchContext } from "../context/UserProvider";

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

  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  return (
    <>
      <CustomButton onClick={() => toggleModal(true)}>
        Create a Course
      </CustomButton>
      {modalIsShown && (
        <Modal
          close={() => {
            setCourseList(generateCourseList(user.courses, setUser));
            toggleModal(false);
          }}
          width="620px"
          data-testid="join-course-modal"
        >
          {!course ? (
            <CourseInfo setCourse={setCourse} setCourseList={setCourseList} />
          ) : (
            <CourseConfirmation
              course={course}
              close={() => {
                // let newCourseList = addNewCourseToList(course, courseList);
                // setCourseList(newCourseList);
                fetchUser(setUser, true);
                setCourseList(generateCourseList(user.courses, setUser));
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

const CustomButton = styled.div`
  cursor: pointer;
  border: none;
  border-radius: 3px;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 9em;
  margin-left: 1em;

  border-radius: 4px;
  padding: 0.5em 0.125em;
  background-color: #e7e7e7;
  color: #162b55;
  &:hover {
    background-color: #dedede;
  }

  transition: 150ms ease-out;

  @media only screen and (min-width: 1201px) {
    width: 10em;
  }
  @media only screen and (max-width: 650px) {
    width: 8em;
    font-size: 14px;
    /* margin-left: 0.5em; */
    /* margin: 0; */
  }
  @media only screen and (max-width: 480px) {
    font-size: 12px;
    width: 8em;
  }
  @media only screen and (max-width: 400px) {
    font-size: 8px;
  }
`;
