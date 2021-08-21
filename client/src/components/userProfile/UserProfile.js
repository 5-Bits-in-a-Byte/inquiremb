import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import Errors from "../common/Errors";
import Modal from "../common/Modal";
import LazyFetch from "../common/requests/LazyFetch";
import { UserContext } from "../context/UserProvider";
import AboutUser from "./AboutUser";
import UserCourses from "./UserCourses";

const UserProfile = ({ props }) => {
  const user = useContext(UserContext);
  const { profileId } = useParams();
  const isMyProfile = user._id == profileId ? true : false;
  const [courses, setCourses] = useState([]);

  // Leaving Course/Modal state variables
  const [courseToLeave, setCourseToLeave] = useState(null);
  const [modalIsShown, toggleModal] = useState(false);
  const [success, setSuccessMessage] = useState(null);
  const [errors, setErrorMessage] = useState(null);
  const [display, toggleDisplay] = useState("flex");
  const [courseToLeaveName, setName] = useState(null);
  const [changeMade, toggleChangeMade] = useState(false);
  console.log("courses:", courses);

  const handleLeaveCourse = () => {
    LazyFetch({
      type: "put",
      endpoint: "/leaveCourse",
      data: { courseId: courseToLeave },
      onSuccess: (response) => {
        console.log(response.success);
        toggleDisplay("none");
        setSuccessMessage(response.success);
        toggleChangeMade(!changeMade);
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
      <Wrapper>
        <ScrollingDiv>
          <AboutUser
            userObject={user}
            isMyProfile={isMyProfile}
            profileId={profileId}
            modalIsShown={modalIsShown}
          />
          <UserCourses
            userObject={user}
            isMyProfile={isMyProfile}
            profileId={profileId}
            toggleModal={toggleModal}
            setCourseToLeave={setCourseToLeave}
            setName={setName}
            setCourses={setCourses}
            courses={courses}
            changeMade={changeMade}
          />
        </ScrollingDiv>
      </Wrapper>
      {modalIsShown && (
        <Modal
          close={() => {
            toggleModal(false);
            setCourseToLeave(null);
            toggleDisplay("flex");
            setName(null);
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
              Are you sure you want to leave {courseToLeaveName}?
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
    </>
  );
};

export default UserProfile;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  /* align-items: center; */
  justify-content: center;

  /* overflow: scroll; */
  white-space: pre;

  /* width: calc(100% - 15px); */
  height: calc(100vh - 66px);

  /* border: 1px solid red; */
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  /* padding: 2rem 4rem 0 4rem; */

  overflow: auto;
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

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
// const OverflowCounter = styled.div`
//   width: 100%;
//   ${(props) =>
//     props.offsetAmount &&
//     css`
//       padding: ${props.offsetAmount};
//     `}
//   border: 3px solid black;
// `;
