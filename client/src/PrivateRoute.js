import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  UserDispatchContext,
  UserContext,
} from "./components/context/UserProvider";
import { fetchUser } from "./components/common/externalMethods/FetchUser";

const PrivateRoute = (props) => {
  const setUser = useContext(UserDispatchContext);
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      fetchUser(setUser);
    }
  });

  return (
    <Route {...props}>
      {user === null ? null : user !== false ? (
        <>{props.children}</>
      ) : (
        <Redirect to="/login" />
      )}
    </Route>
  );
};

export default PrivateRoute;
