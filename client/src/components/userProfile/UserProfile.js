import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../common/Button";
import { ColorContext } from "../context/ColorModeContext";
import { UserContext } from "../context/UserProvider";
import AboutUser from "./AboutUser";
import ProfileSettingsSection from "./ProfileSettingsSection";
import UserCourses from "./UserCourses";

const UserProfile = ({ props }) => {
  const user = useContext(UserContext);
  const { profileId } = useParams();
  const isMyProfile = user._id == profileId ? true : false;
  const [profileName, setProfileName] = useState(null);

  const theme = useContext(ColorContext);

  return (
    <>
      <Wrapper theme={theme}>
        <ScrollingDiv>
          {isMyProfile ? (
            <></>
          ) : (
            <Button
              secondary
              onClick={() => {
                window.history.back();
              }}
              style={{ margin: "1em", padding: ".25em 2em" }}
            >
              Back
            </Button>
          )}

          <AboutUser
            userObject={user}
            isMyProfile={isMyProfile}
            profileId={profileId}
            profileName={profileName}
            setProfileName={setProfileName}
          />
          {isMyProfile ? <ProfileSettingsSection /> : <></>}
          <UserCourses
            userObject={user}
            isMyProfile={isMyProfile}
            profileId={profileId}
            profileName={profileName}
          />
        </ScrollingDiv>
      </Wrapper>
    </>
  );
};

export default UserProfile;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
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
