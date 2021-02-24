import React, { useState } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import Modal from "../common/Modal";
import CourseConfirmation from "./createCourse/CourseConfirmation";
import CourseInfo from "./createCourse/CourseInfo";

const CreateCourse = () => {
  const [modalIsShown, toggleModal] = useState(false);
  // Course is set by the CourseInfo component when instructors create the course
  // The info is used to share the course link/access code provided by the API
  const [course, setCourse] = useState(null);

  return (
    <>
      <Button
        secondary
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

const AnimationSlider = styled.div``;
