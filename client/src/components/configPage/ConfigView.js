import React, { useState, useContext, useEffect } from "react";
import {
  UserRoleContext,
  UserRoleDispatchContext,
} from "../context/UserRoleProvider";
import { useParams, useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import ConfigPanel from "./ConfigPanel";
import ConfigButtonPanel from "./ConfigButtonPanel";
import Button from "../common/Button";
import LazyFetch from "../common/requests/LazyFetch";
import { UserContext, UserDispatchContext } from "../context/UserProvider";
import { DeleteUserCourse } from "../common/stateManagement/UpdateUser.js";
import TempIcon from "../../imgs/temporary-user-icon.png";

const dummy_usernames = [
  "Amelia Ambassador",
  "Bob Barbeque",
  "Cameron Castle",
  "Devon Detective",
  "Emmet Earl",
  "Fatima Forlorn",
  "Giuseppa Geothermic",
  "Hamlet Hyper",
  "Isabelle Intercontinental",
  "Jillian Jabberwocky",
  "Kerwin Kettle",
  "Lily Lactose",
  "Mark Majestic",
  "Nestor Nasturtium",
  "Olivia Orthogonal",
  "Penelope Pineapple",
  "Quentin Querulous",
  "Robert Redacted",
  "Sharalynn Sombre",
  "Tulio Thermostat",
  "Ursa Ultracentrifuge",
  "Violet Vivisection",
  "Wallace Walrus",
  "X Æ A-XII Xylophone",
  "Yusuf Year",
  "Zainab Zipper",
];

const dummy_users = dummy_usernames.map((username) => ({
  userName: username,
  userImg: TempIcon,
}));

const adminPerms = {
  _id: "1",
  roleName: "Admin Role",
  publish: {
    postComment: true,
    reply: true,
    poll: true,
  },
  delete: {
    postComment: true,
    reply: true,
    poll: true,
  },
  participation: {
    reactions: true,
    voteInPoll: true,
    pin: true,
  },
  edit: {
    postComment: true,
    reply: true,
    poll: true,
  },
  privacy: {
    private: true,
    anonymous: true,
  },
  admin: {
    banUsers: true,
    removeUsers: true,
    announce: true,
    configure: true,
    highlightPost: true,
  },
};

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

  const setUserRole = useContext(UserRoleDispatchContext);
  const userRole = useContext(UserRoleContext);

  const attemptGetUserRole = (courseId) => {
    LazyFetch({
      type: "get",
      endpoint: "/api/userRole/" + courseId,
      onSuccess: (role) => {
        if (role) {
          setUserRole(role);
        }
      },
      onFailure: (err) => {
        console.log(
          "Error getting user role object from {" + courseId + "}:",
          err
        );
        setUserRole(false);
      },
    });
  };

  useEffect(() => {
    console.log("rendered");
    if (!userRole) {
      attemptGetUserRole(courseId);
    }
  });

  // State ------------------------------------------------------
  // var fetchedCourseRoles = null;
  // LazyFetch({
  //   type: "get",
  //   endpoint: "/api/courses/" + courseId + "/roles",
  //   onSuccess: (data) => {
  //     console.log("Successfully fetched Course Roles.");
  //     fetchedCourseRoles = data;
  //   },
  //   onFailure: (err) => {
  //     console.log("Failed to fetch Course Roles.");
  //   },
  // });

  const [courseUsers, setCourseUsers] = useState(dummy_users);

  const [roleIdCounter, setRoleIdCounter] = useState(2);
  const [courseRoles, setCourseRoles] = useState([adminPerms]);
  // console.log("Course Roles", courseRoles);
  // ------------------------------------------------------------

  var userIsAdmin = false;
  if (userRole) userIsAdmin = userRole.admin.configure;

  // ------------------------------------------------------------
  // Checks if the user has admin level privilege in this course.
  // TODO: Refactor with the introduction of Roles
  // for (let i = 0; i < user.courses.length; i++) {
  //   if (user?.courses[i].courseId == courseId) {
  //     userIsAdmin = user.courses[i].admin;
  //   }
  // }
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
        {/* <CenterContent> */}
        {userIsAdmin ? (
          <h1
            style={{
              margin: `0 0 2rem 0`,
              // textShadow: `0px 1px 4px rgba(0, 0, 0, 0.25)`,
            }}
          >
            Manage and Edit Course Configurations:
          </h1>
        ) : (
          <h1 /* style={{ textShadow: `0px 1px 4px rgba(0, 0, 0, 0.25)` }} */>
            ACCESS DENIED
          </h1>
        )}

        {userIsAdmin ? (
          // <CenterContent>
          <ConfigPanel
            courseUsers={courseUsers}
            courseRoles={courseRoles}
            setCourseRoles={setCourseRoles}
            roleIdCounter={roleIdCounter}
            setRoleIdCounter={setRoleIdCounter}
          ></ConfigPanel>
        ) : (
          // </CenterContent>
          <></>
        )}

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
        {/* </CenterContent> */}
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
