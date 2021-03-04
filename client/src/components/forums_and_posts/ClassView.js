import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Sidebar from "./Sidebar";
import PostView from "./PostView";
import axios from "axios";

const ClassView = ({ classroomName, setPosts }) => {
  const [section, selectSection] = useState("All Posts");
  console.log(section);

  const [form, setForm] = useState({
    title: null,
    content: null,
    loading: false,
    errors: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendPostRequest = () => {
    setForm({ ...form, loading: true });
    setTimeout(() => {
      const endpoint = "/api/<course_id>/posts";
      const data = {
        title: form.title,
        content: form.content,
      };
      axios
        .post(process.env.REACT_APP_SERVER_URL + endpoint, data, {
          withCredentials: true,
        })
        .then((res) => {
          setPosts(res.data);
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            console.log(err.response.data.errors);
            setForm({
              ...form,
              errors: err.response.data.errors,
              loading: false,
            });
          } else {
            setForm({
              ...form,
              loading: false,
              errors: ["There was an error making the post. Please try again."],
            });
          }
        });
    }, 1000);
  };
  return (
    <ClassViewWrapper>
      <Sidebar
        classroomName={classroomName}
        selectSection={selectSection}
        section={section}
      />

      {/* View of current Post Feed - 
          TODO: should populate based on selected tab */}
      <PostView />
    </ClassViewWrapper>
  );
};

SectionTab.propTypes = {
  ClassroomName: PropTypes.string,
};

export default ClassView;

const ClassViewWrapper = styled.div`
  display: flex;
`;
