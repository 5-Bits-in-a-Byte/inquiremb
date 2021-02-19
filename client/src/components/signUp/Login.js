/*
This component deals with the login process by redirecting to Google for authentication upon button click.
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
    <Page>
      <Nav>
        <SignInLogoImg src={SignInLogo} />
      </Nav>

      <CenterBlock>
        <LogoImg src={Logo} />

        <Buttons href={process.env.REACT_APP_SERVER_URL + "/login"}>
          <Icon src={GoogleLogo} />
          <BtnText>Sign in with Google</BtnText>
        </Buttons>

        <Buttons href={process.env.REACT_APP_SERVER_URL + "/login"}>
          <Icon src={GitHubLogo} />
          <BtnText>Sign in with GitHub</BtnText>
        </Buttons>

        <Message>
          Don't have an account?&nbsp;
          <a href={process.env.REACT_APP_CLIENT_URL + "/signup"}>Sign up</a>
        </Message>
      </CenterBlock>

      <RightNav>
        <In href={process.env.REACT_APP_CLIENT_URL + "/login"}>Sign In</In>
        <Up href={process.env.REACT_APP_CLIENT_URL + "/signup"}>Sign Up</Up>
      </RightNav>

      <Footer>Copyright© 5 Bits in a Byte</Footer>
    </Page>
  );
};

export default SignUp;

const Page = styled.div`
  background-image: url(${img});
  background-size: cover;
  height: 100vh;
  display: grid;
`;

const Nav = styled.nav`
  width: 100vw;
  height: 55px;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
`;

const SignInLogoImg = styled.img`
  height: 33px;
  margin-left: 10px;
`;

const CenterBlock = styled.div`
  position: relative;
  background: #ffffff;
  width: 400px;
  height: 357px;
  border-radius: 5px;
  display: grid;
  margin: auto;
`;

const LogoImg = styled.img`
  height: 35px;
  margin: auto;
`;

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

const BtnText = styled.div`
  text-align: center;
  font-size: 17px;
  transform: translateY(-23%);
`;

const Icon = styled.img`
  position: absolute;
  height: 25px;
  left: 12px;
  transform: translateY(-25%);
`;

const Message = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
`;

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
