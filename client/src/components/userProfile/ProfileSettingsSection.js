import React from "react";
import styled from "styled-components";
import ProfileSettingsCard from "./ProfileSettingsCard";
import ChangeDisplayName from "./settingsFeatures/ChangeDisplayName";
import ChangeUserEmail from "./settingsFeatures/ChangeUserEmail";

const ProfileSettingsSection = ({ props }) => {
  return (
    <>
      <Wrapper>
        <h1>Settings</h1>
        <FlexContainer>
          <ProfileSettingsCard title={`Change Display Name`}>
            <ChangeDisplayName />
          </ProfileSettingsCard>
          {/* <ProfileSettingsCard title={`Change Account Email`}>
            <ChangeUserEmail />
          </ProfileSettingsCard> */}
        </FlexContainer>
      </Wrapper>
    </>
  );
};

export default ProfileSettingsSection;

const Wrapper = styled.div`
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

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: center; */

  transition: 150ms ease-out;

  @media only screen and (max-width: 1200px) {
    justify-content: center;
  }
`;
