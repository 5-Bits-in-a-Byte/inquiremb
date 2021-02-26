import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Sidebar from "./Sidebar";
import PostView from "./PostView";

const ClassView = ({ classroomName }) => {
  const [section, selectSection] = useState("All Posts");
  console.log(section);
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
  height: 100%;
`;
