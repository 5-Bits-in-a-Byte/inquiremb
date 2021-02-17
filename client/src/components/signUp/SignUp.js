import React from "react";
import styled from "styled-components";
import img from "../../imgs/signup-background.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import GoogleLogin from "react-google-login";

const SignUp = () => {
  const onSuccess = (res) => {
    console.log("[Login Success] currentUser:", res.profileObj);
  };
  const onFailure = (res) => {
    console.log("[Login Failed] res:", res);
  };

  return (
    <Page>
      <div>
        <Router>
          <Link to="/login" exact>
            <GoogleLogin
              client_id={process.env.GOOGLE_CLIENT_ID}
              onSuccess={onSuccess}
              onFailure={onFailure}
            />
          </Link>
          <Switch>
            <Route path="/login" exact></Route>
          </Switch>
        </Router>
      </div>
    </Page>
  );
};

export default SignUp;

const Page = styled.div`
  border: 1px solid #000;
  background-image: url(${img});
  width: 2000px;
  height: 900px;
`;
