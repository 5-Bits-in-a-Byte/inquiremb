import React, { Children, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserProvider";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import CogIcon from "../../imgs/settings 1.svg";
import { useWindowDimensions } from "../common/CustomHooks";

/**
 * Options Component ~ Button side panel for displaying buttons for the user
 *
 * @param {string} courseId given to the "+ New Post" button to route to the Post form page
 */
const OptionsPanel = ({ userRole, courseId, ...props }) => {
  const [panelPermissions, setPanelPermissions] = useState(null);

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (userRole)
      setPanelPermissions({
        userIsAdmin: userRole.admin.configure,
        userCanBan: userRole.admin.banUsers,
        userCanRemove: userRole.admin.removeUsers,
        displayDraftPost:
          userRole.publish.question ||
          userRole.publish.announcement ||
          userRole.publish.general,
        displayDraftPoll: userRole.publish.poll,
      });
  }, [userRole]);

  if (
    !userRole ||
    !panelPermissions ||
    (!panelPermissions.displayDraftPoll &&
      !panelPermissions.displayDraftPost &&
      !panelPermissions.userIsAdmin) ||
    width <= 1200
  )
    return <></>;
  else
    return (
      <OptionsWrapper>
        {/* {width >= 768 ? <OptionsHeader>OPTIONS</OptionsHeader> : <></>} */}
        <OptionsHeader>OPTIONS</OptionsHeader>
        <OptionsPanelWrapper>
          {panelPermissions.displayDraftPost && (
            <Link
              style={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
              }}
              to={"/course/" + courseId + "/post/newQorA"}
            >
              <Button primary autoWidth enableMargin={"0.5em"}>
                Draft Post
              </Button>
            </Link>
          )}
          {panelPermissions.displayDraftPoll && (
            <Link
              style={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
              }}
              to={"/course/" + courseId + "/post/newPoll"}
            >
              <Button primary autoWidth enableMargin={"0.5em"}>
                Draft Poll
              </Button>
            </Link>
          )}

          {/* The Config page conditionally renders based on whether or not
            the user has ADMIN priviledges for this course */}
          {(panelPermissions.userIsAdmin ||
            panelPermissions.userCanBan ||
            panelPermissions.userCanRemove) && (
            <Link
              style={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
              }}
              to={"/course/" + courseId + "/config"}
            >
              <Button
                outlineSecondary
                autoWidth
                enableMargin={"0.5em"}
                // onClick={() => alert("This webpage has not yet been set up...")}
              >
                <img src={CogIcon} alt="Config Page Button Icon" />
              </Button>
            </Link>
          )}
        </OptionsPanelWrapper>
      </OptionsWrapper>
    );
};

OptionsPanel.propTypes = {
  courseId: PropTypes.string,
};

export default OptionsPanel;

const OptionsWrapper = styled.div`
  width: 280px; // Need to make same width as nav + menu bar
  flex-grow: 1;
  position: absolute;
  right: -40px;
  top: 120px;

  /* @media only screen and (max-width: 768px) {
    position: auto;
    top: auto;
    right: auto;

    width: 15em;
  } */
`;

const OptionsHeader = styled.h1`
  margin: 3em 0 1em 0;

  font-size: 14px;
`;

const OptionsPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 220px;
  padding: 14px;
  border-radius: 5px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);

  /* @media only screen and (max-width: 768px) {
    min-width: 15em;
    flex-direction: row;
  } */
`;
