import React from "react";
import styled from "styled-components";
import Button from "../common/Button";
import Input from "../common/Input";
import InputLabel from "../common/InputLabel";
import Modal from "../common/Modal";

const JoinCourse = ({ close }) => {
  return (
    <Modal close={close} width="420px" data-testid="join-course-modal">
      <h4>SEARCH FOR A COURSE</h4>
      <InputLabel>University</InputLabel>
      <Input placeholder="University Name" />
      <InputLabel>Course Name</InputLabel>
      <Input placeholder="ex, CIS 210" />
      <h4 style={{ marginTop: 30 }}>OR JOIN BY ACCESS CODE</h4>
      <InputLabel>Access Code</InputLabel>
      <Input placeholder="ex, AcK21k" />
      <Button primary autoWidth style={{ marginTop: 24 }}>
        + Join Course
      </Button>
    </Modal>
  );
};

export default JoinCourse;
