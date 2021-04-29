import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../../common/Button";
import Menu from "@material-ui/core/Menu";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const MaterialDropDownGroup = ({
  initialState,
  roleObject,
  matDropShape,
  ...props
}) => {
  const [anchorEl, setanchorEl] = useState(null);

  const handleClick = (event) => {
    setanchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setanchorEl(null);
  };

  return (
    <>
      <DropdownWrapper>
        <Button
          primary
          buttonWidth={"110px"}
          buttonHeight={"28px"}
          onClick={handleClick}
        >
          {matDropShape.name}
        </Button>
        <Menu
          id={matDropShape.name + " Menu"}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <FormGroup>
            {matDropShape.items.map((formLabels, index) => (
              <FormControlLabel
                key={index}
                style={{ margin: `0`, padding: `0 1em` }}
                control={
                  <Checkbox
                    checked={initialState[formLabels.stateLabel]}
                    onChange={(e) => {
                      console.log(
                        formLabels?.itemLabel + " value changed: ",
                        e.target.checked
                      );
                      formLabels.changeRoleVal(e.target.checked);
                    }}
                  />
                }
                label={formLabels?.itemLabel}
              />
            ))}
          </FormGroup>
        </Menu>
      </DropdownWrapper>
    </>
  );
};

export default MaterialDropDownGroup;

const DropdownWrapper = styled.div`
  width: 110px;
  height: 28px;
  /* padding: 0 1rem; */

  background: #e7e7e7;
  /* border: 1px solid black; */
  border-radius: 4px;
`;
