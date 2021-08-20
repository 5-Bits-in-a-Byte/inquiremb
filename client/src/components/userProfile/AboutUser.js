import React, { useContext, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import { UserContext } from "../context/UserProvider";
import DraftTextArea from "../common/DraftTextArea";
import LazyFetch from "../common/requests/LazyFetch";
import { ChromePicker } from "react-color";
import Icon from "../common/Icon";
import LightColorImg from "../../imgs/color-palette-white.svg";
import DarkColorImg from "../../imgs/color-palette.svg";
import { ContrastDetector } from "../common/externalMethods/ContrastDetector";
import { useParams } from "react-router-dom";

const renderEditButton = (
  toggleEdit,
  setAboutMe,
  editingProfile,
  initialAboutMe
) => {
  if (editingProfile) {
    return (
      <Button
        secondary
        buttonWidth={"10em"}
        buttonHeight={"2em"}
        onClick={() => {
          toggleEdit(false);
          setAboutMe(initialAboutMe);
        }}
      >
        Cancel{" "}
      </Button>
    );
  } else {
    return (
      <Button
        secondary
        buttonWidth={"10em"}
        buttonHeight={"2em"}
        onClick={() => {
          toggleEdit(!editingProfile);
        }}
      >
        Edit Profile
      </Button>
    );
  }
};

const renderColorIcon = (
  background,
  toggleColorDisplay,
  displayColorSelector
) => {
  if (background == "dark") {
    return (
      <Icon
        fader
        clickable
        src={LightColorImg}
        alt={"Color"}
        width={"16em"}
        style={{ padding: "8px" }}
        title={"Change color"}
        onClick={() => {
          toggleColorDisplay(!displayColorSelector);
        }}
      />
    );
  } else {
    return (
      <Icon
        fader
        clickable
        src={DarkColorImg}
        alt={"Color"}
        width={"16em"}
        style={{ padding: "8px" }}
        title={"Change color"}
        onClick={() => {
          toggleColorDisplay(!displayColorSelector);
        }}
      />
    );
  }
};

const AboutUser = ({ userObject, isMyProfile, profileId, ...props }) => {
  // const { profileId } = useParams();
  // Compare useParams ID value with userObject ID value to see if we should display edit profile buttons
  // const isMyProfile = profileId == userObject._id ? true : false;
  console.log("profileId:", profileId);
  console.log("userObject._id:", userObject._id);
  const [editingProfile, toggleEdit] = useState(false);
  const [aboutMe, setAboutMe] = useState(null);
  const [initialAboutMe, setInitialAboutMe] = useState(null);
  const [bannerColor, setBannerColor] = useState(null);
  const [displayColorSelector, toggleColorDisplay] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  let endpoint = "/userProfiles";

  useEffect(() => {
    LazyFetch({
      type: "get",
      endpoint: endpoint + "?profileId=" + profileId,
      // data: { profileId: profileId },
      onSuccess: (response) => {
        console.log("response:", response);
        setAboutMe(response.profileData.about);
        setInitialAboutMe(response.profileData.about);
        setBannerColor(response.profileData.bannerColor);
        setProfilePicture(response.picture);
      },
    });
  }, []);

  const handleAboutSubmit = () => {
    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: {
        userId: userObject._id,
        about: aboutMe,
      },
      onSuccess: (response) => {
        console.log("response:", response);
      },
    });
  };

  const handleColorChange = (colors) => {
    setBannerColor(colors.hex);
  };

  const submitColorChange = (colors) => {
    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: {
        userId: userObject._id,
        bannerColor: colors.hex,
      },
      onSuccess: (data) => {
        console.log(data.success);
        setBannerColor(colors.hex);
      },
    });
  };

  var background = bannerColor ? ContrastDetector(bannerColor) : null;

  return (
    <>
      <Wrapper>
        <ContentWrapper>
          <VerticalFlex>
            <ImageWrapper>
              <UserProfileImage
                src={profilePicture}
                alt="User Profile Image."
              />
            </ImageWrapper>
            {isMyProfile ? (
              renderEditButton(
                toggleEdit,
                setAboutMe,
                editingProfile,
                initialAboutMe
              )
            ) : (
              <></>
            )}
          </VerticalFlex>

          <UserInfoWrapper>
            <UserName backgroundColor={background}>
              {userObject.first + " " + userObject.last}
            </UserName>
            <h2 style={{ margin: `1.75em 0 0 0` }}>About</h2>
            <AboutContent>
              {editingProfile ? (
                <div>
                  <DraftTextArea
                    minRows={4}
                    maxRows={4}
                    placeholder="Here's something super interesting about me..."
                    onChange={(e) => {
                      setAboutMe(e.target.value);
                    }}
                  ></DraftTextArea>
                  <ButtonWrapper>
                    <Button
                      primary
                      buttonWidth={"10em"}
                      buttonHeight={"1.5em"}
                      onClick={() => {
                        handleAboutSubmit();
                        toggleEdit(false);
                      }}
                    >
                      Submit
                    </Button>
                  </ButtonWrapper>
                </div>
              ) : (
                <AboutText>{aboutMe}</AboutText>
              )}
            </AboutContent>
          </UserInfoWrapper>
        </ContentWrapper>
        <CustomColorSection bannerColor={bannerColor}>
          {displayColorSelector && (
            <ChromePicker
              onChange={handleColorChange}
              onChangeComplete={submitColorChange}
              color={bannerColor}
              disableAlpha
            />
          )}
          {isMyProfile ? (
            renderColorIcon(
              background,
              toggleColorDisplay,
              displayColorSelector
            )
          ) : (
            <></>
          )}
        </CustomColorSection>
      </Wrapper>
    </>
  );
};

export default AboutUser;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 300px;
  margin: 1em;
  padding: 1em;

  background-color: #fff;
  border-radius: 10px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const AboutText = styled.div`
  width: 150%;
  white-space: initial;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5em 0 0 0;
`;

const ContentWrapper = styled.div`
  z-index: 9998;

  display: flex;
  align-items: center;
`;

const CustomColorSection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 112px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;

  background-color: ${(props) =>
    props.bannerColor ? props.bannerColor : css`#4A86FA`};
`;

const UserInfoWrapper = styled.div`
  margin: 0 1em;
  width: 350px;
  height: 300px;

  /* border: 1px solid black; */
`;

const UserName = styled.h1`
  margin-top: 1em;

  font-size: 36px;
  color: ${(props) =>
    props.backgroundColor == "dark" ? css`#fff` : css`#162B55`};

  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const AboutContent = styled.div`
  margin: 0.5em 0;
`;

const VerticalFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  margin: 0 0.5em 0 1em;
  height: 300px;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 200px;
  height: 200px;

  background-color: #f8f8f8;
  border-radius: 50%;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.15);
`;

const UserProfileImage = styled.img`
  width: 182px;
  height: 182px;

  background-color: #fff;
  border-radius: 50%;
`;
