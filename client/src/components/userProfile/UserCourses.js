import React from "react";
import styled, { css } from "styled-components";
import UserCourseCard from "./UserCourseCard";

const UserCourses = ({ userObject, ...props }) => {
  const generateUserCourseCards = (courseList) => {
    console.log(courseList);

    let userCourseCards = courseList.map((course, index) => (
      <UserCourseCard id={`course-card-${index}`} userCourseObject={course} />
    ));

    return userCourseCards;
  };

  return (
    <>
      <SectionWrapper>
        <h1>Courses:</h1>
        <CardsContainer>
          {generateUserCourseCards(userObject.courses)}
        </CardsContainer>
      </SectionWrapper>
    </>
  );
};

export default UserCourses;

const SectionWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100px;
  margin: 1em;
  padding: 1em 2em;

  background-color: #fff;
  border-radius: 10px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const CardsContainer = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-wrap: wrap;

  overflow-y: scroll;

  transition: 150ms ease-out;
`;
