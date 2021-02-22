import React from "react";
import styled from "styled-components";
import SectionTab from "./SectionTab";

const ClassView = (params) => {
  return (
    <Sidebar>
      <ClassTitle>CIS 422</ClassTitle>

      <hr style={InlineHRStyle}/>

      <ClassSection>
        <SectionTab />
      </ClassSection>
      <UserSection>

      </UserSection>
    </Sidebar>
  );
}

export default ClassView;

const Sidebar = styled.div`
  // border: 1px solid #000;
  width: 200px;
  height: calc(100vh - 55px);

  box-shadow: 5px 2px 6px -2px rgba(0, 0, 0, 0.5);
`;

const ClassTitle = styled.h1`
  // border: 3px solid blue;
  height: 2em;

  line-height: 2em;
  font-size: 1.5rem;
  text-align: center;
`;

const ClassSection = styled.div`
  border: 3px solid green;
`;

const UserSection = styled.div`
  border: 3px solid yellow;
`;

const InlineHRStyle = {
  width : "75%"
}
