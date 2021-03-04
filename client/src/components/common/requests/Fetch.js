import axios from "axios";
import React, { useEffect, useState } from "react";

const Fetch = ({ type, url = process.env.REACT_APP_SERVER_URL, endpoint }) => {
  const [res, setRes] = useState({ data: null, errors: null, loading: false });
  useEffect(() => {
    setRes({ ...res, loading: true });
    axios[type](url + endpoint, { withCredentials: true })
      .then((response) => {
        setRes({ ...res, data: response.data, loading: false });
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          // Set the errors provided by our API request
          console.log(err.response.data.errors);
          setRes({ ...res, errors: err.response.data.errors, loading: false });
        } else {
          setRes({
            ...res,
            errors: [
              "There was an error creating the course. Please try again.",
            ],
            loading: false,
          });
        }
      });
  });
  return res;
};

export default Fetch;
