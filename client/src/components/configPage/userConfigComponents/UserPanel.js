import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Button from "../../common/Button";
import Dropdown from "../../common/dropdown/Dropdown";
import Arrow from "../../../imgs/carrot-down-secondary.svg";
import LazyFetch from "../../common/requests/LazyFetch";
import Fetch from "../../common/requests/Fetch";
import Modal from "../../common/Modal";
import Errors from "../../common/Errors";

// Hardcoded dummy values
// Ultimately the goal is to pull these from the permissions object in the user context
const UserPerms = { canBan: true, canRemove: true };

/* Handle Role selection in the dropdown */
const GenerateRoleOptions = (roles, courseId, userId, setRoleName) => {
  return roles.map((role) => ({
    onClick: () => {
      LazyFetch({
        type: "put",
        endpoint: "/courses/" + courseId + "/users",
        data: {
          role: role._id,
          user: userId,
        },
        onSuccess: (data) => {
          console.log("Successful PUT (UserPanel). Status: ", data.status);
          alert(role.name + " Role selected and updated.");
          setRoleName(role.name);
        },
        onFailure: (err) => {
          console.log("ERROR: failed PUT (UserPanel): ", err.response);
          alert("There was an error updating the role for this user.");
        },
      });
    },
    label: role.name,
  }));
};

