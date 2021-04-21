import React, { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import ConfigPanel from "./ConfigButtonPanel";
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
  var count = 0;

  for (let i = 0; i < user.courses.length; i++) {
    if (user?.courses[i].courseId == courseId) {
      userIsAdmin = user.courses[i].admin;
    }
  }

  // let userCopy = user;
  // DeleteUserCourse(userCopy, courseId);

  // console.log("Course ID: ", courseId);

  const GoHome = () => {
    history.push("/");
  };

  return (
    <ConfigWrapper>
      <ScrollingDiv>
        {userIsAdmin && <h1>THIS IS THE CONFIG PAGE</h1>}

        {userIsAdmin && (
          <ConfigPanel panelText="This is the button description for the 'other' button. It does nothing.">
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
          </ConfigPanel>
        )}

        {userIsAdmin && (
          <ConfigPanel
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
          </ConfigPanel>
        )}

        {!userIsAdmin && <h1>ACCESS DENIED</h1>}

        {!userIsAdmin && (
          <ConfigPanel panelText="You're not authorized to view this page.">
            <Button
              primary
              buttonWidth={"200px"}
              buttonHeight={"2.2rem"}
              onClick={() => {
                let c = true;
                count++;
                while (c) {
                  c = window.confirm(
                    "Number of times you clicked something after being told not to: " +
                      count.toString()
                  );
                  count++;
                }

                alert(
                  "You'll have illegally clicked " +
                    (++count).toString() +
                    " times after you dismiss this alert"
                );
              }}
            >
              Don't click ANYTHING
            </Button>
          </ConfigPanel>
        )}

        {/* KEEP THE OVERFLOW COUNTER IT HELPS WITH OVERFLOW
            at the bottom of the scrolling div. */}
        <OverflowCounter offsetAmount={"30px"}></OverflowCounter>
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

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
const OverflowCounter = styled.div`
  width: 100%;
  ${(props) =>
    props.offsetAmount &&
    css`
      padding: ${props.offsetAmount};
    `}
`;
