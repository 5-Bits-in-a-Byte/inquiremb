import axios from "axios";
import React, { useEffect, useState } from "react";

/** Fetch Function
 * A Wrapper function for hanlding useState / useEffect when fetching using axios.
 *
 * @param {string} type the axios type for this fetch.
 * @param {string} url the url to fetch from.
 * @param {string} endpoint the endpoint.
 * @returns
 */
const Fetch = ({ type, url = process.env.REACT_APP_SERVER_URL, endpoint }) => {
  useEffect(() => {
    setRes({ ...res, loading: true });
    axios[type](url + endpoint, { withCredentials: true })
      .then((response) => {
        setRes({ ...res, data: response.data, loading: false });
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          // Set the errors provided by our API request
          // console.log(err.response.data.errors);
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
  }, [endpoint]);
  const [res, setRes] = useState({ data: null, errors: null, loading: false });
  return res;
};

export default Fetch;
