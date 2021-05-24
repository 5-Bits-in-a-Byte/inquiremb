import React, { createContext, useEffect, useState } from "react";
import LazyFetch from "../common/requests/LazyFetch";

const UserRoleContext = createContext(undefined);
const UserRoleDispatchContext = createContext(undefined);

function UserRoleProvider({ children }) {
  const [userRoleDetails, setUserRoleDetails] = useState(null);

  useEffect(() => {
    // LazyFetch({
    //   type: "get",
    //   endpoint: "",
    //   onSuccess: () => {},
    //   onFailure: () => {},
    // });
  }, [userRoleDetails]);

  return (
    <UserRoleContext.Provider value={userRoleDetails}>
      <UserRoleDispatchContext.Provider value={setUserRoleDetails}>
        {children}
      </UserRoleDispatchContext.Provider>
    </UserRoleContext.Provider>
  );
}

export { UserRoleProvider, UserRoleContext, UserRoleDispatchContext };
