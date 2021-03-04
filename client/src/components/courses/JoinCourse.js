import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import InputLabel from "../common/InputLabel";
import Modal from "../common/Modal";

const JoinCourse = () => {
  const [modalIsShown, toggleModal] = useState(false);
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
          <h3>SEARCH FOR A COURSE</h3>
          <InputLabel>University</InputLabel>
          <Input placeholder="University Name" />
          <InputLabel>Course Name</InputLabel>
          <Input placeholder="ex, CIS 210" />
          <h3 style={{ marginTop: 30 }}>OR JOIN BY ACCESS CODE</h3>
          <InputLabel>Access Code</InputLabel>
          <Input placeholder="ex, AcK21k" />
          <Button primary autoWidth style={{ marginTop: 24 }}>
            + Join Course
          </Button>
        </Modal>
      )}
    </>
  );
};

export default JoinCourse;