const UserPanel = ({
  userName,
  userRole,
  userImg,
  userId,
  allRoles,
  unbanList,
  ...props
}) => {
  const { courseId } = useParams();

  const name = userRole ? userRole.name : null;

  // State variables
  const [success, toggleSuccess] = useState(null);
  const [errors, toggleErrors] = useState(null);
  const [modalIsShown, toggleModal] = useState(false);
  const [ban, toggleBan] = useState(false);
  const [display, toggleDisplay] = useState("flex");
  const [removed, toggleRemoved] = useState(false);
  const [instructorId, setInstructorId] = useState(null);
  const [roleName, setRoleName] = useState(name);

  // Varaible to store all of the dropdown options
  let realRoleOptions =
    allRoles != null
      ? GenerateRoleOptions(allRoles, courseId, userId, setRoleName)
      : [
          {
            onClick: () => {
              alert("NULL Role selected");
            },
            label: "NULL",
          },
        ];

  const [roleOptions, setRoleOptions] = useState(realRoleOptions);

  // Grab the instructor ID for display purposes later
  useEffect(() => {
    if (instructorId == null) {
      LazyFetch({
        type: "get",
        endpoint: "/courses?courseId=" + courseId,
        onSuccess: (data) => {
          setInstructorId(data.success.instructorID);
        },
        onFailure: () => {
          console.log(
            "There was a problem fetching the course with id",
            courseId
          );
        },
      });
    }
  }, [instructorId]);

  // Handler for banning/removing users in the course
  const handleBanRemove = (banOrRemove) => {
    LazyFetch({
      type: "put",
      endpoint: "/courses/" + courseId + "/ban-remove",
      data: { type: banOrRemove, userId: userId },
      onSuccess: (data) => {
        toggleSuccess(data.success);
        toggleDisplay("none");
        toggleRemoved(true);
      },
      onFailure: (err) => {
        if (err.response && err.response.data) {
          toggleErrors(err.response.data.errors);
        } else {
          var filler;
          if (banOrRemove == "remove") {
            filler = "removing";
          } else {
            filler = "banning";
          }
          toggleErrors([
            "There was an error " +
              filler +
              " " +
              userName +
              " from the course.",
          ]);
        }
      },
    });
  };

  // Variable to identify the course creator
  const isCourseCreator = instructorId == userId;
  const banOrUnban = unbanList ? "unban" : "ban";

  return (
    <>
      {!removed ? (
        <UserPanelWrapper>
          <UserIcon src={userImg} />
          <UserNameWrapper>
            <UserName>{userName}</UserName>
          </UserNameWrapper>

          {!isCourseCreator && !unbanList ? (
            <UserRoleWrapper
              borderColor={userRole.roleColor ? userRole.roleColor : "#e7e7e7"}
            >
              <Dropdown options={roleOptions}>
                <DropdownWrapper className="flex-row align">
                  <RoleDisplay
                    className="font-regular"
                    style={{ cursor: `pointer` }}
                  >
                    {roleName}
                  </RoleDisplay>
                  <ArrowImg src={Arrow} alt="Profile dropdown arrow" />
                </DropdownWrapper>
              </Dropdown>
            </UserRoleWrapper>
          ) : (
            <></>
          )}

          <AdminActionsWrapper>
            {UserPerms.canBan && !isCourseCreator && (
              <Button
                style={{
                  margin: `0 0.5em`,
                  color: `#DC2B2B`,
                  fontWeight: `600`,
                }}
                outlineSecondary
                buttonColor={"#DC2B2B"}
                buttonWidth={"125px"}
                buttonHeight={"2rem"}
                onClick={() => {
                  toggleModal(true);
                  toggleBan(true);
                }}
              >
                {unbanList ? "Unban User" : "Ban User"}
              </Button>
            )}
            {UserPerms.canRemove && !isCourseCreator && !unbanList && (
              <Button
                primary
                buttonColor={"#DC2B2B"}
                buttonWidth={"125px"}
                buttonHeight={"2rem"}
                onClick={() => {
                  toggleModal(true);
                }}
              >
                Remove User
              </Button>
            )}
          </AdminActionsWrapper>
        </UserPanelWrapper>
      ) : (
        <></>
      )}
      {modalIsShown && (
        <Modal
          close={() => {
            toggleModal(false);
            toggleBan(false);
            toggleDisplay("flex");
          }}
          data-testid={"ban-remove-modal"}
        >
          <Wrapper className="flex-col align justify">
            <Title style={{ display: display }}>
              CONFIRM {ban ? "BAN" : "REMOVAL"}
            </Title>
            <Success
              style={
                display == "none" ? { display: "block" } : { display: "none" }
              }
            >
              {success}
            </Success>
            <ContentSection style={{ display: display }}>
              Are you sure you want to {ban ? banOrUnban : "remove"} {userName}{" "}
              from this course?
            </ContentSection>
            <Button
              primary
              autoWidth
              style={{ marginTop: "10px", display: display }}
              onClick={() => {
                if (ban) {
                  handleBanRemove("ban");
                } else {
                  handleBanRemove("remove");
                }
              }}
            >
              Confirm
            </Button>
            <Errors errors={errors} />
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

UserPanel.propTypes = {
  userObject: PropTypes.object,
  userName: PropTypes.string,
};

export default UserPanel;

const Wrapper = styled.div``;

const Title = styled.h4`
  font-size: 25px;
  padding: 0px 0px 10px 0px;
`;

const ContentSection = styled.div`
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
`;

const Success = styled.div`
  display: none;
  text-align: center;
  font-size: 25px;
`;

const UserPanelWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0.75rem 0;
  padding: 0.5rem 0.25rem 0.5rem 1rem;
  border: 2px solid #e7e7e7;
  border-radius: 5px;
  // Allow a little space between the scroll bar and the panel border
  width: 99%;
`;

const UserIcon = styled.img`
  float: left;
  width: 48px;
  height: 48px;
  margin-right: 0.5em;
  //margin-left: 0.5em;
  border-radius: 50%;
  user-select: none;
`;

const UserNameWrapper = styled.div`
  display: flex;
  align-items: left;
  margin: 1rem;
  width: 150px;
`;

const UserRoleWrapper = styled.div`
  display: flex;
  align-items: left;
  margin: 1rem;
  border: 2px solid ${(props) => props.borderColor || "#e7e7e7"};
  padding: 0.25rem 0.5rem 0.25rem 0.5rem;
  border-radius: 5px;
`;

const DropdownWrapper = styled.div`
  &:hover {
    .profile-arrow {
      opacity: 0.5;
    }
    .profile-circle {
      box-shadow: 0 0 3px #4a4a4a;
    }
  }
`;

const RoleDisplay = styled.h4`
  white-space: nowrap;
`;

const ArrowImg = styled.img`
  height: 7px;
  margin-left: 7px;
`;

const AdminActionsWrapper = styled.div`
  display: flex;
  align-items: left;
  justify-content: space-evenly;
  margin: 1rem 0.25rem;
  margin-left: auto;
  width: 275px;
`;

const UserName = styled.p`
  font-size: 16px;
  font-weight: 700;
`;
