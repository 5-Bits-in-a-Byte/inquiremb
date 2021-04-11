import React from "react";
import PropTypes from "prop-types";

/** Errors Component
 * Componenet to display errors inside other components to the User.
 *
 * @param {array} errors array of strings containing error messages.
 * @param {number} margin Styling margin for the text container.
 * @returns Component with text describing an error.
 */
const Errors = ({ errors, margin }) => {
  //console.log(errors);
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
