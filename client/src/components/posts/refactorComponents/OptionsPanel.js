import React from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import Button from "../../common/Button";
import { Link } from "react-router-dom";
import CogIcon from "../../../imgs/settings 1.svg";

const OptionsPanel = ({ userRole, ...props }) => {
  var { courseId } = useParams();
  var userIsAdmin = userRole ? userRole.admin.config : false;

  return (
    <Wrapper>
      <OptionsHeader>Options</OptionsHeader>
      <Panel>
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
      </Panel>
    </Wrapper>
  );
};

export default OptionsPanel;

const Wrapper = styled.div`
  width: 100%;
  /* border: 1px solid red; */
`;

const OptionsHeader = styled.h1`
  margin: 3em 0 2em 0;

  font-size: 14px;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 220px;
  padding: 14px;
  border-radius: 5px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;
