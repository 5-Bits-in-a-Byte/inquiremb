import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import CogIcon from "../../imgs/settings 1.svg";

/**
 * Options Component ~ Button side panel for displaying buttons for the user
 *
 * @param {string} courseId given to the "+ New Post" button to route to the Post form page
 */
const Options = ({ courseId }) => {
  const user = useContext(UserContext);
  console.log("User Object: ", user);

  // Will be used to conditionally render the config page button
  var userIsAdmin = false;

  // Checks the current user course for Admin privledge status
  // sets the above 'userIsAdmin' variable accordingly
  for (let i = 0; i < user.courses.length; i++) {
    if (user?.courses[i].courseId == courseId) {
      userIsAdmin = user.courses[i].admin;
    }
  }

  // console.log(userIsAdmin);

  return (
    <OptionsWrapper>
      <OptionsHeader>OPTIONS</OptionsHeader>
      <OptionsPanel>
        <Link
          style={{
            width: "100%",
            textDecoration: "none",
            display: "flex",
          }}
          to={"/course/" + courseId + "/post/new"}
        >
          <Button primary autoWidth enableMargin={"0.5em"}>
            Draft Post
          </Button>
        </Link>
        <Link
          style={{
            width: "100%",
            textDecoration: "none",
            display: "flex",
          }}
          to={"#"}
        >
          <Button
            primary
            autoWidth
            enableMargin={"0.5em"}
            onClick={() => alert("The feature has not yet been implemented...")}
          >
            Draft Poll
          </Button>
        </Link>

        {/* The Config page conditionally renders based on whether or not
            the user has ADMIN priviledges for this course */}
        {userIsAdmin && (
          <Link
            style={{
              width: "100%",
              textDecoration: "none",
              display: "flex",
            }}
            to={"/config"}
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
      </OptionsPanel>
    </OptionsWrapper>
  );
};

Options.propTypes = {
  courseId: PropTypes.string,
};

export default Options;

//#region Options Stylings
const OptionsWrapper = styled.div`
  width: 280px; // Need to make same width as nav + menu bar
  flex-grow: 1;
  position: absolute;
  right: -40px;
  top: 0;
`;

const OptionsHeader = styled.h1`
  margin: 3em 0 2em 0;

  font-size: 14px;
`;

const OptionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 220px;
  padding: 14px;

  // border: 1px solid black;
  border-radius: 5px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;
//#endregion
