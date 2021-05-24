import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import LazyFetch from "../common/requests/LazyFetch";

const UserRoleContext = createContext(undefined);
const UserRoleDispatchContext = createContext(undefined);

const attemptGetUserRole = (courseId, setUserRole) => {
  LazyFetch({
    type: "get",
    endpoint: "/api/userRole/" + courseId,
    onSuccess: (role) => {
      if (role) {
        setUserRole(role);
      }
    },
    onFailure: (err) => {
      console.log(
        "Error getting user role object from {" + courseId + "}:",
        err
      );
      setUserRole(null);
    },
  });
};

function UserRoleProvider({ children }) {
  const { courseId } = useParams();
  const [userRoleDetails, setUserRoleDetails] = useState(null);
  const [currCourseId, setCurrCourseId] = useState(courseId);

  useEffect(() => {
    if (!userRoleDetails) attemptGetUserRole(courseId, setUserRoleDetails);
    if (currCourseId != courseId) {
      attemptGetUserRole(courseId, setUserRoleDetails);
      setCurrCourseId(courseId);
    }
  });

  return (
    <UserRoleContext.Provider value={userRoleDetails}>
      <UserRoleDispatchContext.Provider value={setUserRoleDetails}>
        {children}
      </UserRoleDispatchContext.Provider>
    </UserRoleContext.Provider>
  );
}

export {
  UserRoleProvider,
  UserRoleContext,
  UserRoleDispatchContext,
  attemptGetUserRole,
};
