import React, { useState, useContext } from "react";
import Select from "../../common/Select";
import Button from "../../common/Button";
import Input from "../../common/Input";
import InputLabel from "../../common/InputLabel";
import styled from "styled-components";
import Errors from "../../common/Errors";
import { UserContext, UserDispatchContext } from "../../context/UserProvider";
import LazyFetch from "../../common/requests/LazyFetch";
import { fetchUser } from "../../common/externalMethods/FetchUser";
import { generateCourseList } from "../../common/externalMethods/CoursesHelperMethods";
import { ColorContext } from "../../context/ColorModeContext";

const INVITE_OPTIONS = [
  {
    label: "Share Link / Access Code",
    value: "code",
    description:
      "Anyone with the link or access code can join. Create the course to generate a link.",
  },
];

const CourseInfo = ({ setCourse, setCourseList }) => {
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);
  const [form, setForm] = useState({
    course: null,
    canJoinById: true,
    loading: false,
    errors: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendCourseRequest = () => {
    setForm({ ...form, loading: true });
    setTimeout(() => {
      LazyFetch({
        type: "post",
        endpoint: "/courses",
        data: { course: form.course, canJoinById: form.canJoinById },
        onSuccess: (data) => {
          fetchUser(setUser, true);
          setCourseList(generateCourseList(user.courses, setUser));
          setCourse(data);
        },
        onFailure: (err) => {
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
                "There was an error creating the course. Please try again.",
              ],
            });
          }
        },
      });
    }, 1000);
  };

  const theme = useContext(ColorContext);

  return (
    <>
      <h3 style={{ marginLeft: 15, color: `${theme.logoFontColor}` }}>
        CREATE A COURSE
      </h3>
      <TopSection className="flex-row">
        <LeftColumn className="flex-col flex-1">
          <InputLabel style={{ color: `${theme.logoFontColor}` }}>
            Course Name
          </InputLabel>
          <Input
            style={{
              backgroundColor: `${theme.background}`,
              color: `${theme.logoFontColor}`,
            }}
            placeholder="ex, CIS 210"
            name="course"
            onChange={handleChange}
          />
        </LeftColumn>
        <RightColumn className="flex-col"></RightColumn>
      </TopSection>
      <HighlightedSection className="flex-row" theme={theme}>
        <LeftColumn className="flex-col flex-1">
          <InputLabel margin="0 0 7px">Student Access</InputLabel>
          <Select
            themeValue={theme}
            defaultValue={INVITE_OPTIONS[0]}
            options={INVITE_OPTIONS}
          />
        </LeftColumn>
        <RightColumn className="flex-col flex-1">
          <InputLabel margin="0 0 7px">Description</InputLabel>
          <p className="p-small" style={{ color: `${theme.logoFontColor}` }}>
            {INVITE_OPTIONS[0].description}
          </p>
        </RightColumn>
      </HighlightedSection>
      <Button
        primary
        autoWidth
        loading={form.loading}
        style={{
          marginTop: 24,
          backgroundColor: `${theme.blueToLightGreyButton}`,
        }}
        onClick={sendCourseRequest}
      >
        + Create Course
      </Button>
      <Errors errors={form.errors} />
    </>
  );
};

export default CourseInfo;

const LeftColumn = styled.div`
  margin-right: 7px;
`;

const RightColumn = styled.div`
  margin-left: 7px;
`;

const TopSection = styled.div`
  padding: 0 15px;
`;

const HighlightedSection = styled.div`
  background-color: ${(props) => props.theme.header};
  margin-top: 15px;
  padding: 15px;
`;
