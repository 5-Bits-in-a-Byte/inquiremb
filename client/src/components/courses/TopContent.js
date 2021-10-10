import React from "react";
import styled from "styled-components";
import JoinCourse from "./JoinCourse";
import CreateCourse from "./CreateCourse";
import InquireTooltip from "../common/InquireTooltip";
import { useContext } from "react";
import { ColorContext } from "../context/ColorModeContext";

/** TopContent
 * @brief Wrapper for the Create Course and Join Course buttons.
 *
 * @param {list} courseList React state list of CourseCards
 * @param {function} setCourseList Method to update the courseList React State variable
 * @returns Wrapper containing the Create / Join Course buttons
 */
const TopContent = ({ courseList, setCourseList }) => {
  const theme = useContext(ColorContext);

  return (
    <TopWrapper className="flex-row align">
      <Title theme={theme}>COURSES</Title>
      <FlexWrapper>
        {/* <InquireTooltip
          tooltipText={"Open join course modal."}
          hoverDelay={250}
          customPosition={{
            top: `100%`,
            right: `auto`,
            bottom: `auto`,
            left: `-50%`,
          }}
        > */}
        <JoinCourse courseList={courseList} setCourseList={setCourseList} />
        {/* </InquireTooltip> */}
        {/* <InquireTooltip
          tooltipText={"Open create course modal."}
          hoverDelay={250}
          customPosition={{
            top: `100%`,
            right: `auto`,
            bottom: `auto`,
            left: `-30%`,
          }}
        > */}
        <CreateCourse courseList={courseList} setCourseList={setCourseList} />
        {/* </InquireTooltip> */}
      </FlexWrapper>
    </TopWrapper>
  );
};

export default TopContent;

const Title = styled.h3`
  color: ${(props) => props.theme.logoFontColor};
  margin-right: 15px;
`;

const TopWrapper = styled.div`
  margin: 1em 1em 1em 1em;

  @media only screen and (max-width: 769px) {
    margin-left: calc(66px + 1em);
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media only screen and (max-width: 650px) {
    width: 100%;
    flex: 1;
    /* align-items: left; */
    justify-content: space-evenly;
  }
`;
