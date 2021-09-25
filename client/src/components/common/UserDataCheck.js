import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled, { css } from "styled-components";
import { UserDispatchContext } from "../context/UserProvider";
import Button from "./Button";
import { fetchUser } from "./externalMethods/FetchUser";
import Modal from "./Modal";
import LazyFetch from "./requests/LazyFetch";

const UserDataCheck = ({ userData, debug, ...props }) => {
  const setUser = useContext(UserDispatchContext);

  const [showDataForm, setShowDataForm] = useState(false);
  const [firstLastState, setFirstLastState] = useState({
    first: userData.first,
    last: userData.last,
  });

  const userDataCheck = (user) => {
    debug && console.log("[UserDataCheck] UserData: ", user);
    if (user.first == "" || user.last == "") {
      setShowDataForm(true);
    }
  };

  useEffect(() => {
    userDataCheck(userData);
  }, []);

  const handleFirstNameChange = (event) => {
    debug && console.log("[UserDataCheck] Event Data: ", event);
    setFirstLastState({
      first: event.target.value,
      last: firstLastState.last,
    });
  };

  const handleLastNameChange = (event) => {
    debug && console.log("[UserDataCheck] Event Data: ", event);
    setFirstLastState({
      first: firstLastState.first,
      last: event.target.value,
    });
  };

  const handleFormSubmission = (event) => {
    debug && console.log("[UserDataCheck] Event Data: ", event);

    LazyFetch({
      type: "put",
      endpoint: "/update-user-data",
      data: {
        userId: userData._id,
        ...firstLastState,
      },
      onSuccess: (response) => {
        debug && console.log("[UserDataCheck] PUT Response: ", response);
        setShowDataForm(false);

        fetchUser(setUser);
      },
      onFailure: (error) => {
        debug && console.log("[UserDataCheck] Error: ", error);
      },
    });
  };

  return (
    <>
      <Wrapper>
        {showDataForm && (
          <Modal
            close={() => {
              setShowDataForm(false);
            }}
            width={`50vw`}
            data-testid="user-data-form-modal"
          >
            <ModalWrapper>
              <h1>Uh oh...</h1>
              <h2>
                Upon account creation OAuth could not provide us a first or last
                name for your account, please provide us the missing input
                bellow so that other users can identify you.
              </h2>

              <br />

              <form>
                <label htmlFor="fname">First Name:</label> <br />
                <input
                  type="text"
                  id="fname"
                  onChange={handleFirstNameChange}
                />
                <br />
                <label htmlFor="fname">Last Name:</label> <br />
                <input type="text" id="fname" onChange={handleLastNameChange} />
                <br /> <br />
              </form>
              <Button primary onClick={handleFormSubmission}>
                Submit
              </Button>
            </ModalWrapper>
          </Modal>
        )}
      </Wrapper>
    </>
  );
};

export default UserDataCheck;

const Wrapper = styled.div`
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
`;

const ModalWrapper = styled.div`
  width: 100%;
  height: auto;
  padding: 1em;

  /* border: 1px solid red; */

  border: 2px solid #e9e9e9;
  border-radius: 4px;

  h1 {
    margin-bottom: 1em;
  }

  h2 {
    margin: 1em 0;
  }

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
