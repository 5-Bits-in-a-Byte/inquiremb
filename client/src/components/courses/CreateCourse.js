import React, { useState } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import Input from "../common/Input";
import InputLabel from "../common/InputLabel";
import Modal from "../common/Modal";
import Select from "../common/Select";
import axios from "axios";

const INVITE_OPTIONS = [
  {
    label: "Share Link / Access Code",
    value: "code",
    description:
      "Anyone with the link or access code can join. Share the link / code below with students.",
  },
];

const CreateCourse = () => {
  const [modalIsShown, toggleModal] = useState(false);
  const [form, setForm] = useState({
    university: null,
    course: null,
    canJoinById: true,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const selectUniversity = (option) => {
    setForm({
      ...form,
      university: option.value,
    });
  };

  const sendCourseRequest = () => {
    const endpoint = "/api/courses";
    const data = {
      university: form.university,
      course: form.course,
      canJoinById: form.canJoinById,
    };
    axios
      .post(process.env.REACT_APP_SERVER_URL + endpoint, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
          <h4>CREATE A COURSE</h4>
          <TopSection className="flex-row">
            <LeftColumn className="flex-col flex-1">
              <InputLabel>University Name</InputLabel>
              <Select
                placeholder="Select your university"
                options={[{ label: "test", value: "test" }]}
                onChange={selectUniversity}
              />
            </LeftColumn>
            <RightColumn className="flex-col flex-1">
              <InputLabel>Course Name</InputLabel>
              <Input
                placeholder="ex, CIS 210"
                name="course"
                onChange={handleChange}
              />
            </RightColumn>
          </TopSection>
          <HighlightedSection className="flex-row">
            <LeftColumn className="flex-col flex-1">
              <InputLabel margin="0 0 7px">Student Access</InputLabel>
              <Select
                placeholder={INVITE_OPTIONS[0].label}
                options={INVITE_OPTIONS}
              />
              <InputLabel>Invite Link</InputLabel>
              <Input placeholder="https://superswag.com/Aji3KlmZ" />
            </LeftColumn>
            <RightColumn className="flex-col flex-1">
              <InputLabel margin="0 0 7px">Description</InputLabel>
              <p className="p-small">{INVITE_OPTIONS[0].description}</p>
              <InputLabel>Access Code</InputLabel>
              <Input placeholder="Aji3KlmZ" />
            </RightColumn>
          </HighlightedSection>
          <Button
            primary
            autoWidth
            style={{ marginTop: 24 }}
            onClick={sendCourseRequest}
          >
            + Create Course
          </Button>
        </Modal>
      )}
    </>
  );
};

export default CreateCourse;

const LeftColumn = styled.div`
  margin-right: 5px;
`;

const RightColumn = styled.div`
  margin-left: 5px;
`;

const TopSection = styled.div`
  padding: 0 15px;
`;

const HighlightedSection = styled.div`
  background-color: #f8f8f8;
  margin-top: 15px;
  padding: 15px;
`;
