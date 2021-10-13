import React, { useContext, useState } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import Errors from "../common/Errors";
import { fetchUser } from "../common/externalMethods/FetchUser";
import Modal from "../common/Modal";
import LazyFetch from "../common/requests/LazyFetch";
import { ColorContext } from "../context/ColorModeContext";
import { UserDispatchContext } from "../context/UserProvider";

const UserCourseCard = ({
  userCourseObject,
  isMyProfile,
  toggleChangeMade,
  changeMade,
  ...props
}) => {
  const [modalIsShown, toggleModal] = useState(false);
  const [success, setSuccessMessage] = useState(null);
  const [errors, setErrorMessage] = useState(null);
  const [display, toggleDisplay] = useState("flex");
  const setUser = useContext(UserDispatchContext);
  const theme = useContext(ColorContext);

  let title = userCourseObject?.courseName;
  let subtitle = "";
  if (userCourseObject.nickname) {
    title = userCourseObject.nickname;
    subtitle = userCourseObject.courseName;
  }

  const handleLeaveCourse = () => {
    LazyFetch({
      type: "put",
      endpoint: "/leaveCourse",
      data: { courseId: userCourseObject.courseId },
      onSuccess: (response) => {
        // console.log(response.success);
        toggleDisplay("none");
        setSuccessMessage(response.success);
        toggleChangeMade(!changeMade);
        fetchUser(setUser);
      },
      onFailure: (err) => {
        if (err.response && err.response.data) {
          setErrorMessage(err.response.data.errors);
        }
      },
    });
  };

  return (
    <>
      <CardWrapper courseColor={userCourseObject?.color} theme={theme}>
        <UpperSection courseColor={userCourseObject?.color}>
          <CourseTitle theme={theme}>{title}</CourseTitle>
          <CourseSubtitle>{subtitle}</CourseSubtitle>
        </UpperSection>
        {isMyProfile ? (
          <LowerSection theme={theme}>
            <Button
              outlineSecondary
              autoWidth
              buttonColor={`${theme.leaveCourseButton}`}
              style={{ color: "inherit" }}
              onClick={() => {
                toggleModal(true);
              }}
            >
              Leave Course
            </Button>
          </LowerSection>
        ) : (
          <></>
        )}
        {modalIsShown && (
          <Modal
            close={() => {
              toggleModal(false);
              toggleDisplay("flex");
            }}
            width={"724px"}
            data-testid={"leave-course-modal"}
          >
            <InnerModalWrapper className="flex-col align justify">
              <Title style={{ display: display }}>CONFIRM LEAVING COURSE</Title>
              <Success
                style={
                  display == "none" ? { display: "block" } : { display: "none" }
                }
              >
                {success}
              </Success>
              <ContentSection style={{ display: display }}>
                Are you sure you want to leave {userCourseObject?.courseName}?
              </ContentSection>
              <Button
                primary
                autoWidth
                style={{ marginTop: "10px", display: display }}
                onClick={handleLeaveCourse}
              >
                Confirm
              </Button>
              <Errors errors={errors} />
            </InnerModalWrapper>
          </Modal>
        )}
      </CardWrapper>
    </>
  );
};

export default UserCourseCard;

const CardWrapper = styled.div`
  background-color: ${(props) => props.theme.button};
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
  color: ${(props) => props.theme.logoFontColor};
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
  color: ${(props) => props.theme.leaveCourseButton};
  width: 100%;
  /* height: 50%; */

  padding: 0em 1em 1em 1em;

  /* border: 1px solid green; */
  border-radius: 5px 5px 5px 5px;
`;

const InnerModalWrapper = styled.div``;

const Success = styled.div`
  display: none;
  text-align: center;
  font-size: 25px;
`;

const Title = styled.h4`
  font-size: 25px;
  padding: 0px 0px 10px 0px;
`;

const ContentSection = styled.div`
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
`;
