import React from "react";
import styled from "styled-components";

const Home = () => {
  return (
    <Wrapper>
      {/* <h1>Home Page</h1>
      <p>Maybe we can do some kind of "recent posts" feed here.</p> */}

      <RecentGroup>
        <GroupWrapper>
          lknd lknlskd klsd klgdsk gdskl gjslk lgkdjkls gjlkd jkl
        </GroupWrapper>
      </RecentGroup>
      <RecentGroup>
        <GroupWrapper>
          lknd lknlskd klsd klgdsk gdskl gjslk lgkdjkls gjlkd jkl
        </GroupWrapper>
      </RecentGroup>
      <RecentGroup>
        <GroupWrapper>
          lknd lknlskd klsd klgdsk gdskl gjslk lgkdjkls gjlkd jkl
        </GroupWrapper>
      </RecentGroup>
    </Wrapper>
  );
};

export default Home;

// const ScrollingDiv = styled.div`
//   position: absolute;
//   display: flex;
//   height: 100%;
//   width: 100%;
//   padding: 0 40px;
//   overflow: auto;
//   //::-webkit-scrollbar {
//   //width: 0; /* Remove scrollbar space */
//   //background: transparent; /* Optional: just make scrollbar invisible */
//   //}
// `;

const Wrapper = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RecentGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
  padding: 1.5em;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const GroupWrapper = styled.div`
  width: 100%;
  min-height: 85px;

  border: 1px solid black;
`;
