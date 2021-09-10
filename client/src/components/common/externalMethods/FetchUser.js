import LazyFetch from "../requests/LazyFetch";

export const fetchUser = (setUser) => {
  LazyFetch({
    type: "get",
    endpoint: "/me",
    onSuccess: (data) => {
      if (data && data._id) {
        setUser(data);
      }
    },
    onFailure: (err) => {
      console.log("Error completing sign in:", err);
      setUser(false);
    },
  });
};
