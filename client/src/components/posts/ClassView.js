import React, { useState, useContext } from "react";
import { useLocation, useParams } from "react-router";
import { UserContext } from "../context/UserProvider";
import PropTypes from "prop-types";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Sidebar from "./Sidebar";
import PostView from "./PostView";

/**
 * ClassView Component ~ Blueprint for displaying a specific course post feed, as well as
 */
const ClassView = () => {
  const location = useLocation();
  let defaultHighlight = "All Posts";

  if (location.state && location.state.filter) {
    defaultHighlight = location.state.filter;
  }

  // UseState Hook to declare state variable "", and setState method to change the variable
  const [highlightedSection, setHighlightedSection] = useState(
    defaultHighlight
  );

  var classroomID = useParams().courseId;
  var courseContext = useContext(UserContext).courses;

  // console.log("Course Context", courseContext);

  var classroomName;

  for (var item in courseContext) {
    if (courseContext[item].courseId === classroomID) {
      classroomName = courseContext[item].courseName;
      break;
    }
  }

  return (
    <ClassViewWrapper>
      <Sidebar
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
