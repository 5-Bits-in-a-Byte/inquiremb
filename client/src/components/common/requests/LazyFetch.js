import axios from "axios";

/** LazyFetch Function
 * A wrapper function for lazy fetching with axios.
 *
 * @param {string} type the axios type for this fetch.
 * @param {string} url the url to fetch from.
 * @param {string} endpoint the endpoint.
 * @param {object} data json object with data?
 * @param {function} onSuccess function handler for successful fetch.
 * @param {function} onFailure function handler for unsuccesful fetch.
 * @returns void
 */
const LazyFetch = ({
  type,
  url = process.env.REACT_APP_SERVER_URL,
  endpoint,
  data = null,
  onSuccess,
  onFailure,
}) => {
  const full_url = url + endpoint;
  axios({
    method: type,
    url: full_url,
    data: data,
    withCredentials: true,
  })
    .then((response) => {
      // console.log(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
    })
    .catch((err) => {
      if (onFailure) {
        onFailure(err);
      } else if (err.response && err.response.data) {
        // Set the errors provided by our API request
        // console.log(err.response.data.errors);
      } else {
        // console.log("An error occurred");
      }
    });
};

export default LazyFetch;
