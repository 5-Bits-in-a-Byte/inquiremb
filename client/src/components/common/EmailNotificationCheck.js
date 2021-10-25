import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled, { css } from "styled-components";
import { UserContext, UserDispatchContext } from "../context/UserProvider";
import Button from "./Button";
import { fetchUser } from "./externalMethods/FetchUser";
import MaterialCheckbox from "./MaterialCheckbox";
import Modal from "./Modal";
import LazyFetch from "./requests/LazyFetch";

const EmailNotificationCheck = ({ userData, debug, ...props }) => {
  const setUser = useContext(UserDispatchContext);

  const [showDataForm, setShowDataForm] = useState(
    userData.userProfileData?.accountFlags?.emailNotificationPrompt
  );
  const [emailNotificationState, setEmailNotificationState] = useState(
    userData.userProfileData.recieveEmailNotifications
  );

  const userDataCheck = (user) => {
    debug && console.log("[EmailNotificationCheck] UserData: ", user);
    if (user.first == "" || user.last == "") {
      setShowDataForm(true);
    }
  };

  useEffect(() => {
    userDataCheck(userData);
  }, []);

  const handleFormSubmission = (event) => {
    debug && console.log("[EmailNotificationCheck] Event Data: ", event);

    LazyFetch({
      type: "put",
      endpoint: "/update-user-data",
      data: {
        userId: userData._id,
        receiveEmailNotifications: emailNotificationState,
      },
      onSuccess: (response) => {
        debug &&
          console.log("[EmailNotificationCheck] PUT Response: ", response);
        setShowDataForm(false);

        fetchUser(setUser);
      },
      onFailure: (error) => {
        debug && console.log("[EmailNotificationCheck] Error: ", error);
      },
    });
  };

  return (
    <>
      <Wrapper id={`modal-wrapper`}>
        {showDataForm && (
          <Modal
            close={() => {
              setShowDataForm(false);
            }}
            width={`50vw`}
            data-testid="user-data-form-modal"
            customBorder={css`
              border: 0.25em solid #e9e9e9;
              border-radius: 4px;
            `}
          >
            <ModalWrapper>
              <h1>Would you like to receive email notifications?</h1>
              <h4>
                We have implemented a new email update system so that you can
                recieve email notifications about updates to your courses. These
                emails will include information such as:
              </h4>
              <ul style={{ margin: `0 0 0 2em`, listStyleType: `circle` }}>
                <li>When new Posts are made</li>
                <li>When you recieve comments / replies on your Posts</li>
                <li>When the Instructor makes an Announcement</li>
              </ul>

              <br />

              <div id={`change-form`}>
                {/* <MaterialCheckbox
                  label={"Recieve Email Notifications"}
                  checkedState={{
                    checked: emailNotificationState,
                    toggleChecked: setEmailNotificationState,
                  }}
                /> */}
                {emailNotificationState ? (
                  <Button
                    secondary
                    buttonWidth={`6em`}
                    buttonHeight={`2em`}
                    onClick={(event) => {
                      setEmailNotificationState(false);
                    }}
                  >
                    Yes
                  </Button>
                ) : (
                  <Button
                    secondary
                    buttonWidth={`6em`}
                    buttonHeight={`2em`}
                    onClick={(event) => {
                      setEmailNotificationState(true);
                    }}
                  >
                    No
                  </Button>
                )}
                <Button
                  primary
                  onClick={handleFormSubmission}
                  buttonWidth={`6em`}
                  buttonHeight={`2em`}
                >
                  Submit
                </Button>
              </div>
            </ModalWrapper>
          </Modal>
        )}
      </Wrapper>
    </>
  );
};

export default EmailNotificationCheck;

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

  /* border: 2px solid #e9e9e9;
  border-radius: 4px; */

  h1 {
    margin-bottom: 1em;
  }

  h4 {
    margin: 1em 0;
  }

  #change-form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 250px;
    margin-left: auto;

    padding: 0.5em 1em;
    border: 2px solid #ededed;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
  }
`;
