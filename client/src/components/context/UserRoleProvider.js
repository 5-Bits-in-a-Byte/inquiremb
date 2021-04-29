import React, { createContext, useState } from "react";

const UserRoleContext = createContext(undefined);
const UserRoleDispatchContext = createContext(undefined);

function UserRoleProvider({ children }) {
  const [userRoleDetails, setUserRoleDetails] = useState(null);

  return (
    <UserRoleContext.Provider value={userRoleDetails}>
      <UserRoleDispatchContext.Provider value={setUserRoleDetails}>
        {children}
      </UserRoleDispatchContext.Provider>
    </UserRoleContext.Provider>
  );
}

export { UserRoleProvider, UserRoleContext, UserRoleDispatchContext };
