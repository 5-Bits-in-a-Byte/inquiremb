import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControlLabel } from "@material-ui/core";

const MaterialCheckbox = ({ label, checkedState }) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedState.checked}
            onChange={(e) => {
              checkedState.toggleChecked(!checkedState.checked);
            }}
          />
        }
        label={label}
      />
    </>
  );
};

export default MaterialCheckbox;
