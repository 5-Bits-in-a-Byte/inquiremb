import React, { useState, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { UserContext } from "../context/UserProvider";
import {
  UserRoleContext,
  UserRoleDispatchContext,
} from "../context/UserRoleProvider";
import PropTypes from "prop-types";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Sidebar from "./Sidebar";
import PostView from "./PostView";
import LazyFetch from "../common/requests/LazyFetch";

/**
 * ClassView Component ~ Blueprint for displaying a specific course post feed, as well as
 */
const ClassView = ({ props }) => {
  const urlParams = useParams();

  const location = useLocation();
  let defaultHighlight = "All Posts";

  if (location.state && location.state.filter) {
    defaultHighlight = location.state.filter;
  }

  // UseState Hook to declare state variable "", and setState method to change the variable
  const [highlightedSection, setHighlightedSection] = useState(
    defaultHighlight
  );

  var classroomID = urlParams.courseId;
  var courseContext = useContext(UserContext).courses;

  var classroomName;

  for (var item in courseContext) {
    if (courseContext[item].courseId === classroomID) {
      classroomName = courseContext[item].courseName;
      break;
    }
  }

  const setUserRole = useContext(UserRoleDispatchContext);
  const userRole = useContext(UserRoleContext);

  const attemptGetUserRole = (courseId) => {
    LazyFetch({
      type: "get",
      endpoint: "/api/userRole/" + courseId,
      onSuccess: (role) => {
        if (role) {
          setUserRole(role);
        }
      },
      onFailure: (err) => {
        console.log(
          "Error getting user role object from {" + courseId + "}:",
          err
        );
        setUserRole(false);
      },
    });
  };

  useEffect(() => {
    console.log("rendered");
    if (!userRole) {
      attemptGetUserRole(urlParams.courseId);
    }
  });

  console.log("Role object: ", userRole);

  return (
    <ClassViewWrapper>
      <Sidebar
        userRole={userRole}
        setHighlightedSection={setHighlightedSection}
        highlightedSection={highlightedSection}
      />
      <PostView userRole={userRole} highlightedSection={highlightedSection} />
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
