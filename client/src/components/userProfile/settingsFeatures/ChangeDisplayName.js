import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import { fetchUser } from "../../common/externalMethods/FetchUser";
import LazyFetch from "../../common/requests/LazyFetch";
import { UserContext, UserDispatchContext } from "../../context/UserProvider";

const ChangeDisplayName = ({ props }) => {
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  const [firstLastState, setFirstLastState] = useState({
    first: user.first,
    last: user.last,
  });

  const handleFirstNameChange = (event) => {
    // console.log("[UserDataCheck] Event Data: ", event);

    event.stopPropagation();

    setFirstLastState({
      first: event.target.value,
      last: firstLastState.last,
    });
  };

  const handleLastNameChange = (event) => {
    // console.log("[UserDataCheck] Event Data: ", event);

    event.stopPropagation();

    setFirstLastState({
      first: firstLastState.first,
      last: event.target.value,
    });
  };

  const handleFormSubmission = (event) => {
    // console.log("[UserDataCheck] Event Data: ", event);

    LazyFetch({
      type: "put",
      endpoint: "/update-user-data",
      data: {
        userId: user._id,
        ...firstLastState,
      },
      onSuccess: (response) => {
        // console.log("[UserDataCheck] PUT Response: ", response);
        fetchUser(setUser);
        alert(
          "Name change successful. Please refresh the page to see changes reflected."
        );
      },
      onFailure: (error) => {
        // console.log("[UserDataCheck] Error: ", error);
      },
    });
  };

  return (
    <>
      <Wrapper>
        <FormWrapper>
          <form>
            <label htmlFor="fname">First Name:</label> <br />
            <input
              type="text"
              id="fname"
              onChange={handleFirstNameChange}
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
            <br />
            <label htmlFor="fname">Last Name:</label> <br />
            <input
              type="text"
              id="fname"
              onChange={handleLastNameChange}
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

export default ChangeDisplayName;

const Wrapper = styled.div``;

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
