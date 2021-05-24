import React, { useContext } from "react";
import styled, { css } from "styled-components";
import Button from "../common/Button";
import { UserContext } from "../context/UserProvider";
import DraftTextArea from "../common/DraftTextArea";

const AboutUser = ({ userObject, ...props }) => {
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

            <Button
              secondary
              buttonWidth={"10em"}
              buttonHeight={"2em"}
              onClick={() => {
                alert("This feature is in progress.");
              }}
            >
              Edit Profile
            </Button>
          </VerticalFlex>
          <UserInfoWrapper>
            <UserName>{userObject.first + " " + userObject.last}</UserName>
            <h2 style={{ margin: `1.5em 0 0 0` }}>About</h2>
            <AboutContent>
              <DraftTextArea
                minRows={5}
                placeholder="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia fuga quaerat atque! Aperiam autem fugit, ad sapiente illo dicta reiciendis quis nam, sint quidem iste!"
                // onChange={handleChange}
                // name="title"
              ></DraftTextArea>
            </AboutContent>
          </UserInfoWrapper>
        </ContentWrapper>
        <CustomColorSection></CustomColorSection>
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
  /* width: 100%; */
  height: 300px;
  margin: 1em;
  padding: 1em;

  background-color: #fff;
  border-radius: 10px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
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

  background-color: #4a86fa;
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
