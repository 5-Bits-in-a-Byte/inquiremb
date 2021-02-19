import React from "react";
import styled from "styled-components";
import Button from "../common/Button";
import Input from "../common/Input";
import InputLabel from "../common/InputLabel";
import Modal from "../common/Modal";

const JoinCourse = ({ close }) => {
  return (
    <Modal close={close} width="420px">
      <h4>JOIN BY ACCESS CODE</h4>
      <InputLabel>Access Code</InputLabel>
      <Input placeholder="ex, AcK21k" />
      <Button primary autoWidth style={{ marginTop: 14 }}>
        + Join Course
      </Button>
    </Modal>
  );
};

export default JoinCourse;
