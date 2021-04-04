import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

/**
 * Read about react-select props here: https://react-select.com/props
 */
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
    fontSize: 16,
    height: 35,
    minHeight: 35,
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 35,
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
    height: "35px",
    padding: "8px",
  }),
};
