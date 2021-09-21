/*
This component deals with the login process by redirecting to Google or Github for authentication upon button click.
After the authentication process happens, the flask server will send you immediately to the website's home page.

Author: Brian Gunnarson
Group Name: 5 Bits in a Byte
*/

import React from "react";
import styled from "styled-components";
import img from "../../imgs/signup-background.png";
import SignInLogo from "../../imgs/inquire-signin-logo.png";
import Logo from "../../imgs/inquire-logo.png";
import GoogleLogo from "../../imgs/g-icon.png";
import GithubLogo from "../../imgs/github-logo.svg";
import Button from "../common/Button";

const SignUp = () => {
  const handleSignIn = () => {
    const url = process.env.REACT_APP_CLIENT_URL + "/login";
    window.location.href = url;
  };

  const handleSignUp = () => {
    const url = process.env.REACT_APP_CLIENT_URL + "/signup";
    window.location.href = url;
  };
  return (
    /* Wrapper for the entire page so we can have the background image */
    <Page>
      {/* Wrapper for the top section of the page */}
      {/* <Nav>
        <SignInLogoImg src={SignInLogo} />
        <div style={{ flex: 1 }}></div>
        <Button signin onClick={handleSignIn}>
          Sign In
        </Button>
        <Button primary onClick={handleSignUp} style={{ width: "10%" }}>
          Sign Up
        </Button>
      </Nav> */}

      {/* Wrapper for the center sign in block to help styling */}
      <CenterBlock>
        {/* Display the Inquire logo */}
        <LogoImg src={Logo} />

        <ButtonContainer>
          {/* Google Login Button */}
          <Buttons href={process.env.REACT_APP_SERVER_URL + "/auth/login"}>
            <Icon src={GoogleLogo} />
            <BtnText>Sign in with Google</BtnText>
          </Buttons>

          {/* Github Login Button */}
          <Buttons
            href={process.env.REACT_APP_SERVER_URL + "/auth/github-login"}
          >
            <Icon src={GithubLogo} />
            <BtnText>Sign in with Github</BtnText>
          </Buttons>
        </ButtonContainer>
        {/* Account related message */}
        {/* <Message>
          Don't have an account?&nbsp;
          <a href={process.env.REACT_APP_CLIENT_URL + "/signup"}>Sign up</a>
        </Message> */}
        {/* <div style={{ width: `auto`, height: `1em` }}></div> */}
      </CenterBlock>

      {/* Copyright message */}
      <Footer>Copyright© 5 Bits in a Byte</Footer>
    </Page>
  );
};

export default SignUp;

/* Styling for the background image on the whole page */
const Page = styled.div`
  background-image: url(${img});
  background-size: cover;
  height: 100vh;
  display: grid;
`;

/* Styling for the top left */
const Nav = styled.nav`
  width: 100vw;
  height: 55px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  padding: 0 15px;
`;

/* Styling for the top left Logo */
const SignInLogoImg = styled.img`
  height: 33px;
  margin-left: 10px;
`;

/* Styling for the center login block */
const CenterBlock = styled.div`
  position: relative;
  background: #ffffff;

  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.75);

  width: 350px;
  height: 350px;
  border-radius: 10px;
  display: grid;
  margin: auto;
`;

const ButtonContainer = styled.div`
  margin: 0 0 3em 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/* Styling for the center Logo */
const LogoImg = styled.img`
  width: auto;
  height: 4rem;
  margin: auto;
  padding: 0.35em;

  /* box-shadow: 0 0 5px rgba(0, 0, 0, 0.25); */
  border-radius: 0.5em;
`;

/* Styling for the login buttons */
const Buttons = styled.a`
  margin: auto;
  position: relative;
  /* padding: 15px 40px; */
  /* vertical-align: middle; */

  display: flex;
  /* flex-direction: row; */
  align-items: center;
  justify-content: center;

  /* border: 1px solid #bababa; */
  border-radius: 3px;

  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);

  width: 191px;
  height: 46px;
  background-color: white;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    background-color: #f8f8f8;
  }
`;

/* Styling for the login text in the buttons */
const BtnText = styled.div`
  color: #444;
  text-align: center;
  padding: 8px 8px 8px 24px;
  font-size: 14px;
  font-family: "Roboto";
  font-weight: 500;
  /* transform: translateY(-23%); */
`;

/* Styling for the icons in the buttons */
const Icon = styled.img`
  /* position: absolute; */
  width: 18px;
  height: 18px;
  margin: 8px 0 8px 8px;
  /* margin-right: 1em; */
  /* transform: translateY(-25%); */
`;

/* Styling for the account specific message */
const Message = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
`;

/* Styling for the copyright message */
const Footer = styled.footer`
  text-align: center;
  font-size: 10px;
  color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3vh;
`;
