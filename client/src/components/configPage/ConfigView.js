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
import LoadingDots from "../common/animation/LoadingDots";

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

/** ConfigView
 * @brief The webpage for the config panel of each course
 *
 * @param {any} props catches all of the component props
 * @returns ConfigView Component
 */
const ConfigView = ({ props }) => {
  const [loading, setLoading] = useState(true);

  let history = useHistory();
  const { courseId } = useParams();
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  const userRole = useContext(UserRoleContext);
  const setUserRole = useContext(UserRoleDispatchContext);

  const attemptGetUserRole = (courseId) => {
    LazyFetch({
      type: "get",
      endpoint: "/userRole/" + courseId,
      onSuccess: (role) => {
        if (role) {
          setUserRole(role);
        } else {
          // console.log("Err: role is null / none / etc.");
        }
      },
      onFailure: (err) => {
        // console.log(
        //   "Error getting user role object from {" + courseId + "}:",
        //   err
        // );
        setUserRole(false);
      },
    });
  };

  // State ------------------------------------------------------

  const [courseUsers, setCourseUsers] = useState([
    {
      userName: "NULL USER",
      userIcon: TempIcon,
    },
  ]);

  // const [courseUsers, setCourseUsers] = useState(dummy_users);

  const attemptGetCourseUsers = (courseId) => {
    LazyFetch({
      type: "get",
      endpoint: "/courses/" + courseId + "/users",
      onSuccess: (data) => {
        setCourseUsers(data.data);
      },
      onFailure: (err) => {
        // console.log("Error: Failed GET course users. ", err.response);
      },
    });
  };

  const [roleIdCounter, setRoleIdCounter] = useState(1);
  const [courseRoles, setCourseRoles] = useState(null);

  const attemptGetCourseRoles = (courseId) => {
    LazyFetch({
      type: "get",
      endpoint: "/courses/" + courseId + "/roles",
      onSuccess: (roles) => {
        // console.log("Successfully fetched Course Roles: ", roles);
        setCourseRoles(roles);
      },
      onFailure: (err) => {
        // console.log("Failed to fetch Course Roles. ", err);
      },
    });
  };

  useEffect(() => {
    // console.log("rendered");
    if (!userRole) {
      attemptGetUserRole(courseId);
    }

    if (!courseRoles) {
      attemptGetCourseRoles(courseId);
    }

    if (courseUsers[0].userName == "NULL USER") {
      attemptGetCourseUsers(courseId);
    }

    setTimeout(() => {
      setLoading(false);
    }, 650);
  });

  // console.log("Course Roles: ", courseRoles);
  // ------------------------------------------------------------

  var userIsAdmin = false;
  var userCanBan = false;
  var userCanRemove = false;
  if (userRole) {
    userIsAdmin = userRole.admin.configure;
    userCanBan = userRole.admin.banUsers;
    userCanRemove = userRole.admin.removeUsers;
  }

  /**
   * Redirects the user to the landing page
   */
  const GoHome = () => {
    history.push("/");
  };

  return loading ? (
    <div
      style={{
        width: `100%`,
        margin: `calc(50vh - 64px) 0 0 calc(50vw - 225px)`,
      }}
    >
      <LoadingDots size={48} color={"#4a86fa"} />
    </div>
  ) : (
    <ConfigWrapper>
      <ScrollingDiv>
        {/* <CenterContent> */}
        {userIsAdmin || userCanBan || userCanRemove ? (
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

        {userIsAdmin || userCanBan || userCanRemove ? (
          <ConfigButtonPanel panelText="Press here to navigate back to the course page.">
            <Button
              primary
              buttonWidth={"200px"}
              buttonHeight={"2.2rem"}
              onClick={() => {
                history.push("/course/" + courseId);
              }}
            >
              Back To Course View
            </Button>
          </ConfigButtonPanel>
        ) : (
          <></>
        )}

        {userIsAdmin || userCanBan || userCanRemove ? (
          // <CenterContent>
          <ConfigPanel
            courseId={courseId}
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
                    endpoint: "/courses?courseId=" + courseId,
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
