import LazyFetch from "../requests/LazyFetch";

export const fetchUser = (setUser, debug) => {
  LazyFetch({
    type: "get",
    endpoint: "/me",
    onSuccess: (data) => {
      if (data && data._id) {
        setUser(data);
        debug && console.log("Fetched User: ", data);
      }
    },
    onFailure: (err) => {
      console.log("Error completing sign in:", err);
      setUser(false);
    },
  });
};
