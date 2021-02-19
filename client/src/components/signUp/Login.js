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
import GitHubLogo from "../../imgs/github-logo.svg";

const SignUp = () => {
  return (
    /* Wrapper for the entire page so we can have the background image */
    <Page>
      {/* Wrapper for the top left section of the page to help align the Inquire logo */}
      <Nav>
        <SignInLogoImg src={SignInLogo} />
      </Nav>

      {/* Wrapper for the center sign in block to help styling */}
      <CenterBlock>
        {/* Display the Inquire logo */}
        <LogoImg src={Logo} />

        {/* Google Login Button */}
        <Buttons href={process.env.REACT_APP_SERVER_URL + "/login"}>
          <Icon src={GoogleLogo} />
          <BtnText>Sign in with Google</BtnText>
        </Buttons>

        {/* GitHub Login Button */}
        <Buttons href={process.env.REACT_APP_SERVER_URL + "/login"}>
          <Icon src={GitHubLogo} />
          <BtnText>Sign in with GitHub</BtnText>
        </Buttons>

        {/* Account related message */}
        <Message>
          Don't have an account?&nbsp;
          <a href={process.env.REACT_APP_CLIENT_URL + "/signup"}>Sign up</a>
        </Message>
      </CenterBlock>

      {/* Wrapper for the top right section of the page to help align the sign in and sign up buttons */}
      <RightNav>
        <In href={process.env.REACT_APP_CLIENT_URL + "/login"}>Sign In</In>
        <Up href={process.env.REACT_APP_CLIENT_URL + "/signup"}>Sign Up</Up>
      </RightNav>

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
  width: 400px;
  height: 357px;
  border-radius: 5px;
  display: grid;
  margin: auto;
`;

/* Styling for the center Logo */
const LogoImg = styled.img`
  height: 35px;
  margin: auto;
`;

/* Styling for the login buttons */
const Buttons = styled.a`
  margin: auto;
  position: relative;
  padding: 15px 40px;
  vertical-align: middle;
  border: 1px solid #bababa;
  border-radius: 3px;
  width: 100%;
  max-width: 320px;
  height: 43px;
  background-color: white;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    background-color: #dedede;
  }
`;

/* Styling for the login text in the buttons */
const BtnText = styled.div`
  text-align: center;
  font-size: 17px;
  transform: translateY(-23%);
`;

/* Styling for the icons in the buttons */
const Icon = styled.img`
  position: absolute;
  height: 25px;
  left: 12px;
  transform: translateY(-25%);
`;

/* Styling for the account specific message */
const Message = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
`;

/* Styling for the top right alignment */
const RightNav = styled.nav`
  width: 100vw;
  height: 55px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

/* Styling for the top right sign-in button */
const In = styled.a`
  display: flex;
  align-items: center;
  background-color: Transparent;
  background-repeat: no-repeat;
  padding: 15px 40px;
  width: 140px;
  height: 20px;
  color: white;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background-color: #ffffff;
    opacity: 0.85;
    color: black;
  }
`;

/* Styling for the top right sign-up button */
const Up = styled.a`
  display: flex;
  align-items: center;
  padding: 15px 40px;
  background: #4a86fa;
  border-radius: 3px;
  width: 140px;
  height: 20px;
  color: white;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background-color: #4a86fa;
    opacity: 0.85;
    color: black;
  }
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
  height: 20px;
`;
