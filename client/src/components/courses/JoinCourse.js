import React, { useState } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import Modal from "../common/Modal";
import JoinConfirmation from "./joinCourse/JoinConfirmation";
import JoinInfo from "./joinCourse/JoinInfo";

/** JoinCourse
 * @brief Overlay with modal background that allows the user to join a created course.
 *
 * @param {list} courseList React state variable containing list of CourseCards
 * @param {function} setCourseList Method to update the courseList React State variable
 * @returns JoinCourse component
 */
const JoinCourse = ({ courseList, setCourseList }) => {
  const [modalIsShown, toggleModal] = useState(false);
  const [courses, joinCourse] = useState(null);
  const [display, toggleDisplay] = useState("flex");

  return (
    <>
      <CustomButton onClick={() => toggleModal(true)}>
        Join a Course
      </CustomButton>
      {modalIsShown && (
        <Modal
          close={() => {
            toggleModal(false);
            toggleDisplay("flex");
            joinCourse(null);
          }}
          width={"724px"}
          data-testid={"join-course-modal"}
        >
          {!courses ? (
            <JoinInfo joinCourse={joinCourse} />
          ) : (
            <JoinConfirmation
              courses={courses}
              joinCourse={joinCourse}
              display={display}
              toggleDisplay={toggleDisplay}
              courseList={courseList}
              setCourseList={setCourseList}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default JoinCourse;

const CustomButton = styled.div`
  cursor: pointer;
  border: none;
  border-radius: 3px;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 9em;

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
    font-size: 14px;
    width: 8em;
  }
  @media only screen and (max-width: 480px) {
    font-size: 12px;
    width: 7em;
  }
`;
