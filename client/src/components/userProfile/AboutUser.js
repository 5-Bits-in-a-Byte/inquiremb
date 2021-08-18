import React, { useContext, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import { UserContext } from "../context/UserProvider";
import DraftTextArea from "../common/DraftTextArea";
import LazyFetch from "../common/requests/LazyFetch";

const AboutUser = ({ userObject, ...props }) => {
  const user = useContext(UserContext);
  const [editingProfile, toggleEdit] = useState(false);
  const [aboutMe, setAboutMe] = useState(null);
  const [initialAboutMe, setInitialAboutMe] = useState(null);
  const [initialBannerColor, setInitialBannerColor] = useState(null);
  const [bannerColor, setBannerColor] = useState(null);
  let endpoint = "/userProfiles";

  useEffect(() => {
    LazyFetch({
      type: "get",
      endpoint: endpoint,
      onSuccess: (response) => {
        console.log("response:", response);
        setAboutMe(response.profileData.about);
        setInitialAboutMe(response.profileData.about);
        setBannerColor(response.profileData.bannerColor);
        setInitialBannerColor(response.profileData.bannerColor);
      },
    });
  }, []);

  const handleAboutSubmit = () => {
    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: {
        userId: user._id,
        about: aboutMe,
      },
      onSuccess: (response) => {
        console.log("response:", response);
      },
    });
  };

  const handleColorChange = (colors) => {
    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: {
        userId: "",
        color: colors.hex,
      },
      onSuccess: (data) => {
        console.log(data.success);
        this.setState({ courseColor: colors.hex });
      },
    });
  };
  return (
    <>
      <Wrapper>
        {/* <h3>{JSON.stringify(userObject, null, 2)}</h3> */}
        <ContentWrapper>
          <VerticalFlex>
            <ImageWrapper>
              <UserProfileImage
                src={userObject.picture}
                alt="User Profile Image."
              />
            </ImageWrapper>

            {editingProfile ? (
              <Button
                secondary
                buttonWidth={"10em"}
                buttonHeight={"2em"}
                onClick={() => {
                  toggleEdit(false);
                  setAboutMe(initialAboutMe);
                  setBannerColor(initialBannerColor);
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                secondary
                buttonWidth={"10em"}
                buttonHeight={"2em"}
                onClick={() => {
                  // alert("This feature is in progress.");
                  toggleEdit(!editingProfile);
                }}
              >
                Edit Profile
              </Button>
            )}
          </VerticalFlex>
          <UserInfoWrapper>
            <UserName>{userObject.first + " " + userObject.last}</UserName>
            <h2 style={{ margin: `1.5em 0 0 0` }}>About</h2>
            <AboutContent>
              {editingProfile ? (
                <div>
                  <DraftTextArea
                    minRows={5}
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
        <CustomColorSection bannerColor={bannerColor}></CustomColorSection>
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
  color: #fff;

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
