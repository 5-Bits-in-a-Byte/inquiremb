import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserProvider";
import socketIOClient from "socket.io-client";
import PropTypes from "prop-types";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Sidebar from "./Sidebar";
import PostView from "./PostView";
import { useLocation, useParams } from "react-router";

const ClassView = ({ classroomName }) => {
  const location = useLocation();
  let defaultHighlight = "All Posts";
  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_SERVER_URL);
    // socket.emit("blah", { test: "testing" });
    socket.on("test", (data) => {
      console.log("test");
      console.log(data);
    });
  }, []);

  if (location.state && location.state.filter) {
    defaultHighlight = location.state.filter;
  }

  // UseState Hook to declare state variable "", and setState method to change the variable
  const [highlightedSection, setHighlightedSection] = useState(
    defaultHighlight
  );
  // console.log(hightlightedSection)
  const { postid } = useParams();

  var classroomID = useParams().courseid;

  var courseContext = useContext(UserContext).courses;

  var temp;

  for (temp in courseContext) {
    console.log(courseContext[temp].course_id);
    console.log(courseContext[temp].course_name);
    if (courseContext[temp].course_id === classroomID) {
      classroomName = courseContext[temp].course_name;
      break;
    }
  }

  return (
    <ClassViewWrapper>
      <Sidebar
        classroomName={classroomName}
        setHighlightedSection={setHighlightedSection}
        highlightedSection={highlightedSection}
      />
      <PostView highlightedSection={highlightedSection} />
    </ClassViewWrapper>
  );
};

SectionTab.propTypes = {
  ClassroomName: PropTypes.string,
};

export default ClassView;

const ClassViewWrapper = styled.div`
  display: flex;
  height: 100%;
`;
