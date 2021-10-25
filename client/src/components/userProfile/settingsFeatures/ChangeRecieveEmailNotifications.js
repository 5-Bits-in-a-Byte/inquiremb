import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import { fetchUser } from "../../common/externalMethods/FetchUser";
import LazyFetch from "../../common/requests/LazyFetch";
import { UserContext, UserDispatchContext } from "../../context/UserProvider";

const ChangeRecieveEmailNotifications = ({ debug, ...props }) => {
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  console.log(user);

  const [emailNotificationState, setEmailNotificationState] = useState(
    user.userProfileData.receiveEmailNotifications
  );

  useEffect(() => {
    console.log("State - ", emailNotificationState);
  }, [emailNotificationState]);

  const handleFormSubmission = (event) => {
    debug &&
      console.log("[ChangeRecieveEmailNotifications] Event Data: ", event);

    LazyFetch({
      type: "put",
      endpoint: "/update-user-data",
      data: {
        userId: user._id,
        receiveEmailNotifications: emailNotificationState,
      },
      onSuccess: (response) => {
        debug &&
          console.log(
            "[ChangeRecieveEmailNotifications] PUT Response: ",
            response
          );
        // setShowDataForm(false);

        fetchUser(setUser);
      },
      onFailure: (error) => {
        debug &&
          console.log("[ChangeRecieveEmailNotifications] Error: ", error);
      },
    });
  };

  return (
    <>
      <Wrapper>
        <h4 style={{ margin: `0 0 1em 0` }}>Recieve Email Notifications</h4>
        <div id={`change-form`}>
          {emailNotificationState ? (
            <Button
              secondary
              buttonWidth={`6em`}
              buttonHeight={`2em`}
              // style={{ margin: `0em 0 1em 0` }}
              onClick={(event) => {
                event.stopPropagation();
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
              // style={{ margin: `0em 0 1em 0` }}
              onClick={(event) => {
                event.stopPropagation();
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
      </Wrapper>
    </>
  );
};

export default ChangeRecieveEmailNotifications;

const Wrapper = styled.div`
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
