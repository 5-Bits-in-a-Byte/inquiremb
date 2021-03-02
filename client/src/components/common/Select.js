import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

/* Read about react-select props here: https://react-select.com/props */
export default ({ options, ...props }) => (
  <Select options={options} styles={customStyles} {...props} />
);

Select.propTypes = {
  /* Takes an array of objects as options */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

/* Custom styles for selector */
const customStyles = {
  control: (provided) => ({
    ...provided,
    // none of react-select's styles are passed to <Control />
    border: "1px solid #818181",
    fontSize: 14,
    height: 33,
    minHeight: 33,
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 33,
    padding: "0 4px",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "33px",
    padding: "8px",
  }),
};
