import React, { useState, useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import DraftTextArea from "../common/DraftTextArea";
import LazyFetch from "../common/requests/LazyFetch";
import { ChromePicker } from "react-color";
import Icon from "../common/Icon";
import LightColorImg from "../../imgs/color-palette-white.svg";
import DarkColorImg from "../../imgs/color-palette.svg";
import { ContrastDetector } from "../common/externalMethods/ContrastDetector";
import ProfileSettingsCard from "./ProfileSettingsCard";
import { UserContext, UserDispatchContext } from "../context/UserProvider";
import { fetchUser } from "../common/externalMethods/FetchUser";
import ChangeDisplayName from "./settingsFeatures/ChangeDisplayName";

const renderEditButton = (
  toggleEdit,
  setAboutMe,
  editingProfile,
  initialAboutMe
) => {
  if (editingProfile) {
    return (
      <Button
        secondary={true}
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

const AboutUser = ({
  userObject,
  isMyProfile,
  profileId,
  profileName,
  setProfileName,
  ...props
}) => {
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
      onSuccess: (response) => {
        // console.log("response:", response);
        setAboutMe(response.profileData.about);
        setInitialAboutMe(response.profileData.about);
        setBannerColor(response.profileData.bannerColor);
        setProfilePicture(response.picture);
        setProfileName(response.name);
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
        // console.log("response:", response);
        setInitialAboutMe(aboutMe);
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
        // console.log(data.success);
        setBannerColor(colors.hex);
      },
    });
  };

  var background = bannerColor ? ContrastDetector(bannerColor) : null;

  return (
    <>
      <Wrapper>
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
            <UserName backgroundColor={background}>{profileName}</UserName>
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

  transition: 150ms ease-out;

  @media only screen and (max-width: 1200px) {
    height: auto;
    min-height: 300px;
  }
  @media only screen and (max-width: 1025px) {
  }
  @media only screen and (max-width: 769px) {
    min-height: 200px;
  }
  @media only screen and (max-width: 481px) {
  }
  @media only screen and (max-width: 400px) {
  }
`;

const AboutText = styled.p`
  white-space: initial;

  @media only screen and (max-width: 1200px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 769px) {
    width: 100%;
    white-space: pre-line;
    word-wrap: break-word;
    padding-bottom: 1em;
  }
  @media only screen and (max-width: 481px) {
    font-size: 14px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5em 0 0 0;
`;

const ContentWrapper = styled.div`
  z-index: 1;
  width: 100%;

  display: flex;
  align-items: center;

  @media only screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const CustomColorSection = styled.div`
  * {
    z-index: 1000000;
  }
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
  width: 100%;
  height: 300px;
  overflow: hidden;

  @media only screen and (max-width: 769px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    height: auto;
  }

  h2 {
    @media only screen and (max-width: 1200px) {
      font-size: 24px;
    }
    @media only screen and (max-width: 1025px) {
      font-size: 22px;
    }
    @media only screen and (max-width: 769px) {
      font-size: 18px;
      height: auto;
      padding-bottom: 1em;
    }
  }
`;

const UserName = styled.h1`
  margin-top: 1em;

  word-wrap: break-word;
  white-space: pre-line;

  font-size: 36px;
  color: ${(props) =>
    props.backgroundColor == "dark" ? css`#fff` : css`#162B55`};

  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  transition: 150ms ease-out;

  @media only screen and (max-width: 1200px) {
    font-size: 32px;
  }
  @media only screen and (max-width: 1025px) {
    font-size: 28px;
  }
  @media only screen and (max-width: 769px) {
    font-size: 24px;
    text-align: center;
  }
  @media only screen and (max-width: 481px) {
    font-size: 22px;
  }
  /* @media only screen and (max-width: 400px) {
    font-size: 16px;
  } */
`;

const AboutContent = styled.div`
  margin: 0.5em 0;
  max-width: 400px;

  @media only screen and (max-width: 769px) {
    margin: 0;
    font-size: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`;

const VerticalFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  margin: 0 0.5em 0 1em;
  height: 300px;

  @media only screen and (max-width: 769px) {
    width: 100%;
    height: auto;
    min-height: 100px;
  }
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

  @media only screen and (max-width: 769px) {
    margin-bottom: 18px;
  }
`;

const UserProfileImage = styled.img`
  width: 182px;
  height: 182px;

  background-color: #fff;
  border-radius: 50%;
`;
