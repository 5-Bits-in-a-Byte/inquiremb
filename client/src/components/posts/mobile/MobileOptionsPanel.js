import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { useWindowDimensions } from "../../common/CustomHooks";
import Button from "../../common/Button";
import CogIcon from "../../../imgs/settings 1.svg";
import { useContext } from "react";
import { UserRoleContext } from "../../context/UserRoleProvider";
import { ColorContext } from "../../context/ColorModeContext";

const MobileOptionsPanel = ({ courseId, children, ...props }) => {
  const [panelPermissions, setPanelPermissions] = useState(null);

  const userRole = useContext(UserRoleContext);

  const theme = useContext(ColorContext);

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

  return (
    <>
      <Wrapper>
        {/* {width >= 768 ? <OptionsHeader>OPTIONS</OptionsHeader> : <></>} */}
        {/* <OptionsHeader>OPTIONS</OptionsHeader> */}
        <OptionsPanelWrapper>
          {panelPermissions && panelPermissions.displayDraftPost && (
            <Link
              style={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
              }}
              to={"/course/" + courseId + "/post/newQorA"}
            >
              <Button
                primary
                autoWidth
                enableMargin={"0.5em"}
                style={{ backgroundColor: `${theme.blueToLightGreyButton}` }}
              >
                Draft Post
              </Button>
            </Link>
          )}
          {panelPermissions && panelPermissions.displayDraftPoll && (
            <Link
              style={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
              }}
              to={"/course/" + courseId + "/post/newPoll"}
            >
              <Button
                primary
                autoWidth
                enableMargin={"0.5em"}
                style={{ backgroundColor: `${theme.blueToLightGreyButton}` }}
              >
                Draft Poll
              </Button>
            </Link>
          )}

          {/* The Config page conditionally renders based on whether or not
            the user has ADMIN priviledges for this course */}
          {panelPermissions &&
            (panelPermissions.userIsAdmin ||
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
                  <img
                    src={CogIcon}
                    alt="Config Page Button Icon"
                    style={{ filter: `${theme.iconBrightness}` }}
                  />
                </Button>
              </Link>
            )}
        </OptionsPanelWrapper>
      </Wrapper>
    </>
  );
};

export default MobileOptionsPanel;

const Wrapper = styled.div`
  width: 100%;
  /* padding: 1em; */
  margin: 0 0 2em 0;
`;

const OptionsPanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* background: #fff; */
  width: 100%;
  /* padding: 14px; */
  /* border-radius: 5px; */

  /* box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07); */
`;
