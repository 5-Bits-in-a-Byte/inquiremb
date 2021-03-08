import axios from "axios";

const LazyFetch = ({
  type,
  url = process.env.REACT_APP_SERVER_URL,
  endpoint,
  data = null,
  onSuccess,
}) => {
  axios[type](url + endpoint, data, { withCredentials: true })
    .then((response) => {
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        // Set the errors provided by our API request
        console.log(err.response.data.errors);
      } else {
        // setRes({
        //   ...res,
        //   errors: [
        //     "There was an error creating the course. Please try again.",
        //   ],
        //   loading: false,
        // });
      }
    });
};

export default LazyFetch;
