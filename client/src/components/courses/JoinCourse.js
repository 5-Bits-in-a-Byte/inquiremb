import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import JoinConfirmation from "./joinCourse/JoinConfirmation";
import JoinInfo from "./joinCourse/JoinInfo";

const JoinCourse = () => {
  const [modalIsShown, toggleModal] = useState(false);
  const [course, joinCourse] = useState(null);

  return (
    <>
      <Button secondary onClick={() => toggleModal(true)}>
        Join a Course
      </Button>
      {modalIsShown && (
        <Modal
          close={() => {
            toggleModal(false);
          }}
          width="420px"
          data-testid="join-course-modal"
        >
          {!course ? (
            <JoinInfo joinCourse={joinCourse} />
          ) : (
            <JoinConfirmation
              course={course}
              close={() => {
                toggleModal(false);
                joinCourse(null);
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default JoinCourse;
