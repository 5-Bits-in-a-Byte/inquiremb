import React, { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import ConfigPanel from "./ConfigPanel";
import ConfigButtonPanel from "./ConfigButtonPanel";
import Button from "../common/Button";
import LazyFetch from "../common/requests/LazyFetch";
import { UserContext, UserDispatchContext } from "../context/UserProvider";
import { DeleteUserCourse } from "../common/stateManagement/UpdateUser.js";

/** ConfigView
 * @brief The webpage for the config panel of each course
 *
 * @param {any} props catches all of the component props
 * @returns ConfigView Component
 */
const ConfigView = ({ props }) => {
  let history = useHistory();
  const { courseId } = useParams();
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  var userIsAdmin = false;

  // Checks if the user has admin level privledge in this course.
  // TODO: Refactor with the introduction of Roles
  for (let i = 0; i < user.courses.length; i++) {
    if (user?.courses[i].courseId == courseId) {
      userIsAdmin = user.courses[i].admin;
    }
  }
  // ------------------------------------------------------------

  /**
   * Redirects the user to the landing page
   */
  const GoHome = () => {
    history.push("/");
  };

  return (
    <ConfigWrapper>
      <ScrollingDiv>
        <CenterContent>
          {userIsAdmin ? (
            <h1 style={{ margin: `0 0 1rem 0` }}>THIS IS THE CONFIG PAGE</h1>
          ) : (
            <h1>ACCESS DENIED</h1>
          )}

          {userIsAdmin ? <ConfigPanel></ConfigPanel> : <></>}

          {userIsAdmin ? (
            <ConfigButtonPanel panelText="This is the button description for the 'other' button. It does nothing.">
              <Button
                primary
                buttonWidth={"200px"}
                buttonHeight={"2.2rem"}
                onClick={() => {
                  alert("This literally doesn't do anything...");
                }}
              >
                Other Button
              </Button>
            </ConfigButtonPanel>
          ) : (
            <></>
          )}

          {userIsAdmin && (
            <ConfigButtonPanel
              panelText={
                "Click here to delete the course. WARNING once deleted there is no undoing."
              }
            >
              <Button
                primary
                buttonColor={"#DC2B2B"}
                buttonWidth={"200px"}
                buttonHeight={"2.2rem"}
                onClick={() => {
                  let c = window.confirm(
                    "Are you sure you want to delete this course?"
                  );
                  if (c == true) {
                    LazyFetch({
                      type: "delete",
                      endpoint: "/api/courses?courseId=" + courseId,
                      onSuccess: (data) => {
                        alert("delete request success.");
                        let userCopy = user;
                        DeleteUserCourse(userCopy, courseId);
                        setUser(userCopy);
                        GoHome();
                      },
                      onFailure: (err) => {
                        alert("delete request failed, ", err?.response);
                      },
                    });
                  } else {
                    alert("You canceled the delete request.");
                  }
                }}
              >
                Delete Course
              </Button>
            </ConfigButtonPanel>
          )}

          {/* KEEP THE OVERFLOW COUNTER IT HELPS WITH OVERFLOW
            at the bottom of the scrolling div. */}
          <OverflowCounter offsetAmount={"30px"}></OverflowCounter>
        </CenterContent>
      </ScrollingDiv>
    </ConfigWrapper>
  );
};

export default ConfigView;

const ConfigWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 2rem 4rem 0 4rem;

  overflow: auto;
`;

const CenterContent = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center; */
`;

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
const OverflowCounter = styled.div`
  width: 100%;
  ${(props) =>
    props.offsetAmount &&
    css`
      padding: ${props.offsetAmount};
    `}
`;
