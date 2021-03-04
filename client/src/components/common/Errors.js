import React from "react";
import PropTypes from "prop-types";

const Errors = ({ errors, margin }) => {
  console.log(errors);
  if (!errors || errors.length < 1) {
    return null;
  }
  return (
    <div style={{ marginTop: margin || 10 }}>
      {errors.map((err, index) => (
        <p className="alert-color" key={index}>
          {err}
        </p>
      ))}
    </div>
  );
};

export default Errors;

Errors.propTypes = {
  /* Array of strings containing error messages */
  errors: PropTypes.arrayOf(PropTypes.string),
  /* Top margin for error div */
  margin: PropTypes.number,
};
