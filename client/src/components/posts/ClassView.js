import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import Sidebar from "./Sidebar";
import PostView from "./PostView";

const ClassView = ({ classroomName }) => {
  // UseState Hook to declare state variable "", and setState method to change the variable
  const [highlightedSection, setHighlightedSection] = useState("All Posts");
  // console.log(hightlightedSection)

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
