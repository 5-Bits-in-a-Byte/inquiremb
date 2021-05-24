import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { UserContext } from "../context/UserProvider";
import AboutUser from "./AboutUser";

const UserProfile = ({ props }) => {
  const user = useContext(UserContext);
  return (
    <>
      <Wrapper>
        <ScrollingDiv>
          <AboutUser userObject={user} />
          {/* <h3>{JSON.stringify(user, null, 2)}</h3> */}
          {/* KEEP THE OVERFLOW COUNTER IT HELPS WITH OVERFLOW
            at the bottom of the scrolling div. */}
          {/* <OverflowCounter offsetAmount={"2em"}></OverflowCounter> */}
        </ScrollingDiv>
      </Wrapper>
    </>
  );
};

export default UserProfile;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  /* align-items: center; */
  justify-content: center;

  /* overflow: scroll; */
  white-space: pre;

  /* width: calc(100% - 15px); */
  height: calc(100vh - 66px);

  /* border: 1px solid red; */
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  /* padding: 2rem 4rem 0 4rem; */

  overflow: auto;
`;

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
// const OverflowCounter = styled.div`
//   width: 100%;
//   ${(props) =>
//     props.offsetAmount &&
//     css`
//       padding: ${props.offsetAmount};
//     `}
//   border: 3px solid black;
// `;
