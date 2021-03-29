import axios from "axios";

const LazyFetch = ({
  type,
  url = process.env.REACT_APP_SERVER_URL,
  endpoint,
  data = null,
  onSuccess,
  onFailure,
}) => {
  axios[type](url + endpoint, data, { withCredentials: true })
    .then((response) => {
      console.log(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((err) => {
      if (onFailure) {
        onFailure(err);
      } else if (err.response && err.response.data) {
        // Set the errors provided by our API request
        console.log(err.response.data.errors);
      } else {
        console.log("An error occurred");
      }
    });
};

export default LazyFetch;
