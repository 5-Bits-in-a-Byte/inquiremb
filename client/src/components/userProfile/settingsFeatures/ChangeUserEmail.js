import React, { useState, useContext } from "react";
import styled, { css } from "styled-components";
import Button from "../../common/Button";
import { fetchUser } from "../../common/externalMethods/FetchUser";
import LazyFetch from "../../common/requests/LazyFetch";
import { UserContext, UserDispatchContext } from "../../context/UserProvider";

const ChangeUserEmail = ({ props }) => {
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  const [emailState, setEmailState] = useState({
    email: user.email,
  });

  const handleEmailChange = (event) => {
    // console.log("[UserDataCheck] Event Data: ", event);

    event.stopPropagation();

    setEmailState({
      email: event.target.value,
    });
  };

  const handleFormSubmission = (event) => {
    // console.log("[UserDataCheck] Event Data: ", event);

    LazyFetch({
      type: "put",
      endpoint: "/update-user-data",
      data: {
        userId: user._id,
        ...emailState,
      },
      onSuccess: (response) => {
        // console.log("[UserDataCheck] PUT - Response: ", response);
        fetchUser(setUser);
        alert("Account email change successful.");
      },
      onFailure: (error) => {
        console.log("[UserDataCheck] PUT - Error: ", error);
      },
    });
  };

  return (
    <>
      <Wrapper>
        <h4>
          Note: this simply changes the email associated with your account, not
          the method of signing into Inquire.
        </h4>
        <h5>Current Email: </h5>
        <p>{user.email}</p>
        <FormWrapper>
          <form>
            <label htmlFor="fname">Email:</label> <br />
            <input
              type="text"
              id="femail"
              onChange={handleEmailChange}
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
            <br /> <br />
          </form>
        </FormWrapper>
        <Button
          primary
          buttonWidth={"10em"}
          buttonHeight={"2.5em"}
          onClick={(event) => {
            event.stopPropagation();
            handleFormSubmission(event);
          }}
        >
          Submit
        </Button>
      </Wrapper>
    </>
  );
};

export default ChangeUserEmail;

const Wrapper = styled.div`
  max-width: 300px;

  p {
    padding: 0 0 1em 0;
  }

  h4 {
    white-space: pre-line;
    padding: 0 0 1em 0;
  }
`;

const FormWrapper = styled.div`
  label {
    color: var(--inquire-blue);
    font-family: "Roboto";
    font-weight: 100;
    font-size: 18px;
  }

  input[type="text"] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;
