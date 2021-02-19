/*
This component deals with the sign in process by redirecting to Google for authentication upon button click.
After the authentication process happens, the flask server will send you immediately to the website's home page.

Author: Brian Gunnarson
Group Name: 5 Bits in a Byte
*/

import React from "react";
import styled from "styled-components";
import img from "../../imgs/signup-background.png";
import SignInLogo from "../../imgs/signin-logo.png";
import Logo from "../../imgs/swag-logo.png";
import GoogleLogo from "../../imgs/g-icon.png";

class SignUp extends React.Component {
  handleClick() {
    window.location.assign(process.env.REACT_APP_SERVER_URL + "/login");
  }

  render() {
    return (
      <Page>
        <Nav>
          <SignInLogoImg src={SignInLogo} />
        </Nav>
        <CenterBlock>
          <LogoImg src={Logo} />
          <Welcome>Welcome to SuperSwag!</Welcome>
          <GoogleButton onClick={this.handleClick.bind(this)}>
            <Icon src={GoogleLogo} />
            <BtnText>Sign up with Google</BtnText>
          </GoogleButton>
          <Message>
            Already have an account?&nbsp;
            <a href={process.env.REACT_APP_CLIENT_URL + "/login"}>Sign in</a>
          </Message>
        </CenterBlock>
        <RightNav>
          <Btn>Sign In</Btn>
          <Btn>Sign Up</Btn>
        </RightNav>
        <Footer>Copyright© 5 Bits in a Byte</Footer>
      </Page>
    );
  }
}

export default SignUp;

const Page = styled.div`
  background-image: url(${img});
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

const Welcome = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 18px;
`;

const LogoImg = styled.img`
  height: 35px;
  margin: auto;
`;

const GoogleButton = styled.button`
  margin: auto;
  position: relative;
  padding: 15px 40px;
  vertical-align: middle;
  border: 1px solid #bababa;
  border-radius: 3px;
  width: 320px;
  height: 43px;
  background-color: white;
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
  display: inline-block;
`;

const Btn = styled.button`
  position: fixed;
  right: 0;
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
