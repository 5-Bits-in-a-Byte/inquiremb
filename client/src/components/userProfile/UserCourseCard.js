import React, { useState } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";

const UserCourseCard = ({ userCourseObject, isMyProfile, ...props }) => {
  let title = userCourseObject?.courseName;
  let subtitle = "";
  if (userCourseObject.nickname) {
    title = userCourseObject.nickname;
    subtitle = userCourseObject.courseName;
  }

  return (
    <>
      <CardWrapper courseColor={userCourseObject?.color}>
        <UpperSection courseColor={userCourseObject?.color}>
          <CourseTitle>{title}</CourseTitle>
          <CourseSubtitle>{subtitle}</CourseSubtitle>
        </UpperSection>
        {isMyProfile ? (
          <LowerSection>
            <Button
              outlineSecondary
              autoWidth
              buttonColor={`#DC2B2B`}
              style={{ color: `#DC2B2B` }}
            >
              Leave Course
            </Button>
          </LowerSection>
        ) : (
          <></>
        )}

        {/* <h1></h1> */}
      </CardWrapper>
    </>
  );
};

export default UserCourseCard;

const CardWrapper = styled.div`
  min-width: 8rem;
  /* min-height: 6rem; */

  margin: 1em;
  /* padding: 1em; */

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
  border-left: 4px solid
    ${(props) =>
      css`
        ${props?.courseColor}
      `};
  border-radius: 5px;
`;

const CourseTitle = styled.h4`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: row;

  width: 100%;
  height: 100%;

  text-align: left;

  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

const CourseSubtitle = styled.h6`
  color: #979797;
  text-align: left;
`;

const UpperSection = styled.div`
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;

  width: 100%;
  /* height: 50%; */

  padding: 1em 1em;

  /* border: 1px solid red; */
  border-radius: 5px 5px 5px 5px;
  /* background-color: ${(props) =>
    css`
      ${props?.courseColor}
    `}; */
`;

const LowerSection = styled.div`
  width: 100%;
  /* height: 50%; */

  padding: 0em 1em 1em 1em;

  /* border: 1px solid green; */
  border-radius: 5px 5px 5px 5px;
`;
