import React from "react";
import styled from "styled-components";

const Home = () => {
  return (
    <Wrapper>
      <ViewWrapper>
        <AbsoluteWrapper>
          <ScrollingDiv>
            <MaxWidth>
              <RecentGroup>
                <GroupWrapper>
                  lknd lknlskd klsd klgdsk gdskl gjslk lgkdjkls gjlkd jkl adsdas
                  faf d fsdf sdf s fsd fsdf sdfsdfsd sdf sdsd fdsf sd dsf sdf sd
                  fsdf sdf sd fdsdf sf s fs gf gdfg fdg fd gfdg fdg df kmgdfklg
                  mdlkfg mkdfg df gldmn g fg
                </GroupWrapper>
              </RecentGroup>
              <RecentGroup>
                <GroupWrapper>
                  lknd lknlskd klsd klgdsk gdskl gjslk lgkdjkls gjlkd jkl adsdas
                  faf d fsdf sdf s fsd fsdf sdfsdfsd sdf sdsd fdsf sd dsf sdf sd
                  fsdf sdf sd fdsdf sf s fs gf gdfg fdg fd gfdg fdg df kmgdfklg
                  mdlkfg mkdfg df gldmn g fg
                </GroupWrapper>
              </RecentGroup>
              <RecentGroup>
                <GroupWrapper>
                  lknd lknlskd klsd klgdsk gdskl gjslk lgkdjkls gjlkd jkl adsdas
                  faf d fsdf sdf s fsd fsdf sdfsdfsd sdf sdsd fdsf sd dsf sdf sd
                  fsdf sdf sd fdsdf sf s fs gf gdfg fdg fd gfdg fdg df kmgdfklg
                  mdlkfg mkdfg df gldmn g fg
                </GroupWrapper>
              </RecentGroup>
            </MaxWidth>
          </ScrollingDiv>
        </AbsoluteWrapper>
      </ViewWrapper>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ViewWrapper = styled.div`
  position: relative;
  width: 100%;
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

const AbsoluteWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ScrollingDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 280px 0 200px;
  overflow: auto;
  padding-right: 280px;
`;

const MaxWidth = styled.div`
  max-width: 900px;
  margin: auto;
  padding-bottom: 40px;
`;
