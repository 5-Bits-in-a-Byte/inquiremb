import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import LazyFetch from "../common/requests/LazyFetch";
import UserCourseCard from "./UserCourseCard";

const UserCourses = ({
  userObject,
  isMyProfile,
  profileId,
  toggleModal,
  setCourseToLeave,
  setName,
  profileName,
  ...props
}) => {
  const [changeMade, toggleChangeMade] = useState(false);
  const [courses, setCourses] = useState([]);

  const generateUserCourseCards = (courseList) => {
    let userCourseCards = courseList.map((course, index) => (
      <UserCourseCard
        key={index}
        id={`course-card-${index}`}
        userCourseObject={course}
        isMyProfile={isMyProfile}
        toggleModal={toggleModal}
        setCourseToLeave={setCourseToLeave}
        setName={setName}
        toggleChangeMade={toggleChangeMade}
        changeMade={changeMade}
      />
    ));

    return userCourseCards;
  };

  useEffect(() => {
    LazyFetch({
      type: "get",
      endpoint: "/userProfiles?profileId=" + profileId,
      onSuccess: (response) => {
        setCourses(generateUserCourseCards(response.courses));
      },
    });
  }, [changeMade]);

  return (
    <>
      <SectionWrapper>
        <h1>Courses</h1>
        <CardsContainer>
          {courses.length > 0
            ? courses
            : profileName + " is not currently enrolled in any courses."}
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

  @media only screen and (max-width: 769px) {
    justify-content: center;
  }
`;
