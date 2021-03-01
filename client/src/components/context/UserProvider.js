import React, { createContext, useState } from "react";

const UserContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);

/* USER CONTEXT
{
  anonymousId: "sdajoifjowij123"
  email: "alecspringel@gmail.com"
  first: "Alec"
  last: "S"
  picture: "https://googlephotourl.com/user123"
  _cls: "mongo.User"
  _id: "019283409158018"
}
*/

function UserProvider({ children }) {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider value={userDetails}>
      <UserDispatchContext.Provider value={setUserDetails}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext, UserDispatchContext };
