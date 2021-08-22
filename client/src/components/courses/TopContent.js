import React from "react";
import styled from "styled-components";
import JoinCourse from "./JoinCourse";
import CreateCourse from "./CreateCourse";
import InquireTooltip from "../common/InquireTooltip";

/** TopContent
 * @brief Wrapper for the Create Course and Join Course buttons.
 *
 * @param {list} courseList React state list of CourseCards
 * @param {function} setCourseList Method to update the courseList React State variable
 * @returns Wrapper containing the Create / Join Course buttons
 */
const TopContent = ({ courseList, setCourseList }) => {
  return (
    <TopWrapper className="flex-row align">
      <Title>COURSES</Title>
      <InquireTooltip tooltipText={"Open join course modal."} hoverDelay={250}>
        <JoinCourse courseList={courseList} setCourseList={setCourseList} />
      </InquireTooltip>
      <InquireTooltip
        tooltipText={"Open create course modal."}
        hoverDelay={250}
      >
        <CreateCourse courseList={courseList} setCourseList={setCourseList} />
      </InquireTooltip>
    </TopWrapper>
  );
};

export default TopContent;

const Title = styled.h3`
  margin-right: 15px;
`;

const TopWrapper = styled.div`
  margin: 1em 1em 1em 1em;
`;
