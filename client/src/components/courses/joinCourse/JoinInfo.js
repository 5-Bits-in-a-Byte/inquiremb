import React, { useState } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import InputLabel from "../../common/InputLabel";
import axios from "axios";
import Errors from "../../common/Errors";

const JoinCourse = ({ joinCourse }) => {
  const [disabledCourse, toggleDisabledCourse] = useState(false);
  const [disabledAccess, toggleDisabledAccess] = useState(false);

  const [form, setForm] = useState({
    courseName: null,
    accessCode: null,
    loading: false,
    errors: null,
  });

  const handleChange = (e) => {
    if (e.target.name == "courseName" && e.target.value != "") {
      toggleDisabledAccess(true);
    } else if (e.target.name == "courseName" && e.target.value == "") {
      toggleDisabledAccess(false);
    } else if (e.target.name == "accessCode" && e.target.value != "") {
      toggleDisabledCourse(true);
    } else {
      toggleDisabledCourse(false);
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendJoinRequest = () => {
    setForm({ ...form, loading: true });
    setTimeout(() => {
      const endpoint = "/api/join";
      const data = {
        courseName: form.courseName,
        accessCode: form.accessCode,
      };
      // TODO: maybe change this to a put request? depends how it looks in backend
      axios
        .post(process.env.REACT_APP_SERVER_URL + endpoint, data, {
          withCredentials: true,
        })
        .then((res) => {
          joinCourse(res.data);
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            // Set the errors provided by our API request
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
              errors: [
                "There was an error joining the course. Please try again.",
              ],
            });
          }
        });
    }, 1000);
  };
  return (
    <>
      <h3>SEARCH FOR A COURSE</h3>
      <InputLabel>Course Name</InputLabel>
      <Input
        placeholder="ex, CIS 210"
        name="courseName"
        disabled={disabledCourse}
        style={disabledCourse ? { opacity: "50%" } : { opacity: "100%" }}
        onChange={handleChange}
      />
      <h3 style={{ marginTop: 30 }}>OR JOIN BY ACCESS CODE</h3>
      <InputLabel>Access Code</InputLabel>
      <Input
        placeholder="ex, AcK21k"
        name="accessCode"
        disabled={disabledAccess}
        style={disabledAccess ? { opacity: "50%" } : { opacity: "100%" }}
        onChange={handleChange}
      />
      <Button
        primary
        autoWidth
        loading={form.loading}
        style={{ marginTop: 24 }}
        onClick={sendJoinRequest}
      >
        + Join Course
      </Button>
      <Errors errors={form.errors} />
    </>
  );
};

export default JoinCourse;
