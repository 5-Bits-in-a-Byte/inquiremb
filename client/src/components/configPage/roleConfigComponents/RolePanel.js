import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../../common/Button";
import PencilIcon from "../../../imgs/pencil.svg";
import Input from "../../common/Input";
import DraftTextArea from "../../common/DraftTextArea";

const RolePanel = ({ roleName, ...props }) => {
  const [nameField, setNameField] = useState(roleName);
  const [nameFieldState, setNameFieldState] = useState(true);

  console.log("Name Field = ", nameField);

  return (
    <RolePanelWrapper>
      <RoleNameWrapper>
        {nameFieldState ? (
          <RoleName style={{ margin: `0 1rem 0 0` }}>{nameField}</RoleName>
        ) : (
          // <Input placeholder={"Enter new name..."} />
          <DraftTextArea
            minRows={1}
            style={{ width: `150px` }}
            onChange={(e) => {
              console.log(e.target.value);
              setNameField(e.target.value);
            }}
          />
        )}

        <Button
          primary
          buttonColor={"rgba(0, 0, 0, 0.0)"}
          onClick={() => {
            setNameFieldState(!nameFieldState);
            // alert(
            //   "This feature is work in progress. This will allow the user to change the name of the Role."
            // );
          }}
        >
          <ChangeNameIcon src={PencilIcon} />
        </Button>
      </RoleNameWrapper>
    </RolePanelWrapper>
  );
};

export default RolePanel;

const RolePanelWrapper = styled.div`
  margin: 1rem 0;
  padding: 0.25rem;

  /* box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07); */
  border: 2px solid #e7e7e7;
  border-radius: 5px;
`;

const RoleNameWrapper = styled.div`
  display: flex;
  align-items: center;

  margin: 1rem;
`;

const RoleName = styled.p`
  font-size: 16px;
  font-weight: 700;
`;

const ChangeNameIcon = styled.img`
  width: 10px;
  height: 10px;
`;
